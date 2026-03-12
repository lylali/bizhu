# 笔主 (BizhuPlatform)

A creation & monetization platform for Chinese web novel writers.

---

## 中文

### 简介

笔主是为网文作者打造的创作工具和变现平台。集成高效的章节编辑器、素材库管理、实时同步等功能，帮助作者专注于创意写作。

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

- **章节编辑**: 实时协作编辑、自动保存、Markdown 支持
- **角色管理**: 角色卡、属性编辑、关系图可视化
- **素材库**: 伏笔、大纲、标签管理
- **实时同步**: 多端同步、离线编辑

---

## English

### Introduction

Bizhu is a creation and monetization platform built for Chinese web novel writers. It provides an efficient chapter editor, material library management, real-time synchronization, and other tools to help authors focus on creative writing.

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

- **Chapter Editor**: Real-time collaboration, auto-save, Markdown support
- **Character Management**: Character cards, attributes, relationship visualization
- **Material Library**: Foreshadowing, outlines, tags
- **Realtime Sync**: Multi-device sync, offline editing

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
