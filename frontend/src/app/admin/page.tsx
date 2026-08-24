import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/portfolio/site-header";
import { LogoutButton } from "@/components/admin/logout-button";

async function getAdminData() {
  const token = (await cookies()).get("portfolio_admin_token")?.value;
  if (!token) redirect("/admin/login");
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  const headers = { Authorization: `Bearer ${token}` };
  const [projects, messages] = await Promise.all([
    fetch(`${backendUrl}/api/projects`, { headers, cache: "no-store" }),
    fetch(`${backendUrl}/api/messages`, { headers, cache: "no-store" }),
  ]);
  const projectData = projects.ok ? await projects.json() : [];
  const messageData = messages.ok ? await messages.json() : [];
  return { projectCount: projectData.length, unreadCount: messageData.filter((item: { read: boolean }) => !item.read).length };
}

export default async function AdminPage() {
  const data = await getAdminData();
  return <div className="site-shell"><SiteHeader /><main className="inner-page admin-page"><div className="admin-page-heading"><div><p className="eyebrow">Administration</p><h1>Vue d’ensemble.</h1></div><LogoutButton /></div><p className="page-lead">Gère les contenus qui alimentent ton portfolio public.</p><div className="admin-links"><Link href="/admin/projets"><strong>{data.projectCount}</strong><span>Projets</span></Link><Link href="/admin/messages"><strong>{data.unreadCount}</strong><span>Messages non lus</span></Link><Link href="/admin/technologies"><strong>→</strong><span>Technologies</span></Link><Link href="/admin/parcours"><strong>→</strong><span>Parcours</span></Link><Link href="/admin/profil"><strong>→</strong><span>Profil</span></Link><Link href="/admin/securite"><strong>→</strong><span>Sécurité</span></Link></div></main></div>;
}
