# Q5 — Maintenance Issue Logger with Status Tracker

## What to Build
A two-view internal tool: submit maintenance issues + a dashboard to track/update them.

## Requirements Checklist
### View 1 — Submit Issue
- [ ] Property Name dropdown (5 sample properties)
- [ ] Issue Category dropdown: "Plumbing", "Electrical", "AC/HVAC", "Furniture", "Cleaning", "Other"
- [ ] Urgency radio: "Low", "Medium", "High"
- [ ] Description textarea
- [ ] Photo Upload (optional)
- [ ] On submit: generate unique ticket number (MNT-0001 format) and show it

### View 2 — Dashboard
- [ ] Table with: Ticket #, Property, Category, Urgency (color-coded), Date Submitted, Status
- [ ] Urgency colors: Low = green, Medium = yellow, High = red
- [ ] Status dropdown per row: "Open", "In Progress", "Resolved" — persists on refresh
- [ ] Filter by Property OR Urgency

## Sample Properties (hardcode these)
```
Sunset Villa, Ocean Breeze Apt, Mountain Lodge, City Center Suite, Harbor View Condo
```

## File Structure to Create
```
q5-maintenance-logger/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               ← tab switcher (Submit / Dashboard)
│   ├── globals.css
│   └── api/
│       ├── issues/
│       │   └── route.ts       ← GET all issues, POST new issue
│       └── issues/[id]/
│           └── route.ts       ← PATCH to update status
├── components/
│   ├── SubmitForm.tsx         ← View 1
│   ├── Dashboard.tsx          ← View 2
│   ├── IssueRow.tsx           ← single row with status dropdown
│   └── FilterBar.tsx          ← property + urgency filters
├── lib/
│   └── db.ts                  ← SQLite connection + schema init
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .gitignore
```

## DB Schema
```sql
CREATE TABLE IF NOT EXISTS issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_number TEXT NOT NULL UNIQUE,
  property_name TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_path TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TEXT DEFAULT (datetime('now'))
);
```

## Ticket Number Generation
```ts
// Get count of existing tickets, pad to 4 digits
const count = db.prepare('SELECT COUNT(*) as cnt FROM issues').get() as { cnt: number };
const ticketNumber = `MNT-${String(count.cnt + 1).padStart(4, '0')}`;
```

## Urgency Color Mapping
```ts
const urgencyColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};
```

## Sub-Agent Plan (run in parallel after schema is decided)
- **Agent 1**: Build `lib/db.ts` + `app/api/issues/route.ts` + `app/api/issues/[id]/route.ts`
- **Agent 2**: Build `components/SubmitForm.tsx`
- **Agent 3**: Build `components/Dashboard.tsx` + `components/IssueRow.tsx` + `components/FilterBar.tsx`

Merge order: db → api → components → page (page ties it together last)
