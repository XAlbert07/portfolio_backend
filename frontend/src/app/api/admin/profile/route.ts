import { forwardResponse, proxyAdminRequest } from "@/lib/admin-proxy";
export async function PUT(request: Request) { return forwardResponse(await proxyAdminRequest("/api/profile", { method: "PUT", body: await request.text() })); }
