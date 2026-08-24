import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/portfolio/site-header";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { getProjects } from "@/lib/portfolio-data";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  if (!project) notFound();
  return <div className="site-shell"><SiteHeader /><main className="inner-page project-detail"><Link className="back-link" href="/projets">← Retour aux projets</Link><p className="eyebrow">{project.category} · {project.status}</p><h1>{project.name}</h1><p className="page-lead">{project.description}</p><div className="detail-grid"><section><p className="eyebrow">Contexte</p><p>Ce projet fait partie des réalisations qui montrent ma manière de relier une interface claire à une architecture backend fiable.</p></section><section><p className="eyebrow">Technologies</p><p>{project.technologies.map(({ technology }) => technology.name).join(" · ")}</p></section></div><div className="detail-actions">{project.demoUrl && <a className="header-contact" href={project.demoUrl} target="_blank" rel="noreferrer">Voir la démo ↗</a>}{project.codeUrl && <a className="text-link" href={project.codeUrl} target="_blank" rel="noreferrer">Voir le code ↗</a>}</div></main><SiteFooter /></div>;
}
