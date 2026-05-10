# Document Architecture Reference

## Seven-Section Architecture Map

This reference shows how transcript content maps to document sections.

## Content Routing Rules

| Transcript Content Type | Routes To |
|---|---|
| Date, time, location mentions | Section I (Basic Info) |
| "Today we'll discuss..." or agenda-like statements | Section II (Overview) |
| Substantive arguments, debates, proposals | Section III (Detailed Discussion) |
| Brief mentions of side topics | Section IV (Other Topics) |
| External context (reviewers, competitors, stakeholders) | Section V (Analysis) |
| "Next steps", "TODO", "you should do X" | Section VI (Action Plan) |
| "Don't do X", "skip this for now" | Section VI (Not-To-Do List) |
| Nothing — synthesized by Claude | Section VII (Summary) |

## Section III Depth Scaling

The depth of Section III should scale with transcript length and complexity:

### Short meetings (< 30 min transcript, < 3 topics)
```
三、核心议题讨论
  3.1 Topic Title
    - Discussion summary (1-2 paragraphs)
    - Decision/consensus (bullet points)
```

### Medium meetings (30-90 min, 3-5 topics)
```
三、核心议题逐条讨论与决议
  3.1 Topic Title
    3.1.1 问题分析
    3.1.2 讨论要点
    3.1.3 达成共识与决议
  3.2 Topic Title
    3.2.1 问题分析
    3.2.2 讨论要点
    3.2.3 达成共识与决议
```

### Long meetings (> 90 min, 5+ topics)
Same as medium, but with more sub-topics and potentially grouping related topics under umbrella headings.

## Table Patterns

### Info Table (Section I)
Two columns: label (bold, light blue background) + value. Use `infoTable()` helper.

### Overview Table (Section II)
Three columns: number + topic name + description. Use `dataTable()` with column widths [600, 2400, 6506].

### Comparison Table (Section V)
Flexible columns depending on what's being compared. Common patterns:
- Two-entity comparison: [label, entity A, entity B] → widths [1600, 3953, 3953]
- Multi-criteria: [criteria, status, notes] → widths [2500, 3500, 3506]

### Action Table (Section VI)
Four columns: number + task + requirements + timeline. Use `dataTable()` with widths [600, 3200, 3200, 2506].

## Common Post-Processing Fixes

After generating with docx-js, these XML issues commonly need fixing:

1. **Empty `<w:shd/>` tags**: Replace with `<w:shd w:val="clear"/>` using:
   ```bash
   sed -i 's/<w:shd\/>/<w:shd w:val="clear"\/>/g' unpacked/word/document.xml
   ```

2. **Validation workflow**:
   ```bash
   python scripts/office/validate.py doc.docx
   # If fails:
   python scripts/office/unpack.py doc.docx unpacked/
   # Fix XML issues
   python scripts/office/pack.py unpacked/ doc.docx --original doc.docx
   ```

## Language Adaptation

### Chinese Documents
- Section numbers: 一、二、三、四、五、六、七
- Sub-sections: 3.1, 3.2... (Arabic numerals)
- Summary ordinals: 第一，第二，第三...
- Fonts: SimHei headings, SimSun body

### English Documents  
- Section numbers: I, II, III, IV, V, VI, VII
- Sub-sections: 3.1, 3.2... (same)
- Summary ordinals: First, Second, Third...
- Fonts: Arial headings, Arial body (change in template)
