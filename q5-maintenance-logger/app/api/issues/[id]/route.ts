import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureSchema } from '@/lib/db';

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
    await ensureSchema(db);

    const existing = await db.execute({ sql: 'SELECT id FROM issues WHERE id = ?', args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    await db.execute({ sql: 'UPDATE issues SET status = ? WHERE id = ?', args: [status, id] });

    const updated = await db.execute({ sql: 'SELECT * FROM issues WHERE id = ?', args: [id] });
    const row = updated.rows[0] as Record<string, unknown>;

    return NextResponse.json({
      success: true,
      data: {
        id: Number(row.id),
        ticket_number: String(row.ticket_number),
        property_name: String(row.property_name),
        category: String(row.category),
        urgency: String(row.urgency),
        description: String(row.description),
        photo_name: row.photo_name != null ? String(row.photo_name) : null,
        status: String(row.status),
        created_at: String(row.created_at),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
