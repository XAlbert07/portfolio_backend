import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AuthRequest, requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Initialisation ponctuelle du compte admin quand le Shell Render n'est pas disponible.
// La route reste désactivée tant que ADMIN_BOOTSTRAP_TOKEN n'est pas défini.
router.post("/bootstrap", async (req, res) => {
  const expectedToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!expectedToken || req.headers["x-bootstrap-token"] !== expectedToken) return res.status(404).json({ message: "Route indisponible." });
  try {
    const { email, password, name = "Albert Sama" } = req.body;
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || String(password ?? "").length < 8) return res.status(400).json({ message: "Email valide et mot de passe de 8 caractères minimum requis." });
    const hash = await bcrypt.hash(String(password), 10);
    const user = await prisma.user.upsert({ where: { email: normalizedEmail }, update: { password: hash, name: String(name) }, create: { email: normalizedEmail, password: hash, name: String(name) } });
    return res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Initialisation impossible." });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  if (!req.userId) return res.status(401).json({ message: "Authentification requise." });
  const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, name: true, email: true } });
  return user ? res.json({ user }) : res.status(404).json({ message: "Utilisateur introuvable." });
});

// POST /api/auth/login
// Reçoit { email, password }, vérifie qu'ils correspondent à un User
// existant, et renvoie un token JWT si c'est correct.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // 1. On cherche l'utilisateur par email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Volontairement le même message que "mauvais mot de passe" plus bas :
      // on ne veut pas révéler si c'est l'email qui est faux ou le mot de
      // passe, ça aiderait quelqu'un qui essaierait de deviner un compte.
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // 2. On compare le mot de passe envoyé avec le hash stocké en base.
    // bcrypt.compare() re-hash "password" et vérifie que ça correspond
    // au hash stocké — impossible de "décoder" un hash dans l'autre sens.
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // 3. Identifiants corrects : on fabrique le "bracelet VIP" (le token).
    // On y met l'id et le rôle de l'utilisateur — pas le mot de passe,
    // jamais. jwt.sign() signe ce contenu avec la clé secrète du .env,
    // ce qui le rend infalsifiable sans connaître cette clé.
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // le bracelet expire après 7 jours
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
});

// PUT /api/auth/credentials — modification protégée des identifiants admin.
router.put("/credentials", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, email, newPassword } = req.body;
    if (!req.userId || !currentPassword || !email || !newPassword) {
      return res.status(400).json({ message: "Mot de passe actuel, email et nouveau mot de passe requis." });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return res.status(400).json({ message: "Adresse email invalide." });
    if (String(newPassword).length < 8) return res.status(400).json({ message: "Le nouveau mot de passe doit contenir au moins 8 caractères." });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !(await bcrypt.compare(String(currentPassword), user.password))) return res.status(401).json({ message: "Le mot de passe actuel est incorrect." });

    const password = await bcrypt.hash(String(newPassword), 10);
    const updated = await prisma.user.update({ where: { id: user.id }, data: { email: normalizedEmail, password } });
    return res.json({ user: { id: updated.id, name: updated.name, email: updated.email } });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return res.status(409).json({ message: "Cette adresse email est déjà utilisée." });
    console.error(error);
    return res.status(500).json({ message: "Impossible de modifier les identifiants." });
  }
});

export default router;
