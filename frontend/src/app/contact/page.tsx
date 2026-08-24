import { SiteHeader } from "@/components/portfolio/site-header";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { ContactForm } from "@/components/portfolio/contact-form";

export default function ContactPage() { return <div className="site-shell"><SiteHeader /><main className="inner-page contact-page"><p className="eyebrow">Contact</p><h1>Parlons de votre projet.</h1><p className="page-lead">Décris-moi ton besoin, ton contexte ou l’opportunité dont tu veux discuter.</p><ContactForm /></main><SiteFooter /></div>; }
