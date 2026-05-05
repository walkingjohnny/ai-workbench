---
name: do-agent-it
description: This skill should be used when the user asks to "/do-agent-it", "/do-agent-it [n] [task]", or needs an iterative multi-round multi-agent workflow with optional round count. Use whenever the user wants ambitious tasks executed via parallel subagents with planning, execution, review, and revision phases — repeated for n rounds when specified.
---

Explore and ultrathink to design a systematic multi-agent, multi-stage (up to 10 subagents in parallel in each stage) execution plan to accomplish the user's task.

## Argument parsing

`$ARGUMENTS` may take one of two forms:

- `do-agent-it [task]` — run **one** complete round (default behavior, backward compatible with v0.1)
- `do-agent-it [n] [task]` — run **at least `n` complete rounds**, where the first token of `$ARGUMENTS` is a positive integer

**Detection rule:** If the first whitespace-separated token of `$ARGUMENTS` parses as a positive integer, treat it as `n` and the remainder as `[task]`. Otherwise `n = 1` and the entire `$ARGUMENTS` is `[task]`.

Examples:
- `do-agent-it write a literature review on network games` → n=1, task="write a literature review on network games"
- `do-agent-it 3 write a literature review on network games` → n=3, task="write a literature review on network games"
- `do-agent-it 2 优化这份讲稿` → n=2, task="优化这份讲稿"

## Execution mode

`explore → ultrathink → plan → track → execute → review → revise → (next round) → deliver final output`

## General rules

- Get the current Date and Time (Beijing time)
- 创建临时工作目录 `agent-workspace/{YYYYMMDD-关键词}/` 作为整个多轮工作空间（if a folder with this name already exists, make a new one to avoid overwriting existing materials）
- Inside it, create per-round subdirectories: `round-1/`, `round-2/`, ..., `round-n/`. Each round contains its own `plan.md`, planning/execution/review/revision artifacts, and a `round-output/` folder holding that round's deliverable.
- Maintain a top-level `final/` folder that, after the last round, holds the final deliverable.
- When assigning tasks to subagents, specify their input and output files explicitly
- 每个子代理必须自己将处理结果立即保存到本地文件，不要返回给主代理！子代理自己马上保存，不要返回给主代理！
- 严禁将子代理完整输出返回主代理；只返回状态摘要
- The main/mother agent must allow all Read + Write + Bash tools for all sub-agents
- Apply context engineering — main agent context is scarce
- Do not ask for plan approval; once planning of a round finishes, set up tracking and execute
- Complete automation end-to-end, no human intervention

## Per-round structure (mandatory four phases)

Every round (`round-k/`, k = 1..n) MUST contain at minimum these four phases, with multiple agents in parallel where possible:

1. **规划阶段**：信息收集与方案规划 → output `round-k/plan.md`
2. **实施阶段**：执行与整合任务结果 → output `round-k/round-output/`
3. **审阅阶段**：对任务结果进行审阅与反馈 → output `round-k/review.md`
4. **修订阶段**：根据审阅反馈，对任务结果进行全面修订 → updates `round-k/round-output/` (or writes a `revised/` subfolder)

The first artifact of any round is its `plan.md`.

## Multi-round iteration (when n ≥ 2)

- Round 1 starts from the user's task and produces an initial deliverable through all four phases.
- Round k (k ≥ 2) takes round k-1's revised output as input. Its 规划阶段 must:
  - Read `round-{k-1}/round-output/` and `round-{k-1}/review.md`
  - Identify remaining weaknesses, unexplored angles, and opportunities for substantive improvement
  - Plan how this round will meaningfully advance the deliverable (not cosmetic changes)
- Each round runs all four phases in full — do not skip phases on later rounds.
- After round n's 修订阶段, copy the final revised deliverable into the top-level `final/` folder and write a brief `final/summary.md` listing what changed across rounds.

## Real-run testing requirement

The 实施阶段 and 修订阶段 are not complete until the deliverable has been exercised in a realistic runtime, not just statically reviewed:

- **Web apps (frontend or full-stack)**: spawn a subagent that drives a real browser (use `claude-in-chrome` MCP , `agent-browser`, or `playwright` skill). Open the running app, click through the primary user flows, fill forms, check console errors and network failures, take screenshots. File every reproducible issue and fix it before the round ends.
- **iOS / macOS apps**: build with `building-apple-platform-products`, then exercise with `axe-ios-simulator` (UI navigation, taps) or via the Simulator directly. Verify the golden path and obvious edge cases.
- **CLIs / scripts / backend services**: actually execute them on representative inputs and verify outputs, exit codes, and side effects. Don't ship code that has only been read, not run.
- **Other GUI apps**: use computer-use / screenshot-based verification when available.
- **Documents, slides, audio, video, PDFs**: render to the final format and visually inspect (open the PDF, play the audio, view the slides) — don't trust source-level review alone.

If a real-run test surfaces issues, the round is not done. Loop back into 修订阶段 (within the same round) until the deliverable passes its real-run test, then proceed to the next round.

## Reporting back to the user

At the end, the main agent reports only:
- Path to `final/` deliverable
- Number of rounds completed
- One-line summary of cross-round progression

Do not dump full subagent outputs into the main conversation.
