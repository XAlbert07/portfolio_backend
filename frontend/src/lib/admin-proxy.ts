import { cookies } from "next/headers";

export async function proxyAdminRequest(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get("portfolio_admin_token")?.value;
  if (!token) return new Response(JSON.stringify({ message: "Authentification requise." }), { status: 401, headers: { "Content-Type": "application/json" } });
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  return fetch(`${backendUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
}

export async function forwardResponse(response: Response) {
  const body = await response.text();
  return new Response(body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } });
}
