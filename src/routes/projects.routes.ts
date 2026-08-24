import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";
import { removeStoredProjectImage } from "../lib/storage";

const router = Router();

// GET /api/projects
// Renvoie la liste de tous les projets, avec leurs technologies associées.
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: {
        // "include" dit à Prisma : va chercher aussi les technologies
        // liées via la table de jointure ProjectTechnology, et les
        // remonter directement dans le résultat.
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des projets." });
  }
});

// GET /api/projects/:slug
// Renvoie un seul projet à partir de son slug (ex: "gestion-de-stock").
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du projet." });
  }
});

// POST /api/projects
// Crée un nouveau projet. Route protégée : requireAuth s'exécute d'abord,
// et bloque la requête si le token JWT est absent ou invalide.
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      status,
      coverImage,
      demoUrl,
      codeUrl,
      featured,
      order,
      technologyIds, // tableau d'ids de technologies à lier, ex: ["id1", "id2"]
    } = req.body;

    // Validation simple des champs obligatoires (ceux marqués * sur le formulaire)
    if (!name || !slug || !description || !category) {
      return res.status(400).json({
        message: "Les champs nom, slug, description et catégorie sont obligatoires.",
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        category,
        status: status || "EN_COURS",
        coverImage,
        demoUrl,
        codeUrl,
        featured: featured ?? false,
        order: order ?? 0,
        // Si des technologies sont fournies, on crée directement les
        // lignes de la table de jointure ProjectTechnology en même temps
        // que le projet, en une seule opération.
        technologies: technologyIds
          ? {
              create: technologyIds.map((technologyId: string) => ({
                technologyId,
              })),
            }
          : undefined,
      },
      include: {
        technologies: { include: { technology: true } },
      },
    });

    res.status(201).json(project);
  } catch (error: any) {
    console.error(error);
    // Erreur Prisma spécifique : le slug existe déjà (contrainte @unique)
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ce slug est déjà utilisé par un autre projet." });
    }
    res.status(500).json({ message: "Erreur lors de la création du projet." });
  }
});

// PUT /api/projects/:id
// Modifie un projet existant. Route protégée.
router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      category,
      status,
      coverImage,
      demoUrl,
      codeUrl,
      featured,
      order,
      technologyIds,
    } = req.body;

    const existingProject = await prisma.project.findUnique({ where: { id }, select: { coverImage: true } });
    // Si technologyIds est fourni, on remplace entièrement les liaisons
    // existantes : on supprime les anciennes, on recrée les nouvelles.
    // C'est plus simple et plus sûr que d'essayer de calculer un "diff".
    if (technologyIds) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: id } });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        category,
        status,
        coverImage,
        demoUrl,
        codeUrl,
        featured,
        order,
        technologies: technologyIds
          ? {
              create: technologyIds.map((technologyId: string) => ({
                technologyId,
              })),
            }
          : undefined,
      },
      include: {
        technologies: { include: { technology: true } },
      },
    });

    if (existingProject?.coverImage && coverImage && existingProject.coverImage !== coverImage) {
      await removeStoredProjectImage(existingProject.coverImage);
    }

    res.json(project);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Projet introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la modification du projet." });
  }
});

// DELETE /api/projects/:id
// Supprime un projet. Route protégée.
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id }, select: { coverImage: true } });
    await prisma.project.delete({ where: { id } });
    await removeStoredProjectImage(project?.coverImage);

    res.status(204).send(); // 204 = succès, pas de contenu à renvoyer
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Projet introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la suppression du projet." });
  }
});

export default router;
