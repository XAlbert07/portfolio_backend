import { PrismaClient, ProjectCategory, ProjectStatus, TechnologyCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage des tables existantes...");
  // On vide dans l'ordre inverse des dépendances pour éviter les erreurs
  // de clé étrangère (ProjectTechnology dépend de Project et Technology).
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.academicPath.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  // ---------- UTILISATEUR ADMIN ----------
  console.log("Création de l'utilisateur admin...");
  const hashedPassword = await bcrypt.hash("changeMoi123", 10);
  await prisma.user.create({
    data: {
      email: "sama.albert07@gmail.com",
      password: hashedPassword,
      name: "Albert Sama",
    },
  });

  // ---------- TECHNOLOGIES ----------
  // Reprises telles que vues dans les badges sur les cartes de projets
  // et dans la page Compétences.
  console.log("Création des technologies...");
  const technologies = await Promise.all([
    prisma.technology.create({
      data: {
        name: "React",
        slug: "react",
        description: "Bibliothèque JS pour construire des interfaces utilisateur réactives et modulaires.",
        icon: "react",
        category: TechnologyCategory.DEVELOPPEMENT,
      },
    }),
    prisma.technology.create({
      data: {
        name: "Next.js",
        slug: "nextjs",
        description: "Framework React pour des applications web performantes avec rendu côté serveur.",
        icon: "nextdotjs",
        category: TechnologyCategory.DEVELOPPEMENT,
      },
    }),
    prisma.technology.create({
      data: {
        name: "TypeScript",
        slug: "typescript",
        description: "Langage typé qui améliore la qualité du code, la maintenabilité et la collaboration.",
        icon: "typescript",
        category: TechnologyCategory.DEVELOPPEMENT,
      },
    }),
    prisma.technology.create({
      data: {
        name: "Node.js",
        slug: "nodejs",
        description: "Environnement d'exécution JavaScript côté serveur, rapide et scalable.",
        icon: "nodedotjs",
        category: TechnologyCategory.DEVELOPPEMENT,
      },
    }),
    prisma.technology.create({
      data: {
        name: "Express.js",
        slug: "expressjs",
        description: "Framework minimal et flexible pour créer des APIs et des applications backend.",
        icon: "express",
        category: TechnologyCategory.DEVELOPPEMENT,
      },
    }),
    prisma.technology.create({
      data: {
        name: "PostgreSQL",
        slug: "postgresql",
        description: "Système de gestion de base de données avancé et fiable.",
        icon: "postgresql",
        category: TechnologyCategory.BASE_DE_DONNEES,
      },
    }),
    prisma.technology.create({
      data: {
        name: "Prisma",
        slug: "prisma",
        description: "ORM moderne pour interagir avec la base de données de façon typée.",
        icon: "prisma",
        category: TechnologyCategory.BASE_DE_DONNEES,
      },
    }),
    prisma.technology.create({
      data: {
        name: "Tailwind CSS",
        slug: "tailwind-css",
        description: "Framework CSS utility-first pour créer des interfaces modernes et responsive.",
        icon: "tailwindcss",
        category: TechnologyCategory.DEVELOPPEMENT,
      },
    }),
    prisma.technology.create({
      data: {
        name: "Stripe",
        slug: "stripe",
        description: "Solution de paiement en ligne pour les applications e-commerce.",
        icon: "stripe",
        category: TechnologyCategory.OUTILS_DEVOPS,
      },
    }),
    prisma.technology.create({
      data: {
        name: "Socket.IO",
        slug: "socket-io",
        description: "Bibliothèque pour la communication en temps réel entre client et serveur.",
        icon: "socketdotio",
        category: TechnologyCategory.DEVELOPPEMENT,
      },
    }),
  ]);

  // Petit helper pour retrouver l'id d'une techno par son nom
  const techId = (name: string) => technologies.find((t) => t.name === name)!.id;

  // ---------- PROJETS ----------
  // Données reprises telles qu'affichées sur les cartes de la page Projets.
  console.log("Création des projets...");

  const gestionStock = await prisma.project.create({
    data: {
      name: "Gestion de Stock",
      slug: "gestion-de-stock",
      description: "Application de gestion de stock avec suivi des entrées, sorties et rapports en temps réel.",
      category: ProjectCategory.FULLSTACK,
      status: ProjectStatus.TERMINE,
      featured: true,
      order: 1,
      codeUrl: "https://github.com/XAlbert07/gestion-de-stock",
      demoUrl: "https://gestion-de-stock-demo.vercel.app",
    },
  });

  const plateformeEmploi = await prisma.project.create({
    data: {
      name: "Plateforme d'Emploi",
      slug: "plateforme-emploi",
      description: "Plateforme de mise en relation entre candidats et recruteurs avec système de candidature.",
      category: ProjectCategory.FULLSTACK,
      status: ProjectStatus.TERMINE,
      featured: true,
      order: 2,
      codeUrl: "https://github.com/XAlbert07/plateforme-emploi",
      demoUrl: "https://plateforme-emploi-demo.vercel.app",
    },
  });

  const ecommerce = await prisma.project.create({
    data: {
      name: "E-commerce",
      slug: "e-commerce",
      description: "Boutique en ligne avec panier, paiement sécurisé et gestion des commandes.",
      category: ProjectCategory.FULLSTACK,
      status: ProjectStatus.TERMINE,
      featured: true,
      order: 3,
      codeUrl: "https://github.com/XAlbert07/e-commerce",
      demoUrl: "https://e-commerce-demo.vercel.app",
    },
  });

  const chatTempsReel = await prisma.project.create({
    data: {
      name: "Chat en temps réel",
      slug: "chat-temps-reel",
      description: "Application de chat temps réel avec authentification et salons de discussion.",
      category: ProjectCategory.FULLSTACK,
      status: ProjectStatus.TERMINE,
      featured: true,
      order: 4,
      codeUrl: "https://github.com/XAlbert07/chat-temps-reel",
      demoUrl: "https://chat-temps-reel-demo.vercel.app",
    },
  });

  // ---------- LIAISON PROJET <-> TECHNOLOGIE ----------
  // C'est ici qu'on remplit la table de jointure ProjectTechnology,
  // exactement comme vu dans les badges de chaque carte.
  console.log("Association des technologies aux projets...");

  await prisma.projectTechnology.createMany({
    data: [
      // Gestion de Stock : Next.js, TypeScript, PostgreSQL, Prisma
      { projectId: gestionStock.id, technologyId: techId("Next.js") },
      { projectId: gestionStock.id, technologyId: techId("TypeScript") },
      { projectId: gestionStock.id, technologyId: techId("PostgreSQL") },
      { projectId: gestionStock.id, technologyId: techId("Prisma") },

      // Plateforme d'Emploi : Next.js, Tailwind CSS, Node.js, PostgreSQL
      { projectId: plateformeEmploi.id, technologyId: techId("Next.js") },
      { projectId: plateformeEmploi.id, technologyId: techId("Tailwind CSS") },
      { projectId: plateformeEmploi.id, technologyId: techId("Node.js") },
      { projectId: plateformeEmploi.id, technologyId: techId("PostgreSQL") },

      // E-commerce : Next.js, Stripe, Prisma
      { projectId: ecommerce.id, technologyId: techId("Next.js") },
      { projectId: ecommerce.id, technologyId: techId("Stripe") },
      { projectId: ecommerce.id, technologyId: techId("Prisma") },

      // Chat en temps réel : Next.js, Socket.IO, Tailwind CSS
      { projectId: chatTempsReel.id, technologyId: techId("Next.js") },
      { projectId: chatTempsReel.id, technologyId: techId("Socket.IO") },
      { projectId: chatTempsReel.id, technologyId: techId("Tailwind CSS") },
    ],
  });

  // ---------- PARCOURS ACADÉMIQUE ----------
  // Repris tel qu'affiché dans la timeline de la page Parcours académique.
  console.log("Création du parcours académique...");

  await prisma.academicPath.createMany({
    data: [
      {
        title: "Licence 1 – Informatique",
        description: "Bases de l'informatique et technologies de l'information.",
        startYear: 2020,
        endYear: 2021,
        inProgress: false,
        subjects: ["Algorithmique", "Programmation (C)", "Mathématiques"],
        order: 1,
      },
      {
        title: "Licence 2 – Informatique",
        description: "Structures de données, bases de données, réseaux et systèmes d'exploitation.",
        startYear: 2021,
        endYear: 2022,
        inProgress: false,
        subjects: ["Structures de données", "Base de données", "Réseaux"],
        order: 2,
      },
      {
        title: "Licence 3 – Informatique",
        description: "Génie logiciel, développement web, conception de systèmes et paradigmes de programmation.",
        startYear: 2022,
        endYear: 2023,
        inProgress: false,
        subjects: ["Génie logiciel", "Développement Web", "POO"],
        order: 3,
      },
      {
        title: "Spécialisation – Développement Web",
        description: "Développement d'applications web modernes, APIs, bases de données avancées et cloud.",
        startYear: 2023,
        endYear: 2024,
        inProgress: false,
        subjects: ["Web Avancé", "APIs & Backend", "Cloud Computing"],
        order: 4,
      },
    ],
  });

  console.log("Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });