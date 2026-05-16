import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';

// Invoke opencli by calling its main.js directly via node
// This avoids Windows cmd.exe encoding issues with Chinese characters
const NPM_DIR = join(process.env.APPDATA || '', 'npm');
const OPENCLI_MAIN = join(NPM_DIR, 'node_modules', '@jackwener', 'opencli', 'dist', 'src', 'main.js');

function resolveCli(): { cmd: string; args: string[] } {
  if (existsSync(OPENCLI_MAIN)) {
    return { cmd: process.execPath, args: [OPENCLI_MAIN] };
  }
  // Fallback for non-standard installations
  if (process.platform === 'win32' && existsSync(join(NPM_DIR, 'opencli.cmd'))) {
    return { cmd: join(NPM_DIR, 'opencli.cmd'), args: [] };
  }
  return { cmd: 'opencli', args: [] };
}

const { cmd: CLI_CMD, args: CLI_PREFIX } = resolveCli();
const DEFAULT_TIMEOUT = 90_000;

export interface OpencliResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export function runOpencli(args: string[], timeoutMs = DEFAULT_TIMEOUT): Promise<OpencliResult> {
  return new Promise((resolve) => {
    const allArgs = [...CLI_PREFIX, ...args];

    const child = spawn(CLI_CMD, allArgs, {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      env: {
        ...process.env,
        OPENCLI_WINDOW: 'background',
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      setTimeout(() => child.kill('SIGKILL'), 3000);
    }, timeoutMs);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, stdout, stderr, exitCode: code });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, stdout, stderr: err.message, exitCode: null });
    });
  });
}

export function parseOpencliYaml<T>(result: OpencliResult): T {
  if (!result.ok && result.exitCode !== 0) {
    if (result.exitCode === 77) {
      throw new Error('需要登录小红书，请在 Edge 浏览器中登录 xiaohongshu.com');
    }
    if (result.exitCode === 69) {
      throw new Error('OpenCLI 浏览器扩展未连接，请打开 Edge 浏览器');
    }
    if (result.stderr.includes('AUTH_REQUIRED') || result.stdout.includes('login wall')) {
      throw new Error('需要登录小红书，请在 Edge 浏览器中登录');
    }
    throw new Error(result.stderr || result.stdout || 'OpenCLI 命令执行失败');
  }

  // Clean progress bar lines from output
  const cleanOutput = result.stdout
    .split('\n')
    .filter(line => !line.includes('█') && !line.includes('%') && !line.match(/^\[\d+\/\d+\]/))
    .join('\n');

  // Try YAML parsing first
  try {
    const data = load(cleanOutput);
    if (Array.isArray(data)) return data as T;
    if (data && typeof data === 'object') return data as T;
  } catch { /* fall through */ }

  // Fallback: try JSON
  let text = cleanOutput.trim();
  const arrayStart = text.indexOf('[');
  const arrayEnd = text.lastIndexOf(']');
  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    text = text.slice(arrayStart, arrayEnd + 1);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`无法解析 OpenCLI 输出: ${result.stdout.slice(0, 200)}`);
  }
}

// Keep alias for backward compatibility
export const parseOpencliJson = parseOpencliYaml;
