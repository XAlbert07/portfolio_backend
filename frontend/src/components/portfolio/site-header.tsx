"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="Accueil Albert Sama"><span>AS</span><span className="wordmark-name">Albert Sama</span></Link>
    <nav className="desktop-nav" aria-label="Navigation principale"><Link href="/projets">Projets</Link><Link href="/competences">Stack</Link><Link href="/parcours">Parcours</Link><Link className="header-contact" href="/contact">Contact</Link></nav>
    <button className="mobile-menu" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>{open ? "Fermer" : "Menu"}</button>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Navigation mobile"><Link href="/projets" onClick={() => setOpen(false)}>Projets</Link><Link href="/competences" onClick={() => setOpen(false)}>Stack</Link><Link href="/parcours" onClick={() => setOpen(false)}>Parcours</Link><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></nav>}
  </header>;
}
