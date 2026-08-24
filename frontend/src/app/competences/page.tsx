import { SiteHeader } from "@/components/portfolio/site-header";
import { SiteFooter } from "@/components/portfolio/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Compétences", description: "Les technologies et méthodes utilisées par Albert Sama pour construire des applications web maintenables.", alternates: { canonical: "/competences" } };

type Technology = { id: string; name: string; description: string; category: string };
async function getTechnologies(): Promise<Technology[]> { try { const response = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/technologies`, { next: { revalidate: 60 } }); return response.ok ? response.json() : []; } catch { return []; } }
export default async function SkillsPage() { const technologies = await getTechnologies(); const groups = technologies.length ? Object.entries(Object.groupBy(technologies, (item) => item.category)) : [["Frontend", [{ id: "next", name: "Next.js", description: "", category: "Frontend" }, { id: "react", name: "React", description: "", category: "Frontend" }]] as [string, Technology[]]]; return <div className="site-shell"><SiteHeader /><main className="inner-page"><p className="eyebrow">Compétences</p><h1>Un environnement de travail cohérent.</h1><p className="page-lead">Les outils que j’utilise pour passer d’une idée à une application maintenable.</p><div className="skills-grid">{groups.map(([title, items]) => <section key={title}><p className="eyebrow">{title}</p><ul>{(items as Technology[]).map((item) => <li key={item.id}>{item.name}</li>)}</ul></section>)}</div></main><SiteFooter /></div>; }
