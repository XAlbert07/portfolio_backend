import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProjectManager } from "@/components/admin/project-manager";
import { getProjects } from "@/lib/portfolio-data";

export default async function AdminProjectsPage() {
  if (!(await cookies()).get("portfolio_admin_token")?.value) redirect("/admin/login");
  return <main className="inner-page admin-page"><p className="eyebrow">Administration · Projets</p><h1>Gérer les projets.</h1><p className="page-lead">Ajoute et maintiens les réalisations visibles sur le portfolio.</p><ProjectManager initialProjects={await getProjects()} /></main>;
}
