import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
const uploadDirectory = path.resolve(process.cwd(), "uploads", "projects");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
  },
});

router.post("/project-cover", requireAuth, upload.single("file"), (request, response) => {
  if (!request.file) return response.status(400).json({ message: "Image JPG, PNG ou WebP requise (5 Mo maximum)." });
  const baseUrl = `${request.protocol}://${request.get("host")}`;
  response.status(201).json({ url: `${baseUrl}/uploads/projects/${request.file.filename}` });
});

export default router;
