import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/technologies
// Renvoie toutes les technologies, avec les projets qui les utilisent
// (utile pour la page Compétences : "Utilisé dans → Projet A, Projet B").
router.get("/", async (req, res) => {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" },
      include: {
        projects: {
          include: {
            project: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    res.json(technologies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des technologies." });
  }
});

// GET /api/technologies/:slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const technology = await prisma.technology.findUnique({
      where: { slug },
      include: {
        projects: {
          include: {
            project: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    if (!technology) {
      return res.status(404).json({ message: "Technologie introuvable." });
    }

    res.json(technology);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de la technologie." });
  }
});

// POST /api/technologies
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, slug, description, icon, category } = req.body;

    if (!name || !slug || !description || !category) {
      return res.status(400).json({
        message: "Les champs nom, slug, description et catégorie sont obligatoires.",
      });
    }

    const technology = await prisma.technology.create({
      data: { name, slug, description, icon, category },
    });

    res.status(201).json(technology);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ce nom ou slug est déjà utilisé." });
    }
    res.status(500).json({ message: "Erreur lors de la création de la technologie." });
  }
});

// PUT /api/technologies/:id
router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, category } = req.body;

    const technology = await prisma.technology.update({
      where: { id },
      data: { name, slug, description, icon, category },
    });

    res.json(technology);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Technologie introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la modification de la technologie." });
  }
});

// DELETE /api/technologies/:id
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.technology.delete({ where: { id } });

    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Technologie introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la suppression de la technologie." });
  }
});

export default router;