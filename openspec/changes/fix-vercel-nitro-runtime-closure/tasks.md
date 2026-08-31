## Parent / Pilot Batch

- [x] [验证] `openspec/changes/upgrade-shadcn-docs-nuxt-dependencies/agent-findings.md` - 已回读父 change F24，确认依赖基线、已尝试路径与不可回退边界。
- [x] [验证] Vercel Project `vue-element-cui-nuxt-doc` - 已核对 Root Directory `.`, Build Command `pnpm run build:docs:nuxt-doc`, Output Directory `.vercel/output`, Node `24.x`，并通过 API 确认 GitHub `ruan-cat/eams-component-lib`、生产分支 `main` 已连接。
- [x] [验证] 当前源码与锁文件 - 已记录当前 HEAD `947d477...`、未提交变更、Nuxt 3/H3/OG 依赖树、prepare/build 与函数 artifact 来源。
- [x] [验证] `openspec validate fix-vercel-nitro-runtime-closure --strict` - 已确认本子任务工件链有效。

## Runtime closure investigation

- [x] [验证] `.vercel/output/functions/**` 与 `.output/server/**` - 已检查现有本地 Vercel functions artifact；发现 chunks 含 `file://D:/.../node_modules/.pnpm/...` 绝对路径，当前主工作区无可启动 `.output`，远端函数日志缺少 `entities/decode`。
- [x] [验证] Vite SSR / Nitro / NFT trace - 已将首错归属到 Vercel runtime startup/production closure，并记录 root/docs manifest、Vite noExternal、Nitro inline 与 Windows trace 对照结果。
- [ ] [修改] `packages/vue-element-cui-nuxt/nuxt.config.ts` 或实际 manifest 文件 - 只实施首个失败阶段所需的最小 runtime closure 修复，并记录删除条件。
- [ ] [验证] Linux/Vercel 构建 - 重新生成函数 artifact，确认无本机绝对路径、无未声明依赖和无新增宽 externalization。

## End-to-end acceptance

- [ ] [验证] `.github/workflows/ci.yml` - 以当前 commit 执行 frozen install、prepare、测试和 Linux build，保存 run URL/结论。
- [ ] [验证] Vercel Git Integration - 以当前 commit 触发正式 Git 构建，确认 checkout SHA、install、build、functions artifact 与 READY。
- [ ] [验证] Vercel HTTP smoke - 请求首页、组件 demo、Content cache/search API，确认 2xx、非空响应和无 `entities/decode` 日志。
- [ ] [验证] `agent-browser` - 在可见浏览器中访问首页与至少一个 demo，检查 console、hydration、暗黑模式、侧栏和 demo 交互。
- [ ] [验证] 生产发布 - 仅在 Git 主链与浏览器 smoke 全部通过且获得明确发布授权后执行；否则保持未完成并记录阻塞。
- [x] [新增] `agent-progress.md` / `agent-findings.md` - 已记录当前 checkpoint、父子 change 关系、Vercel 首错、失败索引和最终剩余风险。
