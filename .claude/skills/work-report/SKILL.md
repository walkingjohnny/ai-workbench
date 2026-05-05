---
name: work-report
description: 撰写工作日报和周报。当用户说"写日报"、"写周报"、"今天做了什么"、"总结一下本周工作"、"帮我写个周报"、"日报模板"、"weekly report"、"daily report"时使用。即使用户只是模糊地提到"总结工作"或"汇报进展"，也应触发此 skill。
---

## 路由

| 用户意图 | 加载文档 |
|---------|---------|
| 写日报、今日总结、daily report | `references/daily-report.md` |
| 写周报、本周总结、weekly report | `references/weekly-report.md` |

## 信息收集

撰写报告前，主动从以下来源收集素材（按可用性尝试）：

1. **git log** — 对应时间范围内的 commit 记录
2. **任务列表** — 当前会话中的 task 状态
3. **用户口述** — 直接询问用户补充

如果自动收集的信息不足，向用户提问补充，不要编造内容。
