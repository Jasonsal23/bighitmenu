import { NextRequest, NextResponse } from "next/server";
import { getServicesForScreen } from "@/lib/services";

export async function GET(request: NextRequest) {
  const screenParam = request.nextUrl.searchParams.get("screen");
  const screen = screenParam === "2" ? 2 : 1;

  const data = await getServicesForScreen(screen);

  return NextResponse.json(
    { services: data },
    { headers: { "Cache-Control": "no-store" } }
  );
}
