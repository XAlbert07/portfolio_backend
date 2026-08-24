import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { CredentialsManager } from "@/components/admin/credentials-manager";

async function getCurrentUser(): Promise<string> {
  const token = (await cookies()).get("portfolio_admin_token")?.value;
  if (!token) redirect("/admin/login");
  const response = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) redirect("/admin/login");
  const data = await response.json();
  return data.user.email;
}

export default async function SecurityPage() {
  const email = await getCurrentUser();
  return <main className="inner-page admin-page"><AdminBackLink /><p className="eyebrow">Administration · Sécurité</p><h1>Modifier tes identifiants.</h1><p className="page-lead">Change l’adresse email et le mot de passe utilisés pour accéder à l’administration.</p><CredentialsManager email={email} /></main>;
}
