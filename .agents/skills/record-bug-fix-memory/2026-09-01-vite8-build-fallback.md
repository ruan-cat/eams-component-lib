# 2026-09-01 Vite@8 构建产物缺少文件名兜底

## 1. 问题现象

- 构建阶段在 `vite:css-post` 抛出 `path` 类型错误，通常发生在 CSS 资源产物处理时。

## 2. 实际根因

- `rollupOptions.output.assetFileNames` 直接返回 `assetInfo.name`，资源名缺失时结果为 `undefined`。

## 3. 关键误导点

- 表面像是 Vite 版本不兼容，实际是构建配置没有处理空资源名。

## 4. 有效修复

- 为 `assetFileNames` 增加 `assetInfo.name ?? "assets/[name][extname]"` 这类回退值，不先降级依赖。

## 5. 验证方式

- 重新执行组件库构建，确认 CSS 产物阶段不再出现 `path` 类型错误。

## 6. 后续约束

- 再遇到同类错误时，先检查构建配置的兜底返回值。

> 历史全文：`2026-09-01-legacy-cases-source.md`（对应旧版经验库条目）。
