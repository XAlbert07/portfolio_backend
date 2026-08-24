import { SiteHeader } from "@/components/portfolio/site-header";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { ContactForm } from "@/components/portfolio/contact-form";
import { getProfile } from "@/lib/profile-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact", description: "Contactez Albert Sama pour parler d’un projet web, d’une mission ou d’une opportunité.", alternates: { canonical: "/contact" } };

export default async function ContactPage() { const profile = await getProfile(); return <div className="site-shell"><SiteHeader /><main className="inner-page contact-page"><p className="eyebrow">Contact</p><h1>Parlons de votre projet.</h1><p className="page-lead">Décris-moi ton besoin, ton contexte ou l’opportunité dont tu veux discuter.</p><div className="contact-details"><div><span>Disponibilité</span><strong>{profile.availability ?? "Ouvert aux échanges"}</strong></div>{profile.location && <div><span>Localisation</span><strong>{profile.location}</strong></div>}{profile.email && <div><span>Email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></div>}</div><ContactForm /></main><SiteFooter /></div>; }
