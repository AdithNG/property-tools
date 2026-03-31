# Vibe Coder Assessment — Claude Code Context

## Project Overview
This is a take-home technical assessment. Two full-stack mini apps need to be built and deployed live within 48 hours.

## Repo Structure
```
vibe-coder-assessment/
├── CLAUDE.md                  ← you are here
├── README.md                  ← written answers (Q1–Q3)
├── q4-refund-form/            ← Guest Refund Request Form
│   └── CLAUDE.md
└── q5-maintenance-logger/     ← Maintenance Issue Logger
    └── CLAUDE.md
```

## Tech Stack (use this everywhere, no deviating)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite via `better-sqlite3` (file-based, no external DB needed)
- **Language**: TypeScript
- **Deployment**: Vercel (each app deploys independently)

## Sub-Agent Routing Rules

### Parallel dispatch (use when ALL are true):
- 3+ independent tasks with no shared state
- Clear file boundaries — agents touch different files
- Tasks can be summarized when done

### Sequential dispatch (use when ANY is true):
- Task B depends on output from Task A
- Shared files or DB schema involved
- Scope is unclear and needs exploration first

### Background dispatch:
- Research or read-only analysis tasks
- Results are not blocking current implementation work

## Coding Standards
- All components in `app/` or `components/` — no spaghetti single files
- TypeScript strict mode on
- Mobile-first Tailwind (start with base styles, layer up with `md:` prefixes)
- SQLite DB file goes in `/data/db.sqlite` inside each app
- API routes in `app/api/`
- Commit after every meaningful unit of work (feature, fix, or milestone)
- Never use `console.log` for production — use proper error boundaries

## Constraints
- No external auth required
- No paid APIs or services
- Must work on Vercel free tier (SQLite via `/tmp` on Vercel or use Vercel KV as fallback)
- Keep bundle size lean — no unnecessary dependencies

## Deployment Notes
- Each app (`q4-refund-form/`, `q5-maintenance-logger/`) is its own Vercel project
- Set root directory in Vercel to `q4-refund-form` or `q5-maintenance-logger` respectively
- SQLite on Vercel: use `/tmp/db.sqlite` as the path (Vercel's writable temp dir)

## Definition of Done
- [ ] All required fields present and validated
- [ ] Form submits and data persists (survives page refresh)
- [ ] Mobile responsive (test at 375px width)
- [ ] Live Vercel URL works
- [ ] No console errors in production
