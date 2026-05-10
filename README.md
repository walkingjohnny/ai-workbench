# AI Workbench

> 把文件丢进 inbox，然后去冲浪。回来的时候，活已经干完了。

完整使用文档：https://ai-lingnan.github.io/ai-workbench/

## 这是什么

一个让 Claude 替你打工的办公自动化工作区。

你负责把文件往 `inbox/` 里一扔，Claude 负责识别是什么、该怎么处理、处理完放哪。Excel 分析、PDF 解析、PPT 制作、日报周报——这些重复劳动，人类的时间太宝贵了，不该浪费在这上面。

**你的时间应该用来冲浪、喝咖啡、思考人生，或者做任何比整理 Excel 更有意义的事。**

## 开始偷懒

Clone 项目后，把下面这段话丢给 Claude Code，然后靠在椅背上：

```
帮我初始化 AI Workbench 工作区：

1. 创建工作目录：
   mkdir -p inbox tasks reports daily agent-workspace

2. 配置 MinerU API（PDF 解析服务）：
   创建 .claude/skills/mineru/.env，内容为：
   token=<你的 MinerU API token>
   （从 https://mineru.net 注册获取）

3. 启动定时任务（参考 .claude/loops/ 下的文档）：
   /loop 20m <inbox-monitor.md 中的提示词>
   /loop 24h <daily-routine.md 中的提示词>
```

重新打开 Claude Code 时，只需说：

```
帮我初始化项目的定时任务
```

## 三步下班

1. **扔** — 把任务文件夹丢进 `inbox/`
2. **说** — 告诉 Claude 你想要什么（它会生成便签 `task.md`）
3. **走** — Loop 自动轮询处理，你该干嘛干嘛去

没了。就这么简单。剩下的是 Claude 的事。

## 目录说明

| 目录 | 用途 | 谁在用 |
|------|------|--------|
| `inbox/` | 任务投递箱 | 你（唯一需要碰的地方） |
| `tasks/` | 任务工作区 | Claude（别进去添乱） |
| `reports/` | 日报、周报 | Claude 写，你签字 |
| `daily/` | 日级文件索引 | Claude 自动维护 |
| `agent-workspace/` | 多轮协作工作空间 | Claude 的草稿纸 |
| `demo/` | 示例任务 | 给你看看效果用的 |
| `templates/` | 文档模板 | 想自定义风格就改这里 |

## 详细规范

参见 `.claude/CLAUDE.md`。但说实话，你大概率不需要看——Claude 已经背下来了。
