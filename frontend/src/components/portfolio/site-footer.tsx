import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer"><p>© {new Date().getFullYear()} Albert Sama</p><div><Link href="/contact">Écrire un message</Link><a href="https://github.com/XAlbert07" target="_blank" rel="noreferrer">GitHub ↗</a></div></footer>;
}
