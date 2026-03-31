import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const property = searchParams.get('property');
    const urgency = searchParams.get('urgency');

    let query = 'SELECT * FROM issues';
    const params: string[] = [];
    const conditions: string[] = [];

    if (property) {
      conditions.push('property_name = ?');
      params.push(property);
    }
    if (urgency) {
      conditions.push('urgency = ?');
      params.push(urgency);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    const db = getDb();
    const issues = db.prepare(query).all(...params) as Issue[];
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
    const count = db.prepare('SELECT COUNT(*) as cnt FROM issues').get() as { cnt: number };
    const ticket_number = `MNT-${String(count.cnt + 1).padStart(4, '0')}`;

    const photo_name = photo && photo.size > 0 ? photo.name : null;

    const stmt = db.prepare(`
      INSERT INTO issues (ticket_number, property_name, category, urgency, description, photo_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(ticket_number, property_name, category, urgency, description, photo_name);

    const inserted = db.prepare('SELECT * FROM issues WHERE id = ?').get(result.lastInsertRowid) as Issue;

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
