# 2026-03 PowerShell Git 批量合并误报

## 1. 问题现象

- 含中文的脚本被报语法错误；合并实际成功却进入 catch，随后错误执行 `git merge --abort`。

## 2. 实际根因

- Windows PowerShell 5 误读无 BOM UTF-8；`$ErrorActionPreference = Stop` 与 `2>&1 |` 管道把 git hook 的 stderr 当成终止错误；管道后的 `$LASTEXITCODE` 也不再可靠。

## 3. 关键误导点

- 把 catch 文案和 `merge --abort` 的 fatal 当作真实冲突，未检查 `MERGE_HEAD` 或是否已产生合并提交。

## 4. 有效修复

- 使用 UTF-8 BOM；直接调用 git 并检查退出码；按产品要求决定 push 节奏；移除默认 `--no-ff`。

## 5. 验证方式

- PowerShell 解析器无错误，合并/推送成功，且不会在已完成合并后执行 abort。

## 6. 后续约束

- 禁止对 git merge/push 使用 `2>&1 |`；先查 `MERGE_HEAD`、提交状态与真实退出码。
