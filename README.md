# Vibe Coder Assessment

## What's in this repo

Two full-stack mini apps built as part of a take-home assessment. Both are live on Vercel with real persistent storage via Turso (hosted SQLite). Source code is split into two independent Next.js projects, each deployable on its own.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS (mobile-first)
- **Database:** Turso (libSQL / hosted SQLite) — data persists across deploys and serverless cold starts
- **Deployment:** Vercel
- **AI tooling:** Built with Claude Code

## Live Apps

| App | URL | Source |
|-----|-----|--------|
| Q4 — Guest Refund Form | https://property-tools-six.vercel.app | [q4-refund-form/](./q4-refund-form/) |
| Q5 — Maintenance Issue Logger | https://property-tools-l6gi.vercel.app | [q5-maintenance-logger/](./q5-maintenance-logger/) |

### Q4 — Guest Refund Request Form
A mobile-responsive form for guests to submit refund requests. Validates all fields, shows a warning banner when the booking is older than 90 days, and displays a full summary of the submitted data on success. Every submission is stored in Turso and survives page refreshes.

### Q5 — Maintenance Issue Logger
A two-view internal tool. The Submit tab generates a unique ticket number (MNT-0001 format) on every submission. The Dashboard tab shows all logged issues in a table with urgency color-coding (green/yellow/red), per-row status dropdowns that persist on refresh via a PATCH API, and filters by property and urgency.

---

## Part A — Written Answers

### Q1 — Architecture & Decision-Making

For something like this I'd go with Next.js (App Router) on the frontend/backend, Postgres (via Supabase or Neon) for storage, and S3-compatible storage (Supabase Storage or Cloudflare R2) for file uploads. The reason I'd pick Supabase specifically is that you get the database, auth, storage, and realtime all in one place — less glue code, and it's free to start.

**File uploads:** Files go directly from the browser to Supabase Storage using a presigned upload URL. The form never routes the actual file bytes through the Next.js server — that'd be slow and eat memory. Once uploaded, the public URL gets saved in the database row alongside the form data.

**Approval routing:** On form submit, the API checks the `amount` field. Under $5K → look up the submitter's department in the users table → find their department manager → insert a row into an `approvals` table with `approver_id` set to that manager. Over $5K → insert two approval rows, one for the finance director and one for the CEO. Each approver gets an email (Resend or Postmark) with a link to approve/reject. The link includes a signed token so they don't need to log in. Approval status updates the row; both approvers need to sign off for the over-$5K path.

**Search:** Since it's Postgres, full-text search on the submission fields is straightforward — just add a `tsvector` column with a GIN index covering the key fields. Finance gets a search input that runs a parameterised `to_tsquery` under the hood. Filter by date range, department, status, and amount range are just standard `WHERE` clauses.

A few things I'd add even if not asked: an audit log table that records every status change with a timestamp and who did it, and row-level security so employees can only see their own submissions while finance and managers see everything in their scope.

---

### Q2 — Debugging & Problem-Solving

Here's the order I'd go through it:

1. **Check the browser's Network tab first.** Open DevTools, submit the form, and look at the actual request. Is the API call even firing? What status code comes back? This immediately tells me whether the problem is on the client side or the server side. Most of the time the answer is right here.

2. **Check the server logs for the API endpoint.** If the call is going out and returning 200, but nothing hits the sheet, then the server received the request but something failed silently after that. I'd look for any uncaught exceptions or error responses from the Google Sheets API that aren't being surfaced to the user.

3. **Check Google Sheets API auth credentials.** This is the most common cause of "worked for months, suddenly broke" — OAuth tokens expire, service account keys get rotated, or someone revoked access. I'd go to the Google Cloud Console, check the service account, re-verify the credentials, and try a direct API call with the current token to confirm it's valid.

4. **Check API quota and rate limits.** Google Sheets API has a limit of 60 requests per minute per project. If usage grew over time and you're hitting that ceiling, requests start failing — and if the error isn't handled properly, it fails silently. I'd check the API quota dashboard in Google Cloud Console.

5. **Check if the spreadsheet itself changed.** Someone might have renamed the sheet tab, moved the file, changed sharing permissions, or deleted the target range. The API call would fail with a 404 or 403, but if that error isn't logged, you'd never know. I'd verify the sheet ID and tab name in the code match what's actually in Drive.

Going forward I'd add proper error logging (Sentry or just writing errors to a log table) and an alert if submissions drop to zero for more than an hour — silent failures are the worst kind.

---

### Q3 — Integration Thinking

I'd build this with a CRM webhook + a small orchestration layer rather than plugging Zapier directly in, just because Zapier gets expensive fast and gives you less control over failure handling.

**The trigger:** Most CRMs (HubSpot, Pipedrive, etc.) let you set up a webhook that fires when a deal's stage changes. I'd point that webhook at a simple API endpoint — a Next.js API route or a small Express function on Railway works fine.

**The orchestration:** When the webhook hits the endpoint, I do two things in parallel: post to the Slack/Teams channel via their API, and append a row to the Google Sheet via the Sheets API. I'd use `Promise.allSettled` so one failing doesn't kill the other.

**Handling failures:** If the messaging platform is down, I don't want to lose the notification. I'd write the job to a queue (Upstash QStash is great for this — it's cheap and handles retries with exponential backoff automatically). The API endpoint receives the webhook, validates it, and immediately enqueues two jobs. Each job retries independently with up to 5 attempts before alerting me.

**Preventing duplicates:** CRM webhooks can fire more than once for the same event — it's just reality. I'd use the deal ID as an idempotency key. Before inserting a row into the Google Sheet, I check whether a row with that deal ID already exists. For the Slack message, I store a record in a `processed_events` table with the deal ID and a timestamp; if I see the same deal ID come in within a 10-minute window, I skip it. Simple and reliable without needing a proper queue dedup system.

---

## Part B — Live Apps

| App | Live URL | Source |
|-----|----------|--------|
| Q4 — Guest Refund Form | https://property-tools-six.vercel.app | [q4-refund-form/](./q4-refund-form/) |
| Q5 — Maintenance Logger | https://property-tools-l6gi.vercel.app | [q5-maintenance-logger/](./q5-maintenance-logger/) |

See the top of this README for app descriptions and tech stack.
