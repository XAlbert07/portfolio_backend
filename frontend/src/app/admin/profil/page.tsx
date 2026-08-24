import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { ProfileManager } from "@/components/admin/profile-manager";
import { fallbackProfile, type Profile } from "@/lib/profile-data";
async function getAdminProfile(): Promise<Profile> { const response = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/profile`, { cache: "no-store" }); return response.ok ? (await response.json() ?? fallbackProfile) : fallbackProfile; }
export default async function AdminProfilePage() { if (!(await cookies()).get("portfolio_admin_token")?.value) redirect("/admin/login"); return <main className="inner-page admin-page"><AdminBackLink /><p className="eyebrow">Administration · Profil</p><h1>Gérer ton profil.</h1><p className="page-lead">Ces informations alimentent la présentation publique du portfolio.</p><ProfileManager initialProfile={await getAdminProfile()} /></main>; }
