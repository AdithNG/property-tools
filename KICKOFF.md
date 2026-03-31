# Kickoff Prompt — paste this into Claude Code to start

Read CLAUDE.md, q4-refund-form/CLAUDE.md, and q5-maintenance-logger/CLAUDE.md fully before doing anything.

Then do the following using parallel sub-agents where possible:

1. Scaffold q4-refund-form as a Next.js 14 + Tailwind + TypeScript project (run `npx create-next-app`)
2. Scaffold q5-maintenance-logger the same way

Once scaffolded, use 3 parallel sub-agents per app (as described in each app's CLAUDE.md) to build:
- Sub-agent 1: DB layer + API routes
- Sub-agent 2: Form components
- Sub-agent 3: Display/dashboard components

Wire everything together in page.tsx after all sub-agents complete.

After both apps are built and run locally without errors (`npm run build` passes), stop and let me know — I'll handle Vercel deployment.

Commit after every meaningful milestone. Do not co-author commits.
