# 2026-09-01 Prettier 破坏 Nuxt MDC 图标 props

## 1. 问题现象

- 文档卡片图标消失，`title`、`icon`、`to` 等 props 变成页面纯文本。

## 2. 实际根因

- Prettier 在 MDC 组件声明与 YAML frontmatter 的 `---` 之间插入空行，MDC 解析器因此把 `---` 当作普通分隔线。

## 3. 关键误导点

- 先检查 icon bundle 或组件缺失，实际 HTML 中连 icon 元素都没有，说明 props 从未被解析。

## 4. 有效修复

- `.prettierignore` 排除 Nuxt Content Markdown；`prettier.config.mjs` 对该路径启用 `requirePragma`；手动恢复 `::card` 与 `---` 的紧邻关系。

## 5. 验证方式

- 请求文档页面 HTML，确认预期 icon class 存在且 props 不再以纯文本出现。

## 6. 后续约束

- MDC 内容永远不能被 Prettier 格式化；排查图标消失先看 HTML 是否存在 icon 元素。
