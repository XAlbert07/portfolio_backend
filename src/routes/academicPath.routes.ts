import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/academic-path
// Renvoie tout le parcours académique, trié dans l'ordre chronologique
// d'affichage (comme la timeline de la maquette).
router.get("/", async (req, res) => {
  try {
    const academicPath = await prisma.academicPath.findMany({
      orderBy: { order: "asc" },
    });

    res.json(academicPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du parcours académique." });
  }
});

// POST /api/academic-path
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, description, startYear, endYear, inProgress, subjects, order } = req.body;

    if (!title || !description || !startYear) {
      return res.status(400).json({
        message: "Les champs titre, description et année de début sont obligatoires.",
      });
    }

    const academicPath = await prisma.academicPath.create({
      data: {
        title,
        description,
        startYear,
        endYear,
        inProgress: inProgress ?? false,
        subjects: subjects ?? [],
        order: order ?? 0,
      },
    });

    res.status(201).json(academicPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du parcours académique." });
  }
});

// PUT /api/academic-path/:id
router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, startYear, endYear, inProgress, subjects, order } = req.body;

    const academicPath = await prisma.academicPath.update({
      where: { id },
      data: { title, description, startYear, endYear, inProgress, subjects, order },
    });

    res.json(academicPath);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Parcours académique introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la modification du parcours académique." });
  }
});

// DELETE /api/academic-path/:id
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.academicPath.delete({ where: { id } });

    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Parcours académique introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la suppression du parcours académique." });
  }
});

export default router;