import { NextRequest, NextResponse } from "next/server";
import { renderClonedTemplate } from "@/features/customer-workspace/domain/template-renderer";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
  const themeId = parseInt(id, 10);
  if (isNaN(themeId) || themeId < 1 || themeId > 167) {
    return new NextResponse("Tema tidak ditemukan", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const groom = searchParams.get("groom") ?? undefined;
  const bride = searchParams.get("bride") ?? undefined;
  const date = searchParams.get("date") ?? undefined;
  const venue = searchParams.get("venue") ?? undefined;
  const title = searchParams.get("title") ?? undefined;

  const html = renderClonedTemplate(themeId, {
    groom,
    bride,
    date,
    venue,
    title,
  });

  if (!html) {
    return new NextResponse("File template belum tersedia", { status: 404 });
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

