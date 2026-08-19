import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const OPEN_BEFORE_MS = 30 * 60 * 1000;
const CLOSE_AFTER_MS = 10 * 60 * 1000;

function sessionDateTimeMs(date: string, time: string) {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${normalizedTime}+01:00`).getTime();
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parent = await requireApiRole("parent");
  const { id } = await params;
  const supabase = createAdminClient() as any;

  const { data: session, error } = await supabase
    .from("class_sessions")
    .select(
      "id,session_date,start_time,end_time,meeting_link,status,lesson_assignments!inner(parent_id)",
    )
    .eq("id", id)
    .eq("lesson_assignments.parent_id", parent.id)
    .maybeSingle();

  if (error || !session) {
    return NextResponse.json(
      { error: { code: "SESSION_NOT_FOUND", message: "Session not found." } },
      { status: 404 },
    );
  }

  if (session.status !== "scheduled") {
    return NextResponse.json(
      {
        error: {
          code: "SESSION_UNAVAILABLE",
          message: "This session is not currently available to join.",
        },
      },
      { status: 409 },
    );
  }

  const now = Date.now();
  const start = sessionDateTimeMs(session.session_date, session.start_time);
  const end = sessionDateTimeMs(session.session_date, session.end_time);

  if (now < start - OPEN_BEFORE_MS || now > end + CLOSE_AFTER_MS) {
    return NextResponse.json(
      {
        error: {
          code: "SESSION_JOIN_WINDOW_CLOSED",
          message:
            "The meeting can only be joined from 30 minutes before the start time until 10 minutes after the session ends.",
        },
      },
      { status: 403 },
    );
  }

  return NextResponse.redirect(session.meeting_link, 302);
}
