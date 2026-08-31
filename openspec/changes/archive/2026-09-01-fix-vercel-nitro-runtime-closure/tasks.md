## Parent / Pilot Batch

- [x] [验证] `openspec/changes/upgrade-shadcn-docs-nuxt-dependencies/agent-findings.md` - 已回读父 change F24，确认依赖基线、已尝试路径与不可回退边界。
- [x] [验证] Vercel Project `vue-element-cui-nuxt-doc` - 已核对 Root Directory `.`, Build Command `pnpm run build:docs:nuxt-doc`, Output Directory `.vercel/output`, Node `24.x`，并通过 API 确认 GitHub `ruan-cat/eams-component-lib`、生产分支 `main` 已连接。
- [x] [验证] 当前源码与锁文件 - 已记录最终 HEAD `d0db7e4`、Nuxt 3/H3/OG 依赖树、prepare/build 与函数 artifact 来源。
- [x] [验证] `openspec validate fix-vercel-nitro-runtime-closure --strict` - 已确认本子任务工件链有效。

## Runtime closure investigation

- [x] [验证] `.vercel/output/functions/**` 与 `.output/server/**` - 已检查现有本地 Vercel functions artifact；发现 chunks 含 `file://D:/.../node_modules/.pnpm/...` 绝对路径，当前主工作区无可启动 `.output`，远端函数日志缺少 `entities/decode`。
- [x] [验证] Vite SSR / Nitro / NFT trace - 已将首错归属到 Vercel runtime startup/production closure，并记录 root/docs manifest、Vite noExternal、Nitro inline 与 Windows trace 对照结果。
- [x] [修改] `packages/vue-element-cui-nuxt/nuxt.config.ts` 或实际 manifest 文件 - 通过 `entities` 全局版本锁定、VueUse/Element Plus/Reka/defu SSR inline 与 Popper alias 绝对入口映射闭合 Vercel runtime 依赖链，并记录每层首错。
- [x] [验证] Linux/Vercel 构建 - Git Integration Linux 构建生成 `__fallback.func`（约 3.73MB），构建日志无 Windows `file://D:/` 路径，且最终 HTTP smoke 未再出现未声明依赖错误。

## End-to-end acceptance

- [x] [验证] `.github/workflows/ci.yml` - push 触发 run `33402551030`（https://github.com/ruan-cat/eams-component-lib/actions/runs/33402551030），frozen install、prepare、测试和 Linux build 全部成功。
- [x] [验证] Vercel Git Integration - commit `d0db7e4` 已触发正式生产构建；日志确认 checkout SHA、install、组件库 `^build`、Nuxt functions artifact、搬运到根 `.vercel/output` 与 READY（deployment `dpl_E3ShR447tNh6SqjBbLQXfWeWQwhz`）。
- [x] [验证] Vercel HTTP smoke - 首页、安装页、Table demo、规范页、更新页及 Content cache/search API 均返回 200；响应非空且无 `entities/decode`、`@vueuse/core`、`@popperjs/core`、`defu` runtime 日志。
- [x] [验证] `agent-browser` - 可见浏览器打开生产首页与 Table demo，确认导航/侧栏、主题按钮、SSR 内容、表格 demo 与代码面板；浏览器 errors 输出为空。
- [x] [验证] 生产发布 - Git push 触发 production alias `https://vec.ruan-cat.com` 指向 READY deployment，HTTP 与浏览器 smoke 均通过。
- [x] [新增] `agent-progress.md` / `agent-findings.md` - 已记录当前 checkpoint、父子 change 关系、Vercel 首错、失败索引和最终剩余风险。
