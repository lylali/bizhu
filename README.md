# 笔主 (BizhuPlatform)

A creation & monetization platform for writers.

---

## 中文

### 简介

笔主是为写作者打造的创作工具和变现平台。集成高效的章节编辑器、素材库管理、实时同步等功能，帮助作者专注于创意写作。

### 技术栈

- **前端**: React 18 + Vite + Tiptap v2
- **桌面端**: Tauri 2.0
- **移动端**: React Native + Expo
- **后端**: NestJS + Prisma + PostgreSQL
- **实时同步**: Yjs + y-websocket + WebSocket
- **包管理**: pnpm + Turborepo

### 项目结构

```
apps/
  ├── web          React Web 编辑器
  ├── desktop      Tauri 桌面应用
  ├── mobile       React Native App
  └── server       NestJS 后端

packages/
  └── shared       共享类型和工具
```

### 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

### 核心功能

#### 章节编辑器
- 富文本编辑器，支持 Markdown 语法
- 实时自动保存功能
- 多端实时同步（Web、桌面、移动）
- 字数统计和编辑进度跟踪

#### 角色管理
- 完整的角色卡系统（姓名、外貌、性格、背景、标签等）
- 角色关系图可视化展示
- 支持角色属性编辑和版本管理
- 快速角色搜索和过滤

#### 素材库
- 伏笔管理：埋设、回收、进度跟踪
- 大纲编辑：章节规划、情节梗概
- 标签系统：灵活分类和组织素材
- 素材搜索和关联查询

#### 实时同步
- Yjs 驱动的实时协作编辑
- 自动冲突解决
- 离线编辑支持
- 无缝的多端同步

---

## English

### Introduction

Bizhu is a creation and monetization platform built for writers. It provides an efficient chapter editor, material library management, real-time synchronization, and other tools to help authors focus on creative writing.

### Tech Stack

- **Frontend**: React 18 + Vite + Tiptap v2
- **Desktop**: Tauri 2.0
- **Mobile**: React Native + Expo
- **Backend**: NestJS + Prisma + PostgreSQL
- **Realtime Sync**: Yjs + y-websocket + WebSocket
- **Package Manager**: pnpm + Turborepo

### Project Structure

```
apps/
  ├── web          React Web Editor
  ├── desktop      Tauri Desktop App
  ├── mobile       React Native App
  └── server       NestJS Backend

packages/
  └── shared       Shared Types & Utils
```

### Getting Started

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build
```

### Features

#### Chapter Editor
- Rich text editor with Markdown support
- Real-time auto-save functionality
- Multi-platform sync (Web, Desktop, Mobile)
- Word count and writing progress tracking

#### Character Management
- Complete character card system (name, appearance, personality, background, tags, etc.)
- Character relationship graph visualization
- Character attribute editing and version control
- Quick character search and filtering

#### Material Library
- Foreshadowing management: placement, resolution, progress tracking
- Outline editing: chapter planning, plot outlines
- Tag system: flexible material organization
- Material search and relation queries

#### Realtime Sync
- Yjs-powered real-time collaborative editing
- Automatic conflict resolution
- Offline editing support
- Seamless multi-device synchronization

---

## Development

### Code Standards

- Pure TypeScript, no `any` types
- Function components with hooks
- Unified API response format: `{ data, error, meta }`

### Environment Variables

Create `.env.local` in each app directory:

```
VITE_API_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/bizhu
```

---

## License

MIT
