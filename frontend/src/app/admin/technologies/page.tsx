import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TechnologyManager } from "@/components/admin/technology-manager";
import { AdminBackLink } from "@/components/admin/admin-back-link";

type Technology = { id: string; name: string; slug: string; description: string; icon?: string | null; category: string };
async function getTechnologies(): Promise<Technology[]> { const response = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/technologies`, { cache: "no-store" }); return response.ok ? response.json() : []; }
export default async function AdminTechnologiesPage() { if (!(await cookies()).get("portfolio_admin_token")?.value) redirect("/admin/login"); return <main className="inner-page admin-page"><AdminBackLink /><p className="eyebrow">Administration · Technologies</p><h1>Gérer la stack.</h1><p className="page-lead">Maintiens les technologies affichées sur le portfolio et associées aux projets.</p><TechnologyManager initialTechnologies={await getTechnologies()} /></main>; }
