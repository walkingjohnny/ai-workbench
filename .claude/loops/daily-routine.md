# Daily Routine — 24 小时轮询

以下为 `/loop` 命令的提示词，复制粘贴使用。

---

```
执行每日例行任务：

1. 收集今日信息：
   - 读取 changelog.md 中今天的记录
   - 运行 git log --since="yesterday" --oneline（如有 git 历史）
   - 读取 daily/{YYYY-MM-DD}.md（如存在）

2. 生成日报：
   - 使用 work-report skill 的日报格式
   - 包含"今日复盘"章节（按 daily-review 规则）
   - 保存到 reports/{YYYY-MM-DD}-日报.md
   - 更新 reports/README.md

3. 如果今天是周五，同时生成周报：
   - 使用 work-report skill 的周报格式
   - 汇总本周 changelog.md 记录和各日日报
   - 保存到 reports/{YYYY-MM-DD}-周报.md

4. 今天没有任何工作记录时：
   - 仍生成日报，"今日完成"写"无"
   - 复盘章节写"今日无任务处理"
```
