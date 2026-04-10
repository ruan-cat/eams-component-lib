# 组件库文档站 Dialog 遮罩层失效——从生产事故到根因定位的全链路排查

> 简历叙事素材。面试时用「问题 → 排查思路 → 根因 → 修复 → 验证」的结构讲故事。

---

## 一句话概括

在企业级 Vue 3 组件库文档站中，定位并修复了 Element Plus Dialog 组件遮罩层（overlay）在 dev 和生产环境均完全失效的问题。根因是 Element Plus 版本升级后 `appendToBody` 默认行为变更，叠加文档站 CSS `isolation: isolate` 堆叠上下文，导致 overlay 被困在局部 DOM 层级中。

---

## 项目背景（面试时 30 秒交代清楚）

- **技术栈**：Vue 3 + Element Plus + Nuxt 3 (SSR) + Tailwind CSS v4 + pnpm monorepo
- **项目结构**：`packages/vue-element-cui`（组件库）+ `packages/vue-element-cui-nuxt`（文档站），workspace 依赖
- **部署方式**：Vercel Serverless，文档站地址 `vec.ruan-cat.com`
- **核心矛盾**：组件库封装了 `CuiDialog`，底层使用 Element Plus `<el-dialog>`；文档站使用 `shadcn-docs-nuxt` 主题（Tailwind CSS v4），demo 容器需要做样式隔离

---

## 问题现象（面试时用截图辅助描述）

用户访问 `vec.ruan-cat.com/components/feedback-overlay/dialog`，点击「打开确认弹层」按钮后：

- 对话框弹出，但 **页面完全没有半透明遮罩** 覆盖
- 背后的 header、sidebar、正文内容全部清晰可见
- 对话框像一个浮动卡片悬在页面上，没有任何视觉层级
- dev 和 production 环境均复现，排除构建/部署差异

---

## 排查思路与技术决策链（面试核心部分，3~5 分钟讲透）

### 第一轮：排除构建和 CSS 丢失（走了弯路，但有排除价值）

初始假设：是不是 `nuxt.config.ts` 中 `vite.ssr.noExternal` 的依赖外部化太激进，导致 Element Plus CSS 没有被正确打入产物？

**验证动作：**

1. 用 `curl` 拉取生产 CSS 文件（367KB），搜索关键类名 `.el-dialog`、`.el-overlay`、`.el-button` → 全部存在
2. 搜索 CSS 变量 `--el-color-primary`、`:root{--el-` → 全部存在
3. 搜索 Tailwind v4 的 `@layer base`、`@layer utilities` → 存在于 HTML 内联 `<style>` 标签中

**结论：CSS 完整无丢失。依赖外部化不是根因。** 这一步虽然没找到根因，但排除了最大的假设分支，面试时可以展示「有方法论地排除假设」的能力。

### 第二轮：排除 CSS 级联冲突

假设：Tailwind CSS v4 的 preflight 重置是否覆盖了 Element Plus 样式？

**技术分析：**

- Tailwind v4 的 preflight 在 `@layer base` 中，包含 `* { border-width: 0; border-style: solid; }` 等重置规则
- Element Plus CSS 是 **非分层（unlayered）** 样式
- CSS 级联层规则：**非分层样式始终优先于所有 `@layer` 内的样式**，无论选择器权重

**结论：级联层机制保护了 Element Plus 样式。Tailwind 不是根因。**

### 第三轮：运行时计算样式检查（接近真相）

使用 Chrome DevTools MCP 在浏览器中执行 JavaScript，检查 overlay 元素的 `getComputedStyle`：

```javascript
const overlay = document.querySelector(".el-overlay");
getComputedStyle(overlay).backgroundColor; // "rgba(0, 0, 0, 0.5)" ✓
getComputedStyle(overlay).position; // "fixed" ✓
getComputedStyle(overlay).zIndex; // "2002" ✓
getComputedStyle(overlay).inset; // "0px" ✓
```

**所有 CSS 属性完全正确，但页面上看不到遮罩。** 这是一个反直觉的结果——样式对但视觉不对，必须有其他原因。

### 第四轮：DOM 层级检查（找到根因）

**关键一问：overlay 挂载在哪里？**

```javascript
overlay.parentElement; // → DIV.space-y-4（demo 组件内部）
// 预期应该是 BODY！
```

**根因浮出水面。** 随后追溯祖先链：

```plain
.el-overlay → .space-y-4 → .cui-demo-container(isolation:isolate) → .cui-demo-preview → ... → BODY
```

`isolation: isolate` 创建了新的堆叠上下文。overlay 的 `z-index: 2002` 只在这个上下文内生效，无法覆盖外部的 header（`z-index: 40`）和 sidebar（`z-index: 30`）。

### 第五轮：源码验证（确认版本行为变更）

阅读 `node_modules/element-plus/es/components/dialog/src/dialog.mjs`：

```javascript
appendToBody: Boolean,  // 无默认值 → Vue 3 中 Boolean 默认 false
appendTo: { type: ..., default: "body" }
```

以及模板渲染逻辑：

```javascript
createBlock(ElTeleport, {
	to: __props.appendTo, // "body"
	disabled: !__props.appendToBody, // !false = true → Teleport 被禁用！
});
```

Element Plus 旧版使用 `teleported` 属性（默认 `true`），新版改为 `appendToBody`（Boolean 类型，默认 `false`）。行为完全翻转。

---

## 修复方案（面试时 30 秒讲完）

在 `CuiDialog` 组件的 `<el-dialog>` 上添加一行：

```vue
<el-dialog ... append-to-body>
```

强制启用 Teleport，将 overlay 挂载到 `<body>` 层级。

---

## 验证（面试时展示「严谨验证」的思维）

1. **DOM 验证**：`document.querySelector('.el-overlay').parentElement === document.body` → `true`
2. **覆盖验证**：`document.elementFromPoint()` 在 header、sidebar、content、corner 四个位置均返回 `el-overlay-dialog`，确认遮罩覆盖全页面
3. **回归验证**：292 个组件库测试全部通过，无回归

---

## 面试加分点（可以主动展开的方向）

### CSS 堆叠上下文深度理解

- `isolation: isolate` 创建堆叠上下文但不改变包含块（containing block），所以 `position: fixed` 仍然相对于 viewport 定位
- `z-index` 只在同一堆叠上下文内比较，跨上下文时由上下文本身的层级决定
- `transform`、`filter`、`perspective`、`will-change`、`contain` 会创建新的包含块，改变 `position: fixed` 的参照物——本次事故中它们都不存在，排查时逐一确认过

### CSS 级联层（Cascade Layers）

- Tailwind v4 使用 `@layer base/theme/utilities` 组织样式
- 非分层样式（如 Element Plus）**始终优先于**所有层内样式，无论选择器权重
- 这是 CSS Cascade Level 5 规范的内容，能展示对现代 CSS 架构的深入理解

### Monorepo 中的 SSR 依赖管理

- pnpm workspace 的符号链接结构如何影响 Vite SSR 的外部化决策
- `vite.ssr.noExternal` 与 `nitro.externals.inline` 的作用阶段差异
- Vercel 部署时 `@vercel/nft` 依赖追踪与 pnpm 符号链接的兼容问题

### 排查方法论

- 分层排除法：CSS 文件完整性 → CSS 级联冲突 → 运行时计算样式 → DOM 挂载层级 → 源码行为验证
- 每一层排除都有具体的验证动作和结论，不靠猜测
- 使用 Chrome DevTools MCP 进行程序化检查，而非手动肉眼比对

---

## 面试问答预案

**Q：你怎么判断不是 CSS 丢失？**
A：直接拉取生产 CSS 文件，搜索 Element Plus 的关键类名和 CSS 变量，全部存在。CSS 文件 367KB，完整包含了所有 Element Plus 组件样式。

**Q：如果 CSS 都在，为什么样式不对？**
A：所有计算样式（`getComputedStyle`）都是正确值——`rgba(0,0,0,0.5)` 的背景色、`position: fixed`、`z-index: 2002`。问题不在样式值本身，而在于 overlay 挂载在了错误的 DOM 位置。

**Q：为什么 overlay 没有被 Teleport 到 body？**
A：Element Plus 2.13.x 把 dialog 的 `teleported` 改名为 `appendToBody`，类型改成 Boolean。Vue 3 中 Boolean prop 未传时默认 `false`，导致 `<Teleport>` 的 `disabled` 为 `true`。这是一个破坏性的默认值变更。

**Q：为什么 overlay 在组件内也看不到遮罩效果？**
A：因为文档站的 demo 容器设置了 `isolation: isolate`，创建了新的堆叠上下文。overlay 的 `z-index: 2002` 只在这个上下文内有效，但上下文本身没有 z-index（`auto`），排在页面其他元素（header `z-40`、sidebar `z-30`）后面。所以 overlay 虽然覆盖了 viewport，但被其他元素挡住了。

**Q：你怎么验证修复是有效的？**
A：三层验证：(1) `overlay.parentElement === document.body` 确认 DOM 挂载正确；(2) `elementFromPoint()` 在页面四个角落均返回 overlay 元素，确认视觉覆盖；(3) 全量 292 个测试用例通过，无回归。
