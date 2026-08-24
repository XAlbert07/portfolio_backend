export type Technology = {
  id: string;
  name: string;
  slug: string;
  category: string;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  coverImage?: string | null;
  demoUrl?: string | null;
  codeUrl?: string | null;
  featured?: boolean;
  order?: number;
  technologies: Array<{ technology: Technology }>;
};

const technology = (name: string): { technology: Technology } => ({
  technology: { id: name, name, slug: name.toLowerCase().replaceAll(".", "-"), category: "DEVELOPPEMENT" },
});

const fallbackProjects: Project[] = [
  { id: "stock", name: "Gestion de stock", slug: "gestion-de-stock", description: "Application de suivi des entrées, sorties et rapports de stock en temps réel.", category: "FULLSTACK", status: "TERMINE", featured: true, order: 1, codeUrl: "https://github.com/XAlbert07/gestion-de-stock", technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"].map(technology) },
  { id: "jobs", name: "Plateforme d’emploi", slug: "plateforme-emploi", description: "Plateforme de mise en relation entre candidats, recruteurs et opportunités.", category: "FULLSTACK", status: "TERMINE", featured: true, order: 2, codeUrl: "https://github.com/XAlbert07/plateforme-emploi", technologies: ["Next.js", "Node.js", "PostgreSQL"].map(technology) },
  { id: "shop", name: "E-commerce", slug: "e-commerce", description: "Boutique en ligne avec panier, paiement sécurisé et gestion des commandes.", category: "FULLSTACK", status: "TERMINE", featured: true, order: 3, codeUrl: "https://github.com/XAlbert07/e-commerce", technologies: ["Next.js", "Stripe", "Prisma"].map(technology) },
];

export async function getProjects(): Promise<Project[]> {
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  try {
    const response = await fetch(`${backendUrl}/api/projects`, { next: { revalidate: 60 } });
    return response.ok ? await response.json() as Project[] : fallbackProjects;
  } catch { return fallbackProjects; }
}
