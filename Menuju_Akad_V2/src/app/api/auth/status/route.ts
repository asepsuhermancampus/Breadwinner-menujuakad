import { NextResponse } from "next/server";
import { isGoogleAuthReady } from "@/server/auth";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    enabled: isGoogleAuthReady(),
  });
}
