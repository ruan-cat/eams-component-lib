# 2026-04 Vercel `entities/decode` 云函数崩溃

## 1. 问题现象

- Vercel 请求返回 `500 FUNCTION_INVOCATION_FAILED`，运行时找不到 `entities/decode`。

## 2. 实际根因

- `nitro.externals.trace = false` 使函数缺失外部依赖；同时 workspace 中有多个 `entities` 版本，CJS 的 `require('entities/decode')` 可能解析到不提供该子路径的版本。

## 3. 关键误导点

- 误以为移除 `trace: false` 或改用 `inline: [/.*/]` 就够了；本地构建成功也不能代表 Vercel Linux trace 结果正确。

## 4. 有效修复

- 移除 `nitro.externals` 配置，给文档站显式声明 `entities`，并用 workspace overrides 统一到 7.x。

## 5. 验证方式

- 以实际 Vercel 部署 URL 验证云函数能启动，`entities/decode` 缺失错误消失，应用层响应可正常返回。

## 6. 后续约束

- 不要使用 `trace: false` 或 `inline: [/.*/]` 修复生产部署；依赖多版本必须先统一并通过真实部署验证。
