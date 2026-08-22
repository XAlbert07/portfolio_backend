import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = Router();

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

export default router;