import Image from "next/image";
import Link from "next/link";
import { ProjectRegister } from "@/components/portfolio/project-register";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { getProjects } from "@/lib/portfolio-data";

export default async function Home() {
  const projects = await getProjects();
  return <div className="site-shell"><SiteHeader /><main>
    <section className="intro"><div className="intro-copy"><p className="eyebrow">Développeur web full-stack · Ouagadougou</p><h1>Je construis des applications web qui ont une vraie utilité.</h1><p className="intro-text">De l’interface jusqu’aux données, je conçois des produits clairs, solides et maintenables.</p><Link className="primary-link" href="#projets">Découvrir mon travail <span>↓</span></Link></div><figure className="portrait"><Image src="/images/albert-sama.png" alt="Albert Sama" width={512} height={512} priority sizes="(max-width: 720px) 86vw, 36vw" /></figure></section>
    <ProjectRegister projects={projects} />
    <section className="environment" aria-labelledby="environment-title"><p className="eyebrow">Mon environnement de travail</p><h2 id="environment-title">Frontend, backend et données.</h2><div className="environment-grid"><div><span>Frontend</span><p>Next.js · React · TypeScript · Tailwind CSS</p></div><div><span>Backend</span><p>Node.js · Express · API REST · Socket.IO</p></div><div><span>Données</span><p>PostgreSQL · Prisma · Modélisation</p></div></div></section>
    <section className="contact-band"><p className="eyebrow">Une idée, un besoin, une opportunité ?</p><h2>Parlons de votre prochain projet.</h2><Link className="primary-link" href="/contact">M’écrire <span>→</span></Link></section>
  </main><SiteFooter /></div>;
}
