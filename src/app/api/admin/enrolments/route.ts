import { NextResponse } from "next/server";

function retired() {
  return NextResponse.json(
    { error: { code: "RETIRED_ENDPOINT", message: "This legacy endpoint is no longer available." } },
    { status: 410 },
  );
}

export const GET = retired;
export const POST = retired;
export const PATCH = retired;
export const DELETE = retired;
