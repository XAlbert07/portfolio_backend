import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="Accueil Albert Sama"><span>AS</span><span className="wordmark-name">Albert Sama</span></Link>
    <nav className="desktop-nav" aria-label="Navigation principale"><Link href="/projets">Projets</Link><Link href="/competences">Stack</Link><Link href="/parcours">Parcours</Link><Link className="header-contact" href="/contact">Contact</Link></nav>
    <Link className="mobile-menu" href="/contact">Contact</Link>
  </header>;
}
