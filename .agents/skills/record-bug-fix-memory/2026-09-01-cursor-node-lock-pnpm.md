# 2026-09-01 Cursor 锁定原生 `.node` 导致 pnpm install 失败

## 1. 问题现象

- `pnpm install` 报 `EPERM unlink`，目标为 `@oxc-parser` 的 Windows 原生 `.node` 文件，安装事务回滚。

## 2. 实际根因

- Cursor TypeScript 服务持有原生文件锁，pnpm 无法替换 addon。

## 3. 关键误导点

- 在 IDE 内反复重试安装，忽略了锁来自 IDE 进程而非依赖声明。

## 4. 有效修复

- 改在 Cursor 外部的 PowerShell 或系统终端执行 `pnpm install`。

## 5. 验证方式

- 外部终端安装无 EPERM，`pnpm-lock.yaml` 正确更新。

## 6. 后续约束

- 更新 Oxc、esbuild、SWC 等原生依赖时，Cursor 内置终端只用于读日志，不用于安装。
