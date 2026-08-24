import Link from "next/link";
import { getProfile } from "@/lib/profile-data";

export async function SiteFooter() { const profile = await getProfile(); return <footer className="site-footer"><p>© {new Date().getFullYear()} {profile.name}</p><div><Link href="/contact">Écrire un message</Link>{profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}{profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a>}</div></footer>; }
