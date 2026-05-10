---
name: meeting-minutes
description: "Convert meeting recordings, transcripts, or voice-to-text files into professionally formatted meeting minutes (Word .docx). Trigger whenever the user uploads a transcript, recording text, or voice memo text and asks for meeting minutes, meeting notes, meeting summaries, or 会议纪要. Also trigger when the user mentions '录音转文字', '会议记录', '讨论纪要', '整理会议', or any request to organize a meeting transcript into a structured document. This skill handles the full pipeline: content analysis, structural organization, and polished .docx generation with tables, headers, and action items."
---

# Meeting Minutes Generator

Transform raw meeting transcripts into structured, professional meeting minutes documents (.docx).

## Overview

This skill takes unstructured meeting transcripts (typically from voice-to-text tools) and produces a comprehensive, well-organized Word document. The output follows a fixed seven-section architecture that balances completeness with readability.

## Workflow

1. **Read the transcript** from the uploaded file
2. **Analyze the content** — identify participants, topics, key arguments, decisions, and action items
3. **Map content to the seven-section architecture** (see Document Architecture below)
4. **Generate the .docx** using the bundled template script at `scripts/generate_minutes.js`
5. **Validate** with `python scripts/office/validate.py` (relative to this skill's directory), fix any XML issues, then present to user

## Content Analysis Guidelines

Meeting transcripts from voice-to-text tools are messy — fragmented sentences, speaker changes without labels, repetition, tangents, and filler words. The skill's core value is transforming this chaos into clarity.

### Identifying Structure from Chaos

When analyzing a transcript, look for these signals:

- **Topic shifts**: phrases like "然后就是", "接下来", "另外一个问题", "the next point", "moving on to" mark new discussion topics
- **Decisions and consensus**: "我觉得可以", "达成共识", "就这么定了", "agreed", "let's go with" signal conclusions
- **Disagreements**: "但是我觉得", "我不同意", "I don't think so" mark important debates to capture
- **Action items**: "你先改", "下一步", "要做的是", "action item", "TODO", "you should" indicate tasks
- **Priority signals**: "最重要的是", "核心问题", "关键在于", "the main issue" mark what matters most

### Speaker Identification

Transcripts often lack speaker labels. Infer roles from context:

- Seniority cues: giving directives, making final decisions, referencing broader experience → likely a senior person (advisor/manager/lead)
- Execution cues: reporting progress, asking for guidance, describing implementation details → likely a junior person (student/report/team member)
- If roles are ambiguous, use neutral labels ("参会者A/B/C" or "Participant A/B/C") rather than guessing

### Content Completeness

Every substantive point in the transcript should appear in the output. "Substantive" means:
- Arguments for or against a position
- Specific suggestions or proposals
- Decisions (including decisions NOT to do something)
- Concerns raised (even if unresolved)
- Context or reasoning behind a decision

Do NOT omit: minority opinions, rejected ideas (capture why they were rejected), conditional decisions ("do X only if Y happens"), or meta-discussion about strategy/priorities.

DO omit: pure filler ("嗯", "对对对" as agreement tokens), repeated statements that add no new information, off-topic small talk unrelated to any agenda item.

## Document Architecture

Every meeting minutes document follows this seven-section structure. Adapt section titles and content to the meeting's domain, but preserve the structural skeleton.

### Section I: Meeting Basic Information (会议基本信息)

A metadata table with these rows:
- Meeting time (会议时间)
- Meeting format (会议形式): in-person, online, hybrid
- Participants (参会人员): names and roles if identifiable
- Meeting topic (会议主题): one-sentence summary
- Additional context rows as needed (e.g., project name, document under discussion)

### Section II: Topic Overview (议题概述)

A high-level summary of all topics discussed, presented as a table:
- Columns: sequence number, topic name, brief description
- Purpose: give readers a quick map of the meeting before diving into details
- Colored header row for visual distinction
- Keep descriptions to 1-2 sentences each

### Section III: Detailed Discussion by Topic (逐条讨论与决议)

This is the core section, typically 50-70% of the document. For each major topic:

#### Sub-section structure (per topic):
1. **Problem/Issue Analysis (问题分析)**: What was discussed and why — the background and context
2. **Discussion Points (讨论要点)**: Key arguments, perspectives, and debates from different participants. Use `bodyRuns` with bold labels to attribute viewpoints. Capture the reasoning, not just the conclusion.
3. **Consensus & Resolution (达成共识与修改/决议方案)**: What was decided. Use bullet points for actionable items. If no consensus was reached, say so explicitly.

### Section IV: Other Important Topics (其他重要议题)

Secondary topics that were discussed but are not the main focus. These get lighter treatment — a heading, a paragraph or two of context, and bullet points for any decisions.

### Section V: Situational Analysis (形势/背景分析)

Context-dependent section. Examples:
- For review discussions: reviewer stance analysis table
- For project meetings: stakeholder/risk analysis
- For strategic meetings: competitive landscape summary
- Skip this section if there's no meaningful external context to analyze

### Section VI: Action Plan & Priorities (行动计划与优先级)

A table summarizing all action items:
- Columns: sequence number, task, specific requirements, priority/timeline
- Alternating row shading for readability
- Also include a "NOT to do" list if the meeting explicitly decided against certain actions

### Section VII: Meeting Summary (会议总结)

3-5 numbered paragraphs, each starting with a bold ordinal ("第一，" / "First,"), synthesizing the meeting's key takeaways. This is not a repetition of decisions — it's an interpretive summary of what the meeting means and what the strategic direction is.

End with a right-aligned date line.

## Document Formatting Specification

### Visual Design

- **Page**: A4 (11906 × 16838 DXA), margins 1200 DXA left/right, 1440 DXA top/bottom
- **Title**: SimHei 22pt bold, color #1F3864, centered, with a subtitle line below in SimSun 12pt gray
- **Heading 1**: SimHei 16pt bold, for section numbers (一、二、三...)
- **Heading 2**: SimHei 14pt bold, for sub-sections (3.1, 3.2...)
- **Heading 3**: SimHei 12pt bold, for sub-sub-sections (3.1.1, 3.1.2...)
- **Body text**: SimSun 11pt, line spacing 360 twips, first-line indent 480 DXA
- **Header**: right-aligned meeting title in gray italic, with blue bottom border
- **Footer**: centered page number "第 X 页" in gray, with top border

### Tables

- Header row: white bold text on #2B579A background
- Data rows: alternating white / #F5F8FC for readability
- Label columns: light blue (#EDF2F9) background with bold text
- All cells: 1px #999999 borders, internal margins 60/100 DXA
- Width: full content width (9506 DXA for A4 with 1200 DXA margins)

### Typography Rules

- Use SimHei (黑体) for all headings — it provides clear visual hierarchy in Chinese documents
- Use SimSun (宋体) for body text — standard for Chinese formal documents
- Bold key terms inline using `bodyRuns` with mixed bold/normal TextRuns
- Bullet items should be at least one full sentence

## docx-js Critical Rules

The template script follows these rules. When adapting the template (adding tables, sections, paragraphs), you must also follow them:

- **Never use `\n`** — use separate Paragraph elements
- **Never use unicode bullets** (`"• Item"`) — use `LevelFormat.BULLET` with numbering config
- **PageBreak must be inside a Paragraph** — standalone creates invalid XML
- **Tables need dual widths** — set both `columnWidths` on Table AND `width` on each TableCell, values must match
- **Table width = sum of columnWidths** — always use `WidthType.DXA`, never `WidthType.PERCENTAGE`
- **Use `ShadingType.CLEAR`** — never `ShadingType.SOLID` for table shading (causes black backgrounds)
- **Always add cell margins** — `margins: { top: 60, bottom: 60, left: 100, right: 100 }`
- **Never use tables as dividers** — use Paragraph `border` instead
- **Override built-in styles with exact IDs** — `"Heading1"`, `"Heading2"`, etc.
- **Include `outlineLevel`** in heading styles — required for TOC (0 for H1, 1 for H2)

## Generating the Document

After analyzing the transcript and mapping content to the architecture:

1. Read the template script at `scripts/generate_minutes.js` within this skill's directory for the helper functions and document skeleton
2. Adapt the template by:
   - Replacing placeholder content with actual meeting content
   - Adding/removing table rows and sections as needed
   - Adjusting section titles to match the meeting's domain
3. Run the script with `node`, validate with `scripts/office/validate.py` (relative to this skill's directory), fix any XML issues (common: empty `<w:shd/>` tags need `w:val="clear"` attribute), and present to user

### Adaptation Principles

The template provides the structural skeleton — seven sections, formatting helpers, table styles. When adapting:

- **Always keep all seven sections** (skip Section V only if truly no external context exists)
- **Section III depth scales with content**: a 10-minute meeting might have 2 topics with 1 paragraph each; a 2-hour meeting might have 5 topics with sub-sub-sections
- **Tables are preferred over prose** for structured comparisons, metadata, and action items
- **The "NOT to do" list in Section VI** is important — explicit non-decisions prevent future confusion

## Language Handling

- If the transcript is in Chinese, produce the document in Chinese with Chinese section numbering (一、二、三)
- If in English, use English with numeric section numbering (I, II, III)
- If mixed, follow the dominant language of the transcript
- Technical terms, proper nouns, and acronyms should be preserved in their original language regardless

## Quality Checklist

Before presenting the final document, verify:

- [ ] Every substantive discussion point from the transcript appears somewhere in the document
- [ ] Decisions are clearly separated from ongoing discussions
- [ ] Action items have owners (or are marked "TBD" if not assigned)
- [ ] No content from Section III is duplicated in Section VII (summary should synthesize, not repeat)
- [ ] Tables render correctly (dual widths set, ShadingType.CLEAR used, borders defined)
- [ ] Document validates with `validate.py`
- [ ] Headers and footers are present and correct
