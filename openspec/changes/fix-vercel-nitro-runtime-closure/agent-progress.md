# 子任务进度

- Change：`fix-vercel-nitro-runtime-closure`
- Parent：`upgrade-shadcn-docs-nuxt-dependencies`；本 change 只接管父任务 F24 的 Vercel/Nitro runtime closure。
- 当前 checkpoint：Pilot / 任务 1-6 已完成，compatibilityDate 对象（2024-09-19）改写已验证，任务 7 最小修复仍失败。
- 状态：分层阻塞；Git Integration 的 workspace build 依赖缺口已通过提交 `951272d` 推送并在生产构建中验证；构建已 READY，但 Function closure 的 HTTP 500 仍未关闭。
- 已完成证据：父 F24 已回读；Vercel Project Git link/Root/Build/Output/Node 已核对；Vercel Git Integration 已 checkout commit `1a46cc9` 并成功构建组件库、Nuxt 函数、搬运 `.vercel/output`，部署 `dpl_CNE8FmdADgz9u7X8b9NSnrJDDSDL` READY；子 change strict validate 通过。
- 已确认首错：Vercel 预览构建 READY 后 HTTP 触发 `@vue/compiler-core` → `vue` → `entities/decode` 缺包；旧生产域名仍 200。
- 已排除：Markdown MDC 语法不是首错；Windows `trace:false` 产物含本机绝对路径，不能用于 Vercel；root/docs 显式 entities 与多轮 noExternal/inline 对照仍失败；排除本地生成目录的 clean checkout 仍复现同一运行时错误。
- 浏览器证据：agent-browser 在 `--no-sandbox` 下成功打开旧生产首页并看到导航/主题控件；候选预览未呈现应用，且 `vercel curl` 返回 500。
- 下一步：保留任务 7-9、11-13 未完成；继续处理 `entities/decode` 函数闭包，再重跑 HTTP 与 agent-browser 门禁。
