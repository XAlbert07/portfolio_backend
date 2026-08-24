import { forwardResponse, proxyAdminRequest } from "@/lib/admin-proxy";

export async function POST(request: Request) { return forwardResponse(await proxyAdminRequest("/api/technologies", { method: "POST", body: await request.text() })); }
