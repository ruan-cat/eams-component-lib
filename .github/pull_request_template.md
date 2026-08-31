# Pull Request

> 本仓库使用根目录 `prettier.config.mjs` 统一格式化。提交前请完成下方质量门禁；Nuxt Content 的 MDC Markdown 受 `.prettierignore` 保护，不要手动绕过该约束。

## 变更摘要

<!-- 用 1~3 条说明变更做了什么，以及为什么需要。 -->

## 变更范围

- [ ] 组件库（`packages/vue-element-cui`）
- [ ] 文档站（`packages/vue-element-cui-nuxt`）
- [ ] 工程化配置 / AI 记忆 / 文档
- [ ] 其他：

## Prettier 与质量门禁

- [ ] 已运行 `pnpm format:check`
- [ ] 已运行 `pnpm lint`
- [ ] 已运行 `pnpm test`
- [ ] 已按变更范围运行 `pnpm run build` 或 `pnpm run build:docs`
- [ ] 已运行 `git diff --check`
- [ ] 未把 `pnpm-lock.yaml` 等不适合自动格式化的文件交给 Prettier
- [ ] 若修改 Nuxt Content MDC，已确认 `::component` 与 `---` 之间没有被插入空行

## 验收证据

<!-- 粘贴关键命令及结果；不要只写“已验证”。日志代码块统一使用 log。 -->

```log
命令：
结果：
```

## 风险与回滚

- 已知风险：
- 回滚方式：

## 关联信息

- 关联 Issue / OpenSpec：
- 需要特别关注的文件或路由：
