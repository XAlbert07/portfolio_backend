import { SiteHeader } from "@/components/portfolio/site-header";
import { SiteFooter } from "@/components/portfolio/site-footer";
import type { Metadata } from "next";
import { getTechnologies, technologyCategoryLabels, type Technology } from "@/lib/portfolio-data";

export const metadata: Metadata = { title: "Compétences", description: "Les technologies et méthodes utilisées par Albert Sama pour construire des applications web maintenables.", alternates: { canonical: "/competences" } };

export default async function SkillsPage() { const technologies = await getTechnologies(); const groups = Object.entries(technologyCategoryLabels).map(([category, title]) => [title, technologies.filter((item) => item.category === category)] as [string, Technology[]]).filter(([, items]) => items.length); return <div className="site-shell"><SiteHeader /><main className="inner-page"><p className="eyebrow">Compétences</p><h1>Un environnement de travail cohérent.</h1><p className="page-lead">Les outils que j’utilise pour passer d’une idée à une application maintenable.</p><div className="skills-grid">{groups.length ? groups.map(([title, items]) => <section key={title}><p className="eyebrow">{title}</p><ul>{items.map((item) => <li key={item.id}><strong>{item.name}</strong>{item.description && <span className="skill-description">{item.description}</span>}</li>)}</ul></section>) : <p className="page-lead">Les technologies seront bientôt renseignées.</p>}</div></main><SiteFooter /></div>; }
