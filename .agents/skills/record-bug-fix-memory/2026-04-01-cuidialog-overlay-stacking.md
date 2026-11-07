# 2026-04 CuiDialog 遮罩被堆叠上下文困住

## 1. 问题现象

- Dialog 能显示，但半透明遮罩不覆盖 header、sidebar 和正文；CSS 属性看起来正常。

## 2. 实际根因

- Element Plus 新版 Boolean `appendToBody` 未传时默认 false，Teleport 被禁用；overlay 留在带 `isolation: isolate` 的 demo 堆叠上下文中，z-index 无法覆盖页面。

## 3. 关键误导点

- 只看 `getComputedStyle` 会得到正确的 background、inset、z-index；真正转折点是检查 `overlay.parentElement` 不是 `body`。

## 4. 有效修复

- 在 `<el-dialog>` 上显式添加 `append-to-body`，让 overlay Teleport 到 `body` 层级。

## 5. 验证方式

- `document.querySelector('.el-overlay').parentElement === document.body` 为 true，页面各位置命中 overlay，组件库测试无回归。

## 6. 后续约束

- 升级 Element Plus 或使用隔离堆叠上下文后，先检查 overlay 父节点与 Teleport，不要只看 CSS 数值。
