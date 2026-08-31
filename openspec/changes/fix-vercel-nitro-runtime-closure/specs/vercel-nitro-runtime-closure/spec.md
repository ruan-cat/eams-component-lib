## ADDED Requirements

### Requirement: Vercel function artifact 必须具备可启动的 runtime closure

系统 SHALL 让 Vercel functions 产物在远端 Node 运行时解析 `@vue/compiler-core` 依赖链及其 `entities/decode` 子路径，不依赖本机绝对路径、根目录偶然提升或未声明的 workspace 传递依赖。

#### Scenario: 真实函数启动无 entities/decode 缺口

- **WHEN** Vercel 远端构建完成并请求首页、组件页面和 Content API
- **THEN** 函数启动成功，不返回 `FUNCTION_INVOCATION_FAILED`，且日志不存在 `Cannot find module 'entities/decode'`

### Requirement: 修复必须绑定首个失败阶段

系统 SHALL 先确定错误属于 Vite SSR transform、Nitro Rollup inline、NFT trace、函数 manifest 或 runtime startup，再应用对应阶段的最小修复；不得用跨阶段宽白名单掩盖错误。

#### Scenario: 配置修复有 exact error 证据

- **WHEN** 需要增加 `noExternal`、`inline` 或 trace 配置
- **THEN** 任务记录导入方、解析目标、首个失败阶段和删除条件，并验证修复未扩大无关依赖图

### Requirement: Vercel Git 主链与浏览器验收必须可区分

系统 SHALL 分别记录 GitHub Actions Linux、Vercel Git Integration、CLI/Prebuilt 辅助部署、真实 HTTP 和 agent-browser 可见浏览器证据；READY、单次 200 或本地 curl 不得替代完整链路。

#### Scenario: 部署状态与运行时状态分离

- **WHEN** Vercel 显示 READY 但 HTTP/浏览器请求失败
- **THEN** 任务保持未完成，记录首错与部署 ID，并回到 runtime closure 修复阶段
