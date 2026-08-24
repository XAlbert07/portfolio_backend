import { forwardResponse, proxyAdminRequest } from "@/lib/admin-proxy";

export async function POST(request: Request) { return forwardResponse(await proxyAdminRequest("/api/uploads/project-cover", { method: "POST", headers: { "Content-Type": request.headers.get("Content-Type") ?? "" }, body: await request.arrayBuffer() })); }
