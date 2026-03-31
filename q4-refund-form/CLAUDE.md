# Q4 — Guest Refund Request Form

## What to Build
A mobile-responsive web form for guests to submit refund requests.

## Requirements Checklist
- [ ] Fields: Full Name, Email, Booking Reference (text), Booking Date (date picker), Refund Reason (dropdown), Additional Details (textarea), File Upload (optional)
- [ ] Refund Reason options: "Property Issue", "Booking Error", "Personal Reasons", "Other"
- [ ] Conditional logic: if Booking Date > 90 days ago, show yellow warning banner
- [ ] On submit: validate all required fields
- [ ] Success state: show back the actual submitted data (not just "submitted!")
- [ ] Persist to SQLite at `/tmp/db.sqlite`
- [ ] Mobile responsive

## File Structure to Create
```
q4-refund-form/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               ← renders the form
│   ├── globals.css
│   └── api/
│       └── submit/
│           └── route.ts       ← POST handler, writes to SQLite
├── components/
│   ├── RefundForm.tsx         ← main form component
│   ├── WarningBanner.tsx      ← yellow 90-day warning
│   └── SuccessView.tsx        ← confirmation with data summary
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
CREATE TABLE IF NOT EXISTS refund_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  booking_reference TEXT NOT NULL,
  booking_date TEXT NOT NULL,
  refund_reason TEXT NOT NULL,
  additional_details TEXT,
  file_path TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## 90-Day Logic
```ts
const bookingDate = new Date(formData.booking_date);
const daysSince = (Date.now() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);
const showWarning = daysSince > 90;
```

## Sub-Agent Plan (run in parallel after schema is decided)
- **Agent 1**: Build `lib/db.ts` + `app/api/submit/route.ts`
- **Agent 2**: Build `components/RefundForm.tsx` + `components/WarningBanner.tsx`
- **Agent 3**: Build `components/SuccessView.tsx` + `app/page.tsx` + layout

Merge order: db → api → components → page
