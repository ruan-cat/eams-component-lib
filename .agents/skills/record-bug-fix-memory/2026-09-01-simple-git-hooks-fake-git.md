# 2026-09-01 simple-git-hooks 写入假 `.git` 目录

## 1. 问题现象

- `git commit` 时 lint-staged 与 commitlint 均未触发，暂存文件未格式化，提交信息未校验。

## 2. 实际根因

- monorepo 内存在只有 `hooks/` 的假 `.git` 目录，`simple-git-hooks` 把钩子装到了错误位置；真实 Git 根目录使用另一个 `.git`。

## 3. 关键误导点

- 只看 `package.json` 所在目录，未核对 `git rev-parse --git-dir` 与钩子实际落点。

## 4. 有效修复

- 设置正确的 `core.hooksPath`，让钩子命令显式切入工作区；`commit-msg` 保存仓库根路径后再拼接参数文件。

## 5. 验证方式

- 执行 `git commit --allow-empty`，确认出现 lint-staged 输出且合法提交信息通过 commitlint。

## 6. 后续约束

- Git 根与 workspace 不同层级时，必须同时检查真实 git-dir、hooksPath 和 simple-git-hooks 写入位置。
