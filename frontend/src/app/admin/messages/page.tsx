import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MessageManager } from "@/components/admin/message-manager";

export default async function AdminMessagesPage() { const token = (await cookies()).get("portfolio_admin_token")?.value; if (!token) redirect("/admin/login"); const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000"; const response = await fetch(`${backendUrl}/api/messages`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }); const messages = response.ok ? await response.json() : []; return <main className="inner-page admin-page"><p className="eyebrow">Administration · Messages</p><h1>Boîte de réception.</h1><p className="page-lead">Réponds aux personnes qui ont pris le temps d’écrire.</p><MessageManager initialMessages={messages} /></main>; }
