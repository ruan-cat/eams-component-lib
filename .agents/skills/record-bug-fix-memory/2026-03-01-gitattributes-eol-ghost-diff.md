# 2026-03 `.gitattributes` 的 CRLF/LF 幽灵差异

## 1. 问题现象

- 文本文件在多个分支持续显示已修改，`git diff` 只显示换行符变化。

## 2. 实际根因

- `.gitattributes` 要求工作区 LF，但分支索引 blob 仍是 CRLF，索引与工作区行尾策略不一致。

## 3. 关键误导点

- 误以为是单分支未保存或 IDE 捣乱；只改一条分支无法消除其他分支的 CRLF 索引。

## 4. 有效修复

- 对目标路径执行 `git add --renormalize` 并提交；补充 editorconfig 的 LF 约束。

## 5. 验证方式

- 在相关分支切换后 `git status` 清洁，目标路径 `git diff` 为空。

## 6. 后续约束

- 先确认 diff 是否只有 CRLF↔LF，再做 renormalize；批量合并提交信息必须符合 Conventional Commits。
