# 2026-03 `::demo-playground` MDC 容器语法错误

## 1. 问题现象

- 页面出现 `::demo-playground`、`title:`、`#preview`、`#code` 裸文本，并伴随 hydration mismatch。

## 2. 实际根因

- 容器被写成标题、frontmatter 顺序错误或开闭符不匹配，MDC 没有把内容解析为容器。

## 3. 关键误导点

- 容易先怀疑 DemoPlayground 组件或 Nuxt 依赖；“marker 裸文本 + hydration mismatch”更直接指向 Markdown 语法。

## 4. 有效修复

- 统一为 `::demo-playground`、紧跟 `---` frontmatter、容器内的 `#preview/#code` 与末尾 `::`。

## 5. 验证方式

- Chrome console 无 hydration mismatch，正文不再出现裸 marker，demo 标题和描述正常渲染。

## 6. 后续约束

- 禁止使用 `## ::demo-playground`，批量替换前先抽样并限定目标容器片段。
