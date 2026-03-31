import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['Open', 'In Progress', 'Resolved'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json() as { status?: string };
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM issues WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    db.prepare('UPDATE issues SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
