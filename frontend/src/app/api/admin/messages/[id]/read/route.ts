import { forwardResponse, proxyAdminRequest } from "@/lib/admin-proxy";
export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; return forwardResponse(await proxyAdminRequest(`/api/messages/${id}/read`, { method: "PATCH" })); }
