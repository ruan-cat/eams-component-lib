# 2026-09-01 单语文档站误用多语言运行路径

## 1. 问题现象

- `/components` 曾出现 `Cannot read properties of undefined (reading children)` 等 500，并伴随多余 locale 路径处理。

## 2. 实际根因

- 单语文档站无条件继承了真实多语言运行路径。

## 3. 关键误导点

- 将历史上的 compat 覆盖与显式单语配置当成同一个修复结论，导致后续判断失真。

## 4. 有效修复

- 根据当前基线选择 compat 覆盖或显式 `defaultLocale/locales` 单语路线，并记录采用的具体路径。

## 5. 验证方式

- fresh 启动后访问 `/components`，确认没有 locale 相关 500 和多余路径跳转。

## 6. 后续约束

- 单语站点不能把多语言运行路径当默认前提，案例记录必须区分不同修法。
