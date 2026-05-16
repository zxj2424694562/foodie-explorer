interface QueueTask {
  id: number;
  type: string;
  info: string;
  started_at: string;
  run: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

let queue: QueueTask[] = [];
let running: QueueTask | null = null;
let taskIdCounter = 0;

export function getQueueStatus(): { running: { type: string; info: string; started_at: string } | null; waiting: number } {
  return {
    running: running ? { type: running.type, info: running.info, started_at: running.started_at } : null,
    waiting: queue.length,
  };
}

export function enqueue<T>(type: string, info: string, run: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const task: QueueTask = {
      id: ++taskIdCounter,
      type,
      info,
      started_at: '',
      run,
      resolve,
      reject,
    };
    queue.push(task);
    if (!running) {
      processQueue();
    }
  });
}

async function processQueue(): Promise<void> {
  if (running || queue.length === 0) return;

  const task = queue.shift()!;
  running = task;
  running.started_at = new Date().toISOString();

  try {
    const result = await task.run();
    task.resolve(result);
  } catch (err) {
    task.reject(err instanceof Error ? err : new Error(String(err)));
  } finally {
    running = null;
    // Process next task with a small delay to let browser settle
    setTimeout(() => processQueue(), 500);
  }
}
