# 子任务进度

- Change：`fix-vercel-nitro-runtime-closure`
- Parent：`upgrade-shadcn-docs-nuxt-dependencies`；本 change 只接管父任务 F24 的 Vercel/Nitro runtime closure。
- 当前 checkpoint：Pilot / 任务 1-6 已完成，compatibilityDate 对象（2024-09-19）改写已验证，任务 7 最小修复仍失败。
- 状态：分层阻塞；Git Integration 已暴露并修复 workspace build 依赖缺口（提交 `951272d`），但该修复尚未重新推送；此前 Function closure 的 HTTP 500 仍未关闭。
- 已完成证据：父 F24 已回读；Vercel Project Git link/Root/Build/Output/Node 已核对；当前 HEAD `947d477...` 与未提交变更已记录；子 change strict validate 通过。
- 已确认首错：Vercel 预览构建 READY 后 HTTP 触发 `@vue/compiler-core` → `vue` → `entities/decode` 缺包；旧生产域名仍 200。
- 已排除：Markdown MDC 语法不是首错；Windows `trace:false` 产物含本机绝对路径，不能用于 Vercel；root/docs 显式 entities 与多轮 noExternal/inline 对照仍失败；排除本地生成目录的 clean checkout 仍复现同一运行时错误。
- 浏览器证据：agent-browser 在 `--no-sandbox` 下成功打开旧生产首页并看到导航/主题控件；候选预览未呈现应用，且 `vercel curl` 返回 500。
- 下一步：推送 `951272d`，重新执行 Git Integration 生产构建；若构建通过，再区分新的 Function runtime 错误与既有 `entities/decode` 证据，继续任务 7-13 门禁。
