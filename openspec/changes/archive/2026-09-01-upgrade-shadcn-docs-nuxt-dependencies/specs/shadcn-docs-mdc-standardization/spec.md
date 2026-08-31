## ADDED Requirements

### Requirement: 内容页必须使用标准 demo-playground MDC 语法

系统 SHALL 使用行首 `::demo-playground` 开标记、由 `---` 包裹的 frontmatter、行首 `#preview` 与 `#code` slots，以及独占一行的 `::` 闭标记。

#### Scenario: 组件 demo 页面无裸 marker

- **WHEN** 解析任一包含 demo 的内容页
- **THEN** 页面渲染出预览和代码区域，不显示 `::demo-playground`、`title:`、`#preview` 或 `#code` 裸文本

### Requirement: Prettier 不得改写 MDC 内容结构

系统 SHALL 通过 `.prettierignore` 与 Prettier override 双保险排除 `packages/vue-element-cui-nuxt/content/**/*.md` 的自动格式化，并提供测试扫描非法 marker。

#### Scenario: 格式化检查不会破坏容器边界

- **WHEN** 执行仓库格式化检查
- **THEN** Content Markdown 的容器边界、frontmatter 和 slot 标记保持原样
