import Image from "next/image";
import Link from "next/link";
import { ProjectRegister } from "@/components/portfolio/project-register";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { getProjects, getTechnologies, type Technology } from "@/lib/portfolio-data";
import { getProfile } from "@/lib/profile-data";

export default async function Home() {
  const projects = await getProjects();
  const technologies = await getTechnologies();
  const profile = await getProfile();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-albert-sama.vercel.app";
  const personSchema = { "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: profile.title, description: profile.bio, url: siteUrl, image: `${siteUrl}${profile.profileImage ?? "/images/albert-sama.png"}`, address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "BF" } : undefined, sameAs: [profile.githubUrl, profile.linkedinUrl].filter(Boolean) };
  const groups: Array<[string, string[]]> = [["Frontend", ["react", "next", "typescript", "tailwind", "vue", "angular"]], ["Backend", ["node", "express", "socket", "nestjs", "api"]], ["Données", ["postgres", "prisma", "mysql", "mongodb", "redis"]]];
  const technologyGroups = groups.map(([label, keywords]) => [label, technologies.filter((technology: Technology) => keywords.some((keyword) => `${technology.name} ${technology.slug}`.toLowerCase().includes(keyword))).map((technology) => technology.name)] as [string, string[]]);
  return <div className="site-shell"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    <section className="intro"><div className="intro-copy"><p className="eyebrow">{profile.title} · {profile.location ?? "Ouagadougou"}</p><h1>{profile.bio}</h1><p className="intro-text">{profile.availability ?? "Disponible pour de nouvelles opportunités"}</p><Link className="primary-link" href="#projets">Découvrir mon travail <span>↓</span></Link></div><figure className="portrait"><Image src={profile.profileImage ?? "/images/albert-sama.png"} alt={profile.name} width={512} height={512} priority sizes="(max-width: 720px) 86vw, 36vw" /></figure></section>
    <ProjectRegister projects={projects} />
    <section className="environment" aria-labelledby="environment-title"><p className="eyebrow">Mon environnement de travail</p><h2 id="environment-title">Frontend, backend et données.</h2><div className="environment-grid">{technologyGroups.map(([label, items]) => <div key={label}><span>{label}</span><p>{items.length ? items.join(" · ") : "Aucune technologie renseignée"}</p></div>)}</div></section>
    <section className="contact-band"><p className="eyebrow">Une idée, un besoin, une opportunité ?</p><h2>Parlons de votre prochain projet.</h2><Link className="primary-link" href="/contact">M’écrire <span>→</span></Link></section>
  </main><SiteFooter /></div>;
}
