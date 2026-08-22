import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// On étend le type Request d'Express pour pouvoir accrocher les infos
// de l'utilisateur connecté dessus (userId, role), pour que les routes
// suivantes puissent les lire.
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Ce middleware vérifie que la requête contient un token JWT valide.
// S'il est valide, on laisse passer (next()). Sinon, on bloque avec 401.
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Le token arrive dans l'en-tête HTTP "Authorization", sous la forme :
  // "Bearer eyJhbGciOiJIUzI1NiIs..."
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentification requise." });
  }

  // On retire le mot "Bearer " pour ne garder que le token lui-même
  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify() vérifie que le token a bien été signé avec notre
    // JWT_SECRET (donc qu'il vient bien de notre serveur, pas fabriqué
    // par quelqu'un d'autre) et qu'il n'a pas expiré.
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // On accroche les infos décodées à la requête, pour que la route
    // suivante (ex: création de projet) sache qui fait la demande.
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next(); // le videur laisse passer
  } catch (error) {
    // Le token est invalide ou expiré
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}