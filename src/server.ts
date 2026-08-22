import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectsRoutes from "./routes/projects.routes";
import technologiesRoutes from "./routes/technologies.routes";
import academicPathRoutes from "./routes/academicPath.routes";
import messagesRoutes from "./routes/messages.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globaux
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Route de test simple : pour vérifier que le serveur tourne
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Le serveur backend fonctionne." });
});

// Toutes les routes commençant par /api/projects sont gérées
// par le fichier projects.routes.ts
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/technologies", technologiesRoutes);
app.use("/api/academic-path", academicPathRoutes);
app.use("/api/messages", messagesRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});