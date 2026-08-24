import Link from "next/link";
import { SiteHeader } from "@/components/portfolio/site-header";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { getProjects } from "@/lib/portfolio-data";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <div className="site-shell"><SiteHeader /><main className="inner-page"><p className="eyebrow">Réalisations</p><h1>Les projets, sans détour.</h1><p className="page-lead">Une sélection d’applications web construites de l’interface aux données.</p><div className="project-list page-project-list">{projects.map((project, index) => <article className="project-row" key={project.id}><span className="project-number">{String(index + 1).padStart(2, "0")}</span><div className="project-main"><h2><Link href={`/projets/${project.slug}`}>{project.name}</Link></h2><p>{project.description}</p></div><div className="project-meta"><span>{project.status}</span><p>{project.technologies.map(({ technology }) => technology.name).join(" · ")}</p></div><Link className="project-link" href={`/projets/${project.slug}`}>Voir ↗</Link></article>)}</div></main><SiteFooter /></div>;
}
