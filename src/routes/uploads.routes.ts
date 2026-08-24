import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware";
import { storeProjectImage } from "../lib/storage";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_request, file, callback) => callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) });

router.post("/project-cover", requireAuth, upload.single("file"), async (request, response) => {
  if (!request.file) return response.status(400).json({ message: "Image JPG, PNG ou WebP requise (5 Mo maximum)." });
  try { const url = await storeProjectImage(request.file); response.status(201).json({ url }); } catch (error) { console.error(error); response.status(500).json({ message: "Impossible de stocker cette image." }); }
});

export default router;
