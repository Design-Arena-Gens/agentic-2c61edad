import { NextRequest, NextResponse } from 'next/server';
import { addAttendanceRecord, getAttendanceRecords } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = await addAttendanceRecord(body);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add attendance record' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const records = await getAttendanceRecords();
    return NextResponse.json({ success: true, records });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}
