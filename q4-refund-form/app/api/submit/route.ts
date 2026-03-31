import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const booking_reference = formData.get('booking_reference') as string;
    const booking_date = formData.get('booking_date') as string;
    const refund_reason = formData.get('refund_reason') as string;
    const additional_details = formData.get('additional_details') as string | null;
    const file = formData.get('file') as File | null;

    if (!full_name || !email || !booking_reference || !booking_date || !refund_reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const file_name = file && file.size > 0 ? file.name : null;

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO refund_requests (full_name, email, booking_reference, booking_date, refund_reason, additional_details, file_name)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(full_name, email, booking_reference, booking_date, refund_reason, additional_details || null, file_name);

    const inserted = db.prepare('SELECT * FROM refund_requests WHERE id = ?').get(result.lastInsertRowid) as {
      id: number;
      full_name: string;
      email: string;
      booking_reference: string;
      booking_date: string;
      refund_reason: string;
      additional_details: string | null;
      file_name: string | null;
      created_at: string;
    };

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
