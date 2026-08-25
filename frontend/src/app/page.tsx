import Image from "next/image";
import Link from "next/link";
import { ProjectRegister } from "@/components/portfolio/project-register";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { getProjects, getTechnologies, technologyCategoryLabels } from "@/lib/portfolio-data";
import { getProfile } from "@/lib/profile-data";

export default async function Home() {
  const projects = await getProjects();
  const technologies = await getTechnologies();
  const profile = await getProfile();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-albert-sama.vercel.app";
  const personSchema = { "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: profile.title, description: profile.bio, url: siteUrl, image: `${siteUrl}${profile.profileImage ?? "/images/albert-sama.png"}`, address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "BF" } : undefined, sameAs: [profile.githubUrl, profile.linkedinUrl].filter(Boolean) };
  const featuredTechnologies = technologies.filter((technology) => technology.featured).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 9);
  const technologyGroups = Object.entries(technologyCategoryLabels).map(([category, label]) => [label, featuredTechnologies.filter((technology) => technology.category === category).map((technology) => technology.name)] as [string, string[]]).filter(([, items]) => items.length);
  return <div className="site-shell"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    <section className="intro"><div className="intro-copy"><p className="eyebrow">{profile.title} · {profile.location ?? "Ouagadougou"}</p><h1>{profile.bio}</h1><p className="intro-text">{profile.availability ?? "Disponible pour de nouvelles opportunités"}</p><Link className="primary-link" href="#projets">Découvrir mon travail <span>↓</span></Link></div><figure className="portrait"><Image src={profile.profileImage ?? "/images/albert-sama.png"} alt={profile.name} width={512} height={512} priority sizes="(max-width: 720px) 86vw, 36vw" /></figure></section>
    <ProjectRegister projects={projects} />
    <section className="environment" aria-labelledby="environment-title"><p className="eyebrow">Mon environnement de travail</p><h2 id="environment-title">Les technologies que j’utilise.</h2><div className="environment-grid">{technologyGroups.length ? technologyGroups.map(([label, items]) => <div key={label}><span>{label}</span><p>{items.join(" · ")}</p></div>) : <div><p>Aucune technologie renseignée.</p></div>}</div></section>
    <section className="contact-band"><p className="eyebrow">Une idée, un besoin, une opportunité ?</p><h2>Parlons de votre prochain projet.</h2><Link className="primary-link" href="/contact">M’écrire <span>→</span></Link></section>
  </main><SiteFooter /></div>;
}
