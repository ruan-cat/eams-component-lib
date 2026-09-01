# 2026-09-01 rebuild-vue-element-cui-nuxt-shadcn-docs 复核勘误与归档建议

> 报告执行工具：Codex agent、PowerShell、OpenSpec CLI、agent-browser（Chrome）
>
> AI 模型：GPT-5（Codex）

## 结论

上一版报告的“缺失 `app.vue`、全部路由显示 NuxtWelcome”结论不成立，现予以撤回。根因是上一轮启动命令错误地把多余的 `--` 传给了 Nuxt：

```log
pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev -- --port 3100
实际变成：nuxt dev "--" "--port" "3100"
```

本次使用正确命令重新运行后，Nuxt Content 文档站正常加载，说明 shadcn-docs 配置、首页、导航、内容目录和 live demo 已经接通大部分。

## 本次真实运行证据

### Nuxt 开发服务器

```log
pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev
Nuxt 3.21.2
Local: http://localhost:3000/
Vite client built
Vite server built
[nitro] Nuxt Nitro server built
```

端口 3000 的监听进程命令行为当前包下的 `nuxt.mjs dev`，不是静态文件浏览。

### 首页

Chrome 通过 agent-browser 启动；Windows 默认 Chrome 启动会报 exit code 3，显式加 `--args '--no-sandbox'` 后成功。访问 `/` 时看到：

```log
link "Vue Element CUI"
link "快速开始"
link "组件"
link "规范"
link "更新"
heading "从安装、演示到规范，按组件库官网的方式组织文档入口。"
heading "组件分类入口"
```

### 快速开始页

访问 `/getting-started`，看到“快速开始”标题，以及 Installation、Quick Start、Migration、Troubleshooting 入口。

### 组件 live demo

访问 `/components/data-display/table`，看到真实 `CuiTable` 表格：

```log
heading "Table"
heading "CuiTable"
heading "资产台账表格"
columnheader "对象"
columnheader "归属团队"
columnheader "状态"
button "收起代码"
```

在 PowerShell 中将 ref 写成 `'@e15'` 后点击成功，按钮变为“展开代码”，证明代码面板折叠交互真实生效。

### 规范页

访问 `/guidelines/component-design`，看到“组件设计约定”标题，以及四类规范侧边入口：Component Design、Form and Table Best Practices、Overlay and Interaction Guidelines、Development Conventions。

## 已完成部分

- OpenSpec status：23/23 任务勾选完成。
- `openspec validate --strict`：通过。
- `nuxt.config.ts` 的 `extends: ["shadcn-docs-nuxt"]`：运行态生效。
- 四个一级导航：运行态可见。
- 四个内容顶级目录：可通过路由访问。
- 首页入口、组件分类、Table live demo、代码折叠：浏览器验证通过。
- 单测：9 个文件、12 项断言通过。

```log
Test Files  9 passed (9)
Tests       12 passed (12)
```

## 仍需补齐的差距

### WARNING：生产构建缺少完整退出证据

前次 fresh build 已完成客户端和服务端编译，并生成 Vercel 输出，但 Nitro 收尾阶段长时间不退出，最终被中止，没有拿到 exit code 0。任务 6.2 仍需重新取得完整构建成功证据，或记录明确的环境/工具豁免。

### WARNING：移动端导航尚未留下证据

当前已验证桌面端首页、快速开始、组件和规范页。移动 viewport 的菜单展开、四栏访问和组件页浏览尚未完成 agent-browser 证据，任务 2.3 不能仅凭桌面结果完全关闭。

### SUGGESTION：固化浏览器启动参数

agent-browser doctor 能找到 Chrome，但默认启动失败；`--no-sandbox` 后可用。建议把这个 Windows 启动条件写进 smoke 脚本，避免再次把工具启动失败误判为站点失败。

### SUGGESTION：修正开发端口透传

当前应使用 `pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev`。若要传入自定义端口，需要调整脚本，避免 `dev -- --port 3100` 被转成多余位置参数。

## 归档判定

变更不再是“应用壳层缺失”阻断，而是 `candidate / needs_build_evidence`：主要功能已在本地真实浏览器成立，但生产构建 exit code 0 与移动端导航证据仍需补齐。补齐后即可重新执行 OpenSpec verify，再决定归档。

本次复核和勘误只新增报告文件，未修改组件库代码；工作区原有的 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 修改保持不动。
