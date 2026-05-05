# Inbox Monitor — 20 分钟轮询

以下为 `/loop` 命令的提示词，复制粘贴使用。

---

```
扫描 inbox/ 下的子文件夹，检查是否有新任务待处理。

有便签（文件夹内存在 task.md）的任务：
1. 将整个文件夹从 inbox/ 移入 tasks/，重命名为 {YYYY-MM-DD}-{任务名}/
2. 使用便签指定的 skill 处理，产出物保存在同一任务文件夹
3. 更新 changelog.md、daily/{YYYY-MM-DD}.md、tasks/README.md
4. git add 并 commit 本次任务变更（提交信息：task: {任务名}）

无便签的文件夹：
- 跳过，不处理（等待用户确认意图后生成便签）

inbox/ 下无子文件夹时：
- 静默结束，不输出任何内容

异常处理：
- 处理出错：将文件夹移回 inbox/，在 changelog.md 中记录错误原因
```
