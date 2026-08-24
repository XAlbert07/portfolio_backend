import { forwardResponse, proxyAdminRequest } from "@/lib/admin-proxy";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; return forwardResponse(await proxyAdminRequest(`/api/technologies/${id}`, { method: "PUT", body: await request.text() })); }
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; return forwardResponse(await proxyAdminRequest(`/api/technologies/${id}`, { method: "DELETE" })); }
