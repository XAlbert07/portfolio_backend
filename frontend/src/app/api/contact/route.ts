import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.name || !payload?.email || !payload?.content) {
    return NextResponse.json({ message: "Nom, email et message sont obligatoires." }, { status: 400 });
  }

  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  try {
    const response = await fetch(`${backendUrl}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Le service de contact est temporairement indisponible." }, { status: 503 });
  }
}
