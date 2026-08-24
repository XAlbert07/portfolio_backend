import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
const profileId = "main";

router.get("/", async (_request, response) => {
  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  response.json(profile);
});

router.put("/", requireAuth, async (request, response) => {
  const { name, title, bio, location, availability, email, githubUrl, linkedinUrl, profileImage } = request.body;
  if (!name || !title || !bio) return response.status(400).json({ message: "Les champs nom, titre et présentation sont obligatoires." });
  const profile = await prisma.profile.upsert({ where: { id: profileId }, create: { id: profileId, name, title, bio, location, availability, email, githubUrl, linkedinUrl, profileImage }, update: { name, title, bio, location, availability, email, githubUrl, linkedinUrl, profileImage } });
  response.json(profile);
});

export default router;
