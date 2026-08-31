# 2026-09-01 Nuxt dev warning 清理基线

## 1. 问题现象

- 页面可打开，但 `nuxt dev` 仍有 i18n、OG Image、Icon、Sass 等 warning。

## 2. 实际根因

- 多个小兼容问题叠加：缺失单语默认值、重复自动导入、禁用 OG Image 后仍调用 helper、缺少本地图标集合、旧 Sass `mix()`。

## 3. 关键误导点

- 把多个 warning 拼接成一个根因，或拿旧日志代替当前进程观察。

## 4. 有效修复

- 补齐单语 i18n；去掉重复 helper；禁用 OG Image 时移除调用；安装 lucide 集合；把 Sass `mix()` 迁移到 `color.mix()`。

## 5. 验证方式

- 用单一 fresh dev 进程检查 `dev.stderr`、页面 HTTP 状态和 Chrome console。

## 6. 后续约束

- 只记录 fresh 进程产生的 warning 证据，不能用历史日志拼接结论。
