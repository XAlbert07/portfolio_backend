import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/messages
// Enregistre un nouveau message envoyé depuis le formulaire de Contact public.
// C'est la seule route "d'écriture" qu'on fait maintenant, sans protection
// par auth, car n'importe quel visiteur du site doit pouvoir l'utiliser
// (contrairement à "créer un projet", réservé à l'admin).
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, content } = req.body;

    // Validation simple : on vérifie que les champs obligatoires sont présents
    if (!name || !email || !content) {
      return res.status(400).json({
        message: "Les champs nom, email et message sont obligatoires.",
      });
    }

    const message = await prisma.message.create({
      data: { name, email, subject, content },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message." });
  }
});

// GET /api/messages
// Renvoie tous les messages reçus. Protégée : seule une personne
// connectée (Albert) peut voir sa boîte de réception.
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des messages." });
  }
});

// PATCH /api/messages/:id/read
// Marque un message comme lu. Protégée.
router.patch("/:id/read", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.update({
      where: { id },
      data: { read: true },
    });

    res.json(message);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Message introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la mise à jour du message." });
  }
});

// DELETE /api/messages/:id
// Supprime un message. Protégée.
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.message.delete({ where: { id } });

    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Message introuvable." });
    }
    res.status(500).json({ message: "Erreur lors de la suppression du message." });
  }
});

export default router;