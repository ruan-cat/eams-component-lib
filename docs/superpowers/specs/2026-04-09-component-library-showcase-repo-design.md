<!-- 已完成 -->

# 2026-04-09 现代组件库展示仓重构设计

## 背景

当前仓库仍然带有明显的教务业务项目痕迹：

- Git 根目录之外额外包了一层 `eams-frontend-monorepo/`
- 顶层 `documents/` 保存了大量业务需求、数据库、流程和帮助文档
- workspace 内仍保留 `apps/eams-frontend`、`apps/eams-fronttea`、`apps/eams-frontstu` 三个业务应用
- 当前 `simple-git-hooks.mjs` 为适配“Git 根目录和 monorepo 根目录分离”的历史结构，存在 `cd eams-frontend-monorepo` 和绝对路径拼接等补丁式写法

用户希望把仓库退格成一个面向开源和求职叙事的现代组件库仓库：保留组件库本体、展示文档站、工程化底座与旧版组件库迁移证据链，删除业务应用和旧业务文档，后续围绕“组件库搭建、效果演示、工程化能力、迁移故事”持续迭代。

## 目标

1. 将当前仓库改造成单一用途的“现代组件库展示仓”
2. 彻底断开云效远程仓库，避免误推送到 `https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-eams2603.git`
3. 以当前 `f1` 分支为唯一主分支并重命名为 `main`
4. 删除全部本地非 `main` 分支，只保留一个本地主分支
5. 消除 `eams-frontend-monorepo/` 这一层级，让 Git 根目录直接成为 workspace 根目录
6. 保留现代组件库、文档展示站、旧组件库迁移对照和完整前端工程化配置

## 非目标

1. 本轮不新增新的炫技组件、不重做文档站视觉风格、不扩展新的品牌包装
2. 本轮不修改 `@eams-monorepo/*` 与 `vue-element-cui` 命名体系
3. 本轮不删除 `old/vue-element-cui`
4. 本轮不对旧云效远端执行任何删除分支、推送或改写远端历史操作

## 核心决策

### 决策 1：采用“保守扁平化展示仓”，而不是极简 demo 仓

保留 `pnpm workspace`、`turbo`、`changesets`、`lint/format`、`git hooks`、测试链路等工程化设施。理由是用户明确需要拿仓库向面试官说明完整的现代前端工程能力，而不是只展示孤立组件源码。

### 决策 2：保留现代组件库 + 展示站 + 历史组件库三件套

保留以下内容：

- `packages/vue-element-cui`
- `packages/vue-element-cui-nuxt`
- `old/vue-element-cui`

理由是这三者共同构成“当前能力 + 对外展示 + 历史迁移故事”的完整证据链。

### 决策 3：彻底删除业务应用和旧业务文档

删除以下内容：

- 顶层 `documents/` 全部内容
- `apps/eams-frontend`
- `apps/eams-fronttea`
- `apps/eams-frontstu`

理由是这些内容会持续把仓库叙事拉回“教务业务项目”，与组件库展示仓定位冲突。

### 决策 4：Git 先降风险，再做目录重构

实施顺序必须先处理 Git：

1. 删除 `origin`
2. 将当前 `f1` 重命名为 `main`
3. 删除本地其他分支
4. 再进行目录和配置重构

理由是先切断远程依赖，才能避免后续大规模改动误伤旧云效仓库。

### 决策 5：`simple-git-hooks.mjs` 回归最简模式，但 `lint-staged.config.js` 保持性能优化写法

重构后：

- `simple-git-hooks.mjs` 改回根目录原生执行的最简模式
- `lint-staged.config.js` 保留当前精细扩展名过滤

理由是目录扁平化后，hooks 的历史补丁不再需要；但用户明确认可 `lint-staged` 当前的性能优化方案，不应为追求模板一致而退化。

## 目标仓库结构

重构完成后的 Git 根目录直接成为 workspace 根目录，预期保留结构如下：

```plain
eams-component-lib/
├─ .agent/
├─ .changeset/
├─ .claude/
├─ .codex/
├─ .cursor/
├─ .vscode/
├─ configs/
├─ docs/
│  └─ superpowers/
│     └─ specs/
├─ old/
│  └─ vue-element-cui/
├─ openspec/
├─ packages/
│  ├─ vue-element-cui/
│  └─ vue-element-cui-nuxt/
├─ patches/
├─ scripts/
├─ .editorconfig
├─ .gitignore
├─ .npmrc
├─ .prettierignore
├─ AGENTS.md
├─ CLAUDE.md
├─ GEMINI.md
├─ commitlint.config.cjs
├─ eslint.config.js
├─ lint-staged.config.js
├─ package.json
├─ pnpm-workspace.yaml
├─ prettier.config.mjs
├─ simple-git-hooks.mjs
├─ tsconfig.base.json
├─ tsconfig.json
└─ turbo.json
```

以下结构应消失：

- `documents/`
- `eams-frontend-monorepo/`
- `apps/`

## 文件保留与删除清单

### 保留

- `packages/vue-element-cui`
- `packages/vue-element-cui-nuxt`
- `old/vue-element-cui`
- `configs/`
- `scripts/`
- `docs/`
- `.changeset/`
- `openspec/`
- `patches/`
- `.claude/`、`.agent/`、`.codex/`、`.cursor/`、`.vscode/`
- 根级工程配置文件与锁文件

### 删除

- `documents/**`
- `eams-frontend-monorepo/apps/eams-frontend/**`
- `eams-frontend-monorepo/apps/eams-fronttea/**`
- `eams-frontend-monorepo/apps/eams-frontstu/**`

### 上提

将 `eams-frontend-monorepo/` 下剩余全部保留内容释放到 Git 根目录，随后删除空的 `eams-frontend-monorepo/` 目录。

## Git 收敛方案

### 最终状态

- 本地仅保留 `main`
- 本地不再绑定任何旧云效远程
- 本地没有其他业务分支

### 执行顺序

1. `git remote remove origin`
2. `git branch -m f1 main`
3. 删除全部本地非 `main` 分支
4. 校验 `git remote -v` 为空
5. 校验 `git branch` 只剩 `main`

### 明确约束

- 不执行任何 `git push`
- 不删除任何远端分支
- 不尝试修改旧云效仓库默认分支

## 工程配置方案

### `pnpm-workspace.yaml`

移除 `apps/*`，保留：

- `packages/*`
- `old/*`
- `configs/*`

### `package.json`

保留现代组件库仓库所需脚本与依赖，删除对以下业务包的 workspace 依赖：

- `@eams-monorepo/admin`
- `@eams-monorepo/stu-app`
- `@eams-monorepo/tea-app`

保留以下工程能力：

- `turbo`
- `changesets`
- `eslint`
- `prettier`
- `commitlint`
- `simple-git-hooks`
- 与组件库和文档站构建直接相关的依赖

### `simple-git-hooks.mjs`

恢复为面向仓库根目录的简单执行模式：

- `commit-msg`: `npx --no-install commitlint --edit ${1}`
- `pre-commit`: `npx lint-staged`

不再出现：

- `cd eams-frontend-monorepo`
- `ROOT=$(pwd)` 拼接路径
- 为嵌套 monorepo 目录兜底的说明性注释

### `lint-staged.config.js`

保持当前精细扩展名过滤写法，不退化成 `"*"` 全量匹配。仅在必要时修复因路径扁平化造成的失效假设。

### EOL 与格式化基线

继续维持以下规则：

- `.gitattributes` 包含 `* text=auto eol=lf`
- `.editorconfig` 的 `[*]` 段包含 `end_of_line = lf`
- `prettier.config.mjs` 中 `endOfLine = "lf"`

重构后执行一次：

```bash
git add --renormalize .
```

以消除旧目录结构遗留的行尾索引差异。

## 文档叙事方案

### 根 `README.md`

从“教务系统全栈项目”改写为“现代组件库仓库”，重点改成：

1. 仓库定位：开源、求职、组件展示、工程能力
2. 组成说明：现代组件库、文档站、历史迁移包
3. 工程化设施：workspace、build、test、lint、release
4. 迁移叙事：从旧组件库到现代组件库架构

### `docs/`

保留为当前仓库的设计、计划、报告、prompt、spec 沉淀区，不再承载旧业务需求文档。

## 验证方案

### Git 验证

```bash
git remote -v
git branch
```

期望结果：

- 无远程
- 仅有 `main`

### 结构验证

确认以下结果：

- `eams-frontend-monorepo/` 不存在
- `documents/` 不存在
- `apps/` 不存在
- `packages/vue-element-cui` 存在
- `packages/vue-element-cui-nuxt` 存在
- `old/vue-element-cui` 存在

### 工程验证

```bash
pnpm install
pnpm lint
pnpm build
pnpm --filter @eams-monorepo/vue-element-cui test
pnpm --filter @eams-monorepo/vue-element-cui-nuxt build
```

目标是证明：

- 组件库可构建、可测试
- 文档展示站可构建
- 仓库仍然是完整的现代前端工程，而非被削成静态 demo

## 风险与缓解

### 风险 1：目录整体上提导致引用路径失效

缓解方式：在迁移后集中检查根级脚本、workspace、README、hooks、Turbo 和 docs 路径引用。

### 风险 2：删除业务应用后残留 workspace 依赖或 pipeline 引用

缓解方式：同步清理 `pnpm-workspace.yaml`、根 `package.json`、README 和 Turbo 实际依赖图中的业务项。

### 风险 3：行尾归一化带来大量索引变更

缓解方式：保持 LF 基线不变，执行一次 `git add --renormalize .`，随后用 `git diff --cached --stat` 审核是否全部为预期改动。

### 风险 4：文档叙事仍带业务项目措辞

缓解方式：优先重写根 README，把仓库对外身份明确改成组件库展示仓。

## 实施边界

本轮只完成“现代组件库展示仓”的基础收敛：

- 切断旧远程
- 收敛分支
- 扁平化目录
- 删除业务应用与业务文档
- 修正工程配置
- 保住组件库、文档站、旧组件库迁移证据链

本轮不负责新增求职展示组件或重新设计视觉展示内容。后续炫技组件、演示页面、品牌包装和案例故事，应在本次重构建立的干净基线上继续推进。
