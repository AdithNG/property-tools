import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureSchema } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Issue {
  id: number;
  ticket_number: string;
  property_name: string;
  category: string;
  urgency: string;
  description: string;
  photo_name: string | null;
  status: string;
  created_at: string;
}

function rowToIssue(row: Record<string, unknown>): Issue {
  return {
    id: Number(row.id),
    ticket_number: String(row.ticket_number),
    property_name: String(row.property_name),
    category: String(row.category),
    urgency: String(row.urgency),
    description: String(row.description),
    photo_name: row.photo_name != null ? String(row.photo_name) : null,
    status: String(row.status),
    created_at: String(row.created_at),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const property = searchParams.get('property');
    const urgency = searchParams.get('urgency');

    const conditions: string[] = [];
    const args: string[] = [];

    if (property) { conditions.push('property_name = ?'); args.push(property); }
    if (urgency) { conditions.push('urgency = ?'); args.push(urgency); }

    const where = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT * FROM issues${where} ORDER BY created_at DESC`;

    const db = getDb();
    await ensureSchema(db);
    const result = await db.execute({ sql, args });
    const issues = result.rows.map(r => rowToIssue(r as Record<string, unknown>));

    return NextResponse.json({ issues });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const property_name = formData.get('property_name') as string;
    const category = formData.get('category') as string;
    const urgency = formData.get('urgency') as string;
    const description = formData.get('description') as string;
    const photo = formData.get('photo') as File | null;

    if (!property_name || !category || !urgency || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const VALID_PROPERTIES = ['Sunset Villa', 'Ocean Breeze Apt', 'Mountain Lodge', 'City Center Suite', 'Harbor View Condo'];
    const VALID_CATEGORIES = ['Plumbing', 'Electrical', 'AC/HVAC', 'Furniture', 'Cleaning', 'Other'];
    const VALID_URGENCIES = ['Low', 'Medium', 'High'];

    if (!VALID_PROPERTIES.includes(property_name)) return NextResponse.json({ error: 'Invalid property' }, { status: 400 });
    if (!VALID_CATEGORIES.includes(category)) return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    if (!VALID_URGENCIES.includes(urgency)) return NextResponse.json({ error: 'Invalid urgency' }, { status: 400 });

    const db = getDb();
    await ensureSchema(db);

    const countResult = await db.execute('SELECT COUNT(*) as cnt FROM issues');
    const cnt = Number(countResult.rows[0].cnt);
    const ticket_number = `MNT-${String(cnt + 1).padStart(4, '0')}`;

    const photo_name = photo && photo.size > 0 ? photo.name : null;

    const insertResult = await db.execute({
      sql: `INSERT INTO issues (ticket_number, property_name, category, urgency, description, photo_name)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [ticket_number, property_name, category, urgency, description, photo_name],
    });

    const selectResult = await db.execute({
      sql: 'SELECT * FROM issues WHERE id = ?',
      args: [Number(insertResult.lastInsertRowid)],
    });

    return NextResponse.json({ success: true, data: rowToIssue(selectResult.rows[0] as Record<string, unknown>) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
