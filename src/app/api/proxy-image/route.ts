import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("No URL provided", { status: 400 });
  }

  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new NextResponse(blob, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
    },
  });
}
