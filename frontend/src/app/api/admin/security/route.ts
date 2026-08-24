import { forwardResponse, proxyAdminRequest } from "@/lib/admin-proxy";

export async function PUT(request: Request) {
  return forwardResponse(await proxyAdminRequest("/api/auth/credentials", { method: "PUT", body: await request.text() }));
}

export async function GET() {
  return forwardResponse(await proxyAdminRequest("/api/auth/me"));
}
