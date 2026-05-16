# 🍜 寻味之旅 · Foodie Explorer

> 懂你的胃，更懂你的世界 —— 基于 AI 的智能旅游美食推荐系统

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-18.x-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/vite-6.x-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

**寻味之旅** 通过 AI 理解你的口味偏好，在小红书真实食客笔记中搜索、分析、推荐最匹配的美食。支持一键下载美食图片，构建你的专属美食画廊。

---

## ✨ 核心功能

- **🤖 AI 智能推荐** — DeepSeek 大语言模型理解你的口味偏好，从真实笔记中筛选高匹配度餐厅，生成个性化推荐报告
- **🔍 小红书搜索** — 通过 OpenCLI 浏览器自动化，实时抓取小红书美食笔记，按城市 + 菜系精准检索
- **📸 图片下载与管理** — 一键下载笔记中的美食图片，自动归类到本地画廊
- **🎯 多维度偏好** — 支持 14 种菜系 × 6 种就餐场景 × 5 档预算 × 5 种风格偏好的组合筛选
- **📋 任务队列** — 后台串行队列管理搜索/下载任务，避免浏览器冲突
- **🖼️ 美食画廊** — 分页浏览已下载图片，支持灯箱预览、前后翻页
- **⚡ 缓存降级** — 搜索失败时自动回退到本地缓存，提升可用性
- **🎨 响应式设计** — TailwindCSS 构建，适配桌面和移动端

---

## 🛠️ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React 18 + TypeScript + Vite 6 | SPA 应用，HMR 热更新 |
| 样式 | TailwindCSS 3 | 原子化 CSS，自定义暖色主题 |
| 后端 | Express 4 + TypeScript | RESTful API 服务 |
| AI | DeepSeek V4 Pro | 智能推荐与内容理解 |
| 数据源 | 小红书 (OpenCLI) | 浏览器自动化搜索与下载 |
| 存储 | 本地 JSON 文件 | 搜索历史与下载记录持久化 |

---

## 📦 环境要求

- **Node.js** >= 18
- **npm** >= 9
- **Edge 浏览器**（OpenCLI 依赖 Edge WebDriver）
- **DeepSeek API Key**（[免费获取](https://platform.deepseek.com/api_keys)）
- **小红书账号**（需在 Edge 浏览器中登录，用于爬取数据）

---

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/zxj2424694562/foodie-explorer.git
cd foodie-explorer

# 2. 安装依赖
npm install
npm install -g @jackwener/opencli    # OpenCLI 需要全局安装

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 DeepSeek API Key

# 4. 启动开发服务器（前后端同时启动）
npm run dev
```

前端运行在 **http://localhost:5173**，后端 API 运行在 **http://localhost:3001**。

---

## 📖 使用指南

### 方式一：智能推荐（推荐）

1. 打开首页，选择你的美食偏好
   - 菜系：火锅、川菜、粤菜、日料、韩料、西餐、烧烤、海鲜等
   - 场景：朋友聚餐、约会打卡、独自探店、商务宴请等
   - 预算：50 以下 ~ 200+
   - 风格：网红新店、老字号、隐藏小店、烟火气等
2. 系统自动组合搜索词，从多维度检索小红书笔记
3. AI 分析笔记内容，输出个性化推荐报告 + 避坑提示
4. 点击笔记可下载图片，收藏到画廊

### 方式二：自由搜索

1. 进入搜索页，输入「城市 + 关键词」
2. 浏览搜索结果列表
3. 点击感兴趣的笔记，下载美食图片

### 画廊浏览

- 所有已下载图片自动归类展示
- 支持分页浏览和灯箱大图预览

---

## 📁 目录结构

```
foodie-explorer/
├── client/                         # 前端应用 (React + Vite)
│   ├── index.html
│   ├── vite.config.ts              # Vite 配置（含 /api 代理）
│   └── src/
│       ├── main.tsx                # 入口文件
│       ├── App.tsx                 # 路由配置 (4 页面)
│       ├── components/             # 通用组件
│       │   ├── Layout.tsx          # 页面布局（导航栏 + 底部状态）
│       │   ├── PreferencePanel.tsx  # 偏好选择面板（首页核心）
│       │   ├── SearchBar.tsx       # 搜索栏组件
│       │   ├── ResultsTable.tsx    # 搜索结果表格
│       │   ├── RecommendCard.tsx   # 推荐卡片
│       │   ├── SummaryBlock.tsx    # AI 摘要展示
│       │   ├── NoteDetailPanel.tsx # 笔记详情面板（含下载）
│       │   ├── ImageCard.tsx       # 图片卡片
│       │   ├── ImageLightbox.tsx   # 图片灯箱
│       │   ├── DownloadProgress.tsx# 下载进度条
│       │   └── StatusBadge.tsx     # 状态徽章
│       ├── hooks/                  # 自定义 Hooks
│       │   ├── useSearch.ts        # 搜索逻辑
│       │   ├── useDownload.ts      # 下载逻辑
│       │   ├── useGallery.ts       # 画廊分页
│       │   └── useStatus.ts        # 系统状态轮询
│       ├── pages/                  # 页面组件
│       │   ├── HomePage.tsx        # 首页 · 偏好选择
│       │   ├── RecommendPage.tsx   # AI 推荐结果页
│       │   ├── SearchPage.tsx      # 自由搜索页
│       │   └── GalleryPage.tsx     # 美食画廊页
│       └── styles/
│           └── index.css           # 全局样式 + Tailwind
├── server/                         # 后端服务 (Express)
│   ├── index.ts                    # 服务入口，路由挂载
│   ├── routes/                     # API 路由
│   │   ├── search.ts               # POST /api/search     - 小红书搜索
│   │   ├── recommend.ts            # POST /api/recommend  - AI 推荐（搜索+分析）
│   │   ├── download.ts             # POST /api/download   - 笔记图片下载
│   │   ├── gallery.ts              # GET  /api/gallery    - 画廊分页查询
│   │   ├── notes.ts                # GET  /api/notes      - 笔记详情
│   │   ├── queue.ts                # GET  /api/queue      - 队列状态
│   │   └── status.ts               # GET  /api/status     - 系统健康检查
│   ├── services/                   # 核心业务逻辑
│   │   ├── claude.ts               # DeepSeek AI 推荐引擎（Prompt + Fallback）
│   │   ├── opencli.ts              # OpenCLI 调用封装（YAML/JSON 解析）
│   │   ├── preferences.ts          # 偏好 → 搜索词映射（14菜系×6场景×5预算×5风格）
│   │   ├── queue.ts                # 串行任务队列管理器
│   │   └── storage.ts              # JSON 文件存储（搜索历史/下载记录）
│   ├── middleware/
│   │   └── errorHandler.ts         # 全局错误处理中间件
│   └── types/
│       └── index.ts                # TypeScript 类型定义
├── data/                           # 运行时数据（gitignore）
│   ├── downloads/                  # 下载的图片文件
│   ├── store.json                  # 搜索与下载记录
│   └── search_cache.json           # 搜索缓存（降级备用）
├── .env.example                    # 环境变量参考
├── package.json
├── tsconfig.json
├── tailwind.config.js              # Tailwind 主题色配置
└── postcss.config.js
```

---

## 🔧 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | 是 |
| `PORT` | 后端端口（默认 3001） | 否 |

---

## ⚠️ 重要提示

1. **API Key 安全**：`.env` 已加入 `.gitignore`，请勿将 API Key 提交到仓库。当前仓库历史中的 Key 应立即前往 [DeepSeek 控制台](https://platform.deepseek.com/api_keys) **废弃并更换**。

2. **小红书登录**：OpenCLI 依赖 Edge 浏览器中已登录的小红书账号。如遇登录墙错误，请在 Edge 中手动登录 [xiaohongshu.com](https://www.xiaohongshu.com)。

3. **搜索频率**：小红书对搜索频率有风控限制，短时间内大量搜索可能触发验证码。推荐使用智能推荐模式（自动限速）。

4. **浏览器依赖**：确保系统已安装 Edge 浏览器，OpenCLI 通过 WebDriver 与浏览器通信。

---

## 📝 License

MIT
