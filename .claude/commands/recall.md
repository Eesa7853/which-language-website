---
description: Recall saved information from the project's memory file
---

Read `.claude/memory.md` in the project root and present its contents to the user, in your own words where that's clearer than a raw dump — the goal is the user (or a fresh session) getting oriented fast.

If the user gave topic keywords, focus on the relevant parts: $ARGUMENTS

If the file doesn't exist or is effectively empty, say so plainly and suggest using `/mem <info>` to start saving things — don't invent context that isn't in the file.
