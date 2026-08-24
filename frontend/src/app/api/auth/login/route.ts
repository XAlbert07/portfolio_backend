import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const isFormSubmit = request.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ?? false;
  const payload = isFormSubmit
    ? Object.fromEntries((await request.formData()).entries())
    : await request.json().catch(() => null);
  if (!payload?.email || !payload?.password) return NextResponse.json({ message: "Email et mot de passe requis." }, { status: 400 });
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  try {
    const response = await fetch(`${backendUrl}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    const result = isFormSubmit ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.json({ user: data.user });
    if (isFormSubmit) result.headers.set("Location", "/admin");
    result.cookies.set("portfolio_admin_token", data.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return result;
  } catch { return NextResponse.json({ message: "Backend indisponible." }, { status: 503 }); }
}
