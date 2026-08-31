# 现代组件库展示仓

本项目是一个面向开源展示与求职叙事的前端组件库 monorepo。

## 本项目的技能表

- `openspec-apply-change`
  - 路径：`.agents/skills/openspec-apply-change/SKILL.md`
  - 用途：实施 OpenSpec 变更中的任务。
  - 触发时机：开始实施、继续实施或逐项处理 OpenSpec 任务时。
  - 参考作用：提供按任务清单推进实现的工作流。
  - 约束：需要可用的 openspec CLI。
- `openspec-archive-change`
  - 路径：`.agents/skills/openspec-archive-change/SKILL.md`
  - 用途：归档已完成的 OpenSpec 变更。
  - 触发时机：实现完成并准备结束变更时。
  - 参考作用：提供实验性工作流的归档步骤。
  - 约束：仅归档已完成的变更。
- `openspec-bulk-archive-change`
  - 路径：`.agents/skills/openspec-bulk-archive-change/SKILL.md`
  - 用途：批量归档多个已完成的 OpenSpec 变更。
  - 触发时机：需要并行归档多个变更时。
  - 参考作用：提供批量归档流程。
  - 约束：需要确认目标变更均已完成。
- `openspec-continue-change`
  - 路径：`.agents/skills/openspec-continue-change/SKILL.md`
  - 用途：为 OpenSpec 变更创建下一个工件并继续工作流。
  - 触发时机：用户要求推进变更、创建下一工件或继续工作流时。
  - 参考作用：帮助按工件依赖顺序推进。
  - 约束：需要可用的 openspec CLI。
- `openspec-explore`
  - 路径：`.agents/skills/openspec-explore/SKILL.md`
  - 用途：进入探索模式，协助调查问题和澄清需求。
  - 触发时机：用户希望在变更前或变更中共同探索方案时。
  - 参考作用：提供思考伙伴式的问题拆解方式。
  - 约束：探索结论不等同于已实施变更。
- `openspec-ff-change`
  - 路径：`.agents/skills/openspec-ff-change/SKILL.md`
  - 用途：快速创建实施所需的全部 OpenSpec 工件。
  - 触发时机：用户希望快速完成工件创建时。
  - 参考作用：减少逐工件往返的流程开销。
  - 约束：仍需在实施前审阅生成的工件。
- `openspec-new-change`
  - 路径：`.agents/skills/openspec-new-change/SKILL.md`
  - 用途：以结构化工作流启动新的功能、修复或修改。
  - 触发时机：用户要求开始新的 OpenSpec 变更时。
  - 参考作用：建立 proposal、design 和 tasks 等工件。
  - 约束：需要可用的 openspec CLI。
- `openspec-onboard`
  - 路径：`.agents/skills/openspec-onboard/SKILL.md`
  - 用途：通过真实代码库工作引导完成一轮 OpenSpec 工作流。
  - 触发时机：用户需要 OpenSpec 入门或完整演练时。
  - 参考作用：提供带讲解的端到端示例。
  - 约束：演练中的完成状态必须有实际证据。
- `openspec-sync-specs`
  - 路径：`.agents/skills/openspec-sync-specs/SKILL.md`
  - 用途：将变更中的 delta spec 同步到主 specs。
  - 触发时机：需要更新主规范但不归档变更时。
  - 参考作用：保持主规范与变更规范一致。
  - 约束：同步不代表代码实现已完成。
- `openspec-verify-change`
  - 路径：`.agents/skills/openspec-verify-change/SKILL.md`
  - 用途：验证实现是否匹配 OpenSpec 工件。
  - 触发时机：归档前需要检查完整性、正确性和一致性时。
  - 参考作用：提供实现与规范的验收清单。
  - 约束：必须基于可复核的验证结果，不得凭状态字段宣布完成。

## 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你深度思考遗漏点、缺漏点和冲突相悖点，并主动向我问询不清楚的实施细节。优先使用可用的 AskUserQuestion 工具，将不清楚的内容设计成一系列问题，与我协作补充细节。先形成一轮完整的实施清单，再亲自落实。

## 编写测试用例规范

1. 使用 vitest 的 `import { test, describe } from "vitest";`，测试结构采用 describe 和 test。
2. 测试文件格式为 `*.test.ts`。
3. 测试目录优先使用 `**/tests/` 或 `**/src/tests/`。
4. 在对应 monorepo 子包的 tests 目录编写；无法判断具体子包时，先咨询用户。

## 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `docs\reports` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告的一级标题： 必须是日期`YYYY-MM-DD`+报告名的格式。
  - 好的例子： `2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误` 。前缀包含有 `YYYY-MM-DD` 日期。
  - 糟糕的例子： `构建与 fdir/Vite 事件复盘报告` 。前缀缺少 `YYYY-MM-DD` 日期。
- 报告日志信息的代码块语言： 一律用 `log` 作为日志信息的代码块语言。如下例子：

  ````markdown
  日志如下：

  ```log
  日志信息……
  ```
  ````

- 报告语言： 默认用简体中文。
- 报告所使用的 agent 工具说明： 在报告的最前面增加说明，说明清楚当前报告是由哪个 agent 工具完成的。
- 报告所使用的 AI 模型说明： 在报告的最前面增加说明，说明清楚当前报告是由哪个 AI 模型完成的。

## 生成发版日志的操作规范

1. 运行 `pnpm dlx @changesets/cli add --empty` 在 `.changeset` 创建空文件。
2. 将随机文件名改为日期加语义化名称。
3. 按 changeset 规范写入包名和 major/minor/patch 标签。
4. 正文写清更新内容；禁止使用任何 Markdown 标题，使用有序列表。
5. 未明确发版等级时，先询问用户。

## 术语说明

### 发版日志相关术语

- `生成更新日志`：指在 `.changeset` 目录内编写面向 changeset 的更新日志文件，发版标签分为 `major`、`minor`、`patch`；未明确等级时先询问。
- `生成发版日志`：`生成更新日志` 的别名。

## 沟通协作要求

### 计划模式

计划模式下先设计方案并沟通，再修改实施；如有疑惑主动询问；完成后说明破坏性变更。避免越权修改全局 skills 目录，除非用户明确授权。

## 终端操作注意事项（防卡住）

在 Windows PowerShell 中避免超长单行命令，路径较多时拆分执行；优先使用 `pnpm run` 而非 `npx`；命令无输出时及时止损，不要反复轮询。建议等待：git 操作 5~10 秒，build/test 约 30 秒，install 约 60 秒。

## 简单任务的高效执行原则

明显简单且几步可完成的任务不创建任务列表、不写报告、不重复确认；信息充足时直接执行。涉及多包架构、新功能或多轮决策时再先侦察并列计划。用户明确给出文件或完整命令时，以其为最直接线索。

## 编码前思考、简洁优先、精准修改与目标驱动执行

编码前显式说明会影响路径的假设，发现多种解释时列出权衡；优先用最少代码解决当前问题，不添加推测性功能；只修改与请求直接相关的内容；先定义成功标准，再用命令、测试、构建或文档检查验证。保护用户已有改动，完成前检查 diff 和格式。

## 使用 superpower 技能的个人偏好

使用 `brainstorming`、`writing-plans`、`executing-plans` 等技能时，产出的规格和计划必须使用简体中文；不得擅自添加“已完成”状态；不得擅自 git commit。`executing-plans` 不默认创建 worktree，优先在当前分支工作，切换前先检查未提交修改。

## 文档读取策略

初始化或更新 AI 记忆文档时先读取目录和标题结构，再按需读取相关章节；结构化文件先查看顶层键和相关字段；更新使用精准插入或替换，编辑后复读修改位置并执行差异检查。

## 获取技术栈对应的上下文

处理特定技术栈问题时，主动获取对应的上下文文档和最佳实践。

### claude code skill

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
- 规范文档： https://agentskills.io/home

## Memorix MCP

- 如果当前会话暴露了 `mcp__memorix__*` 工具，在开始实施前优先使用 Memorix。
- 优先为当前工作区启动或刷新 Memorix 会话上下文，并加载近期上下文或执行与当前任务相关的项目内搜索。
- 如果本次会话没有暴露 Memorix MCP，不要把它理解成“项目没有历史”，而应把它视为当前环境缺少该能力。
- 在识别项目身份时，优先使用当前工作区根目录和当前 Git 状态，不要再依赖旧的嵌套路径。

## 项目术语

- `组件库`：`packages\\vue-element-cui\\package.json` 对应的现代 Vue 3 组件库。
- `组件库文档站`：`packages\\vue-element-cui-nuxt\\package.json` 对应的展示站与文档站。
- `旧组件库`：`old\\vue-element-cui\\package.json` 对应的 Vue 2 历史实现，仅用于迁移对照，不参与当前主链路开发。
- `仓库根`：当前 Git 根目录，同时也是唯一的 `pnpm workspace` 根目录；项目中已经不存在旧的嵌套 monorepo 目录层。

## 当前约束

- 本地 Git 只保留 `main` 分支，不再维护旧业务分支。
- 旧云效 remote 已断开；后续新增 remote 时不要破坏现有 tag。
- 现有 git tag 需要继续保留；如后续接入 GitHub，新 remote 需要显式推送 tag。
- `lint-staged.config.js` 保持当前的精细过滤策略，优先保障性能。
- `simple-git-hooks.mjs` 必须保持根目录简模式，禁止再使用切入旧嵌套目录的历史写法。
- `old/vue-element-cui` 必须保留，作为旧组件库迁移到现代架构的证据链。

## 主动澄清

当需求存在边界不清、实现路径冲突、删除范围不明确时，应先澄清再动手。默认优先保护：

- git tag
- `old/vue-element-cui`
- `packages/vue-element-cui`
- `packages/vue-element-cui-nuxt`

## 测试规范

- 使用 `vitest` 编写测试。
- 测试文件命名为 `*.test.ts`。
- 测试目录优先放在 `tests/` 或 `src/tests/`。

## 报告规范

- 报告默认写入 `docs/reports/`。
- 文件名使用 `YYYY-MM-DD-<topic>.md`。
- 默认使用简体中文。

## 发版日志规范

- 使用 `pnpm dlx @changesets/cli add --empty` 新建 changeset。
- changeset 文件名应改成带日期和语义的名字。
- 发版说明围绕组件库、文档站和工程化设施展开，不再描述旧业务应用。
