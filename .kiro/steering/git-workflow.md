---
inclusion: manual
---

# Git Workflow for This Project

## Why `execute_pwsh` Fails for Git

The inline shell tool (`execute_pwsh`) on this Windows machine times out for git commands because:
1. Git credential manager can trigger interactive prompts that block
2. The tool has a short implicit timeout and git network operations exceed it
3. TLS warning output from git credential manager adds latency

## Reliable Method: Always Use `control_pwsh_process`

**CRITICAL**: For ALL git operations in this project, use `control_pwsh_process` (background process) instead of `execute_pwsh`. Then read output with `get_process_output`.

### Standard Commit & Push Sequence

```
Step 1: Check status
  control_pwsh_process → git status
  get_process_output → review changes

Step 2: Stage files
  control_pwsh_process → git add -A
  (or selective: git add src/ docs/ etc.)
  get_process_output → confirm staged

Step 3: Commit
  control_pwsh_process → git commit -m "message"
  get_process_output → confirm commit hash

Step 4: Push
  control_pwsh_process → git push origin main
  get_process_output → confirm push success (look for "main -> main")
```

### One-Liner (when user says "commit and push everything")

```powershell
git add -A; git commit -m "message"; git push origin main
```

Run this as a single command in `control_pwsh_process`. Use `;` as separator (PowerShell on this machine doesn't support `&&`).

### Important Notes

- Always push directly to `main` (this is a prototype/demo project, single developer)
- The `dist/` folder is in `.gitignore` — CI builds it via GitHub Actions on push
- Ignore TLS security warnings in output (corporate proxy with disabled cert verification)
- Wait for `get_process_output` to show the PS prompt before concluding success
- Exclude `~$*.docx` files (Word temp files) — they're already untracked

### Files That Should NOT Be Committed

- `node_modules/` — dependencies (in .gitignore)
- `dist/` — build output, CI generates this (in .gitignore)
- `.env`, `docusign.env` — secrets (in .gitignore)
- `~$*.docx` — Word temp files
- `screenshots/` — Jira story screenshots (in .gitignore)

### Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml` which:
1. Checks out code
2. Runs `npm ci` + `npm run build`
3. Deploys `dist/` to GitHub Pages

No manual build step needed before pushing.
