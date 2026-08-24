import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AcademicPathManager } from "@/components/admin/academic-path-manager";

type AcademicPath = { id: string; title: string; description: string; startYear: number; endYear?: number | null; inProgress: boolean; subjects: string[]; order: number };
async function getPath(): Promise<AcademicPath[]> { const response = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/academic-path`, { cache: "no-store" }); return response.ok ? response.json() : []; }
export default async function AdminPathPage() { if (!(await cookies()).get("portfolio_admin_token")?.value) redirect("/admin/login"); return <main className="inner-page admin-page"><p className="eyebrow">Administration · Parcours</p><h1>Gérer le parcours.</h1><p className="page-lead">Organise les étapes de ton parcours académique et les matières étudiées.</p><AcademicPathManager initialPath={await getPath()} /></main>; }
