# 笔主平台 - Claude Code 上下文

## 项目概述
面向中国网文作者的创作+变现平台。
Monorepo结构，TypeScript全栈。

## 技术栈
- 前端: React 18 + Vite + Tiptap v2
- 桌面: Tauri 2.0 (包裹Web编辑器)
- 移动: React Native + Expo
- 后端: NestJS + Prisma + PostgreSQL
- 实时同步: Yjs + y-websocket
- 包管理: pnpm + Turborepo

## 代码规范
- 所有代码用 TypeScript，禁止 any
- 组件用函数式写法 + hooks，禁止 class component
- API 返回格式统一: { data, error, meta }
- 数据库字段用 snake_case，TypeScript 用 camelCase
- 中文注释优先，保持代码可读性

## 目录结构
apps/web       - React Web 编辑器
apps/desktop   - Tauri 桌面壳
apps/mobile    - React Native App  
apps/server    - NestJS 后端
packages/shared - 共享类型和工具

## 当前阶段：MVP Phase 1
专注创作工具核心：编辑器 + 大纲 + 角色卡 + 云同步
暂不做：变现、AI功能、读者端

### 已完成（2026/03/09）
✅ **编辑器 + Yjs 实时同步**
- Tiptap v2.27.2 编辑器集成
- Yjs CRDT 多客户端同步
- WebSocket 实时协作（后端 NestJS gateway）
- JWT 认证的 WebSocket 连接
- 连接状态显示（🟢 已同步 / 🟡 同步中 / 🔴 离线）
- 离线编辑支持（localStorage 本地缓存，容量 5-10MB，满足网文场景）
- 多 Tab 同步（Yjs 共享文档状态）
- 30秒 debounce 落库到 PostgreSQL
- 中文输入稳定（IME composition 事件处理）

### 进行中
- 大纲功能（树形结构、拖拽排序）
- 角色卡管理（CRUD + 关系图）

## 重要约束
- 内容不用于训练AI，体现在隐私策略和代码注释中
- 支付接阿里云/微信支付，不用Stripe
- AI接口用国内模型(通义千问/文心)，不用OpenAI
```

**关键原则：CLAUDE.md 要随代码一起演进，每完成一个 Phase 就更新它。**

---

## 四、分阶段的 Claude Code 使用策略

### Phase 0：脚手架搭建（第1-2周）

这是最适合用 Claude Code 批量生成的阶段，节省大量重复劳动。

**任务1：初始化 Monorepo**
```
你：帮我初始化一个 pnpm + Turborepo 的 monorepo，
    包含以下工作区：
    - apps/web (React + Vite + TypeScript)
    - apps/server (NestJS + TypeScript)
    - apps/mobile (React Native + Expo)
    - packages/shared (纯 TypeScript 包)
    
    配置好 turbo.json 的构建流水线，
    shared 包要在 web/server/mobile 都能引用。
```

**任务2：数据库 Schema**
```
你：根据这个需求，用 Prisma 帮我写 schema.prisma：
    - 用户表（支持微信OAuth登录）
    - 作品表（书名、类型、状态、封面）
    - 章节表（标题、内容、顺序、字数、发布状态）
    - 角色卡（名称、外貌、性格、关系）
    - 大纲节点（树形结构，支持拖拽排序）
    - 伏笔记录（描述、埋设章节、预计回收章节）
    
    注意：
    - 章节内容用 Bytes 类型存 Yjs 二进制文档
    - 同时存一个 textSnapshot 字段用于搜索和字数统计
    - 所有表加 createdAt/updatedAt
```

**任务3：NestJS 基础骨架**
```
你：帮我在 apps/server 里搭建 NestJS 应用骨架：
    - 全局异常过滤器，统一返回 {data, error, meta} 格式
    - JWT 认证守卫
    - 微信 OAuth2.0 登录模块
    - 基础的 writing 模块（works、chapters 的 CRUD）
    - Prisma 模块（全局注入）
    
    先只生成文件结构和接口定义，不需要实现细节。
```

---

### Phase 1：编辑器核心（第3-6周）

这阶段难度最高，需要与 Claude Code **对话式迭代**，而不是一次性生成。

**策略：把大任务拆成小问题**

❌ 错误方式：
```
你：帮我做一个支持Yjs实时同步的Tiptap编辑器
```
这太模糊，生成的代码质量参差不齐。

✅ 正确方式（逐步推进）：
```
第一步：
你：帮我在 apps/web/src/components/Editor 里
    初始化一个基础的 Tiptap 编辑器，
    要求：
    1. 支持中文输入（IME），测试过无乱序问题
    2. 基础格式：加粗、斜体、标题H1-H3、段落
    3. 字数统计实时显示在底部状态栏
    4. 用 Tailwind 做最简单的样式，先不追求美观
    先只做这些，Yjs同步下一步再加。

第二步（确认编辑器正常后）：
你：现在给编辑器加上 Yjs 实时同步：
    - 后端用 y-websocket 起一个独立的 WS 服务
    - 前端用 y-prosemirror 绑定 Tiptap
    - 每次文档变更，每30秒自动保存 Yjs 状态到数据库
    - 同一账号多设备打开同一章节时能实时同步
    - 给我展示连接状态（在线/离线/同步中）

第三步：
你：现在做离线支持：
    - 用 IndexedDB 作为本地存储，用 y-indexeddb 绑定
    - 断网时继续可以编辑，联网后自动合并
    - 测试用例：模拟断网5分钟编辑 → 联网后内容不丢失
```

**调试技巧：让 Claude Code 解释它的决策**
```
你：这里为什么用 useCallback 而不是 useMemo？
    在 Tiptap 的 extensions 数组里，每次渲染重新生成会有什么问题？
```

---

### Phase 2：素材库（第7-9周）

这阶段有大量 CRUD 表单，Claude Code 最擅长批量生成。

**高效提示方式：给 Claude Code 一个「样板」**
```
你：我有一个角色卡的数据结构（见 schema.prisma 里的 Character）。
    参考这个模式，帮我生成完整的角色卡功能：
    
    后端：
    - CharacterModule (NestJS)
    - CharacterService (CRUD + 按作品ID查询)
    - CharacterController (REST API)
    - 对应的 DTO 类（包含验证装饰器）
    
    前端：
    - CharacterCard 展示组件
    - CharacterForm 编辑表单（用 react-hook-form）
    - CharacterList 列表页（支持搜索过滤）
    
    样式遵循我们项目的设计规范（Tailwind + shadcn/ui），
    跟 apps/web/src/components/Chapter 目录的风格保持一致。
```

**关系图可视化（需要特别指导）**：
```
你：角色卡之间有关系（朋友/敌人/师徒/恋人等）。
    帮我用 React Flow 做一个角色关系图组件：
    - 节点是角色卡（显示头像、姓名）
    - 边是关系类型（不同颜色区分）
    - 支持拖拽布局，自动保存节点位置
    - 点击节点弹出角色详情
    注意：节点位置存在 PostgreSQL 的 JSON 字段里。
```

---

### Phase 3：AI 模块（第10-12周）

这阶段要特别注意「合规边界」，需要在提示里明确约束。
```
你：帮我实现润色助手功能，有几个硬性约束：
    1. 只能对「用户已选中的文字」操作，不能整章润色
    2. 返回的是「建议」，用户点确认才替换，不自动替换
    3. 调用通义千问API（不是OpenAI）
    4. System prompt 里明确：不生成新内容，只优化表达
    
    交互：
    - 编辑器里选中文字 → 悬浮菜单出现「润色」按钮
    - 点击后在右侧面板显示3个润色版本
    - 用户点某个版本 → 替换选中文字
    - 支持撤销（Ctrl+Z 恢复原文）
    
    后端用 BullMQ 异步处理（不阻塞编辑器）。
```

---

## 五、Claude Code 的高级使用技巧

### 技巧1：让它做「代码审查」
```
你：审查一下 apps/server/src/modules/writing 目录，
    找出以下问题：
    1. 有没有遗漏的错误处理（Promise 没有 try-catch）
    2. N+1 查询问题（Prisma 里有没有漏掉 include）
    3. 用户权限检查：有没有 A 用户能读到 B 用户作品的漏洞
    4. 给我一个问题列表，按严重程度排序
```

### 技巧2：让它写测试（这是最节省时间的用法）
```
你：为 ChapterService 的 save() 方法写完整的单元测试，
    覆盖这些场景：
    - 正常保存返回更新后的章节
    - 章节不属于当前用户时抛出 ForbiddenException
    - Yjs 文档损坏时的降级处理
    - 并发保存时的锁机制
    用 Jest + @nestjs/testing，mock Prisma 客户端。
```

### 技巧3：跨文件重构
```
你：我要把章节的「字数统计」从前端计算改成后端计算。
    需要改动：
    1. apps/server：在保存章节时从 textSnapshot 提取字数
    2. packages/shared/types：更新 Chapter 类型，加 wordCount 字段
    3. apps/web：移除前端的字数统计逻辑，改用后端返回的数据
    4. apps/mobile：同步更新类型
    
    帮我规划改动路径，然后逐步执行，每步完成后告诉我。
```

### 技巧4：数据库迁移（高风险操作，要谨慎）
```
你：我需要给 chapters 表加一个 foreshadow_count 字段，
    记录这一章埋了几个伏笔。
    
    1. 先给我看修改后的 schema.prisma 变更
    2. 生成 Prisma migration（但不要执行）
    3. 告诉我这个迁移是否安全（有没有破坏性变更）
    4. 等我确认后再运行
```

---

## 六、项目工作流建议

### 日常开发节奏
```
每天开始工作时：
claude → "今天要做大纲拖拽排序功能，
          先帮我看一下 OutlineService 的现有代码，
          评估一下改动范围"

写完一个功能后：
claude → "帮我给这段代码写提交信息，
          符合 Conventional Commits 规范，
          然后检查有没有遗漏的测试"

遇到 Bug 时：
claude → "报错信息：[粘贴错误] 
          相关文件：apps/server/src/...
          帮我定位根因"
```

### Git 工作流
```
你：帮我处理这个 git 工作流：
    1. 从 main 创建 feature/outline-drag-sort 分支
    2. 完成功能后，squash 所有提交为一个
    3. 写一个清晰的 PR 描述，包括：改了什么、为什么这样改、如何测试
```

---

## 七、阶段里程碑检查清单

每个 Phase 结束，让 Claude Code 做一次系统性检查：
```
你：Phase 1（编辑器核心）已完成，帮我做一次全面检查：

    功能完整性：
    □ Tiptap 编辑器中文输入无 bug
    □ Yjs 多设备实时同步
    □ 离线编辑后联网合并
    □ 章节 CRUD API 完整
    □ 字数统计准确

    代码质量：
    □ 所有 async 函数有 try-catch
    □ API 返回格式统一
    □ TypeScript 无 any
    □ 关键路径有单元测试

    安全性：
    □ JWT 认证覆盖所有需要保护的接口
    □ 用户只能访问自己的作品
    
    给我一个 pass/fail 的清单，fail 的告诉我怎么修。