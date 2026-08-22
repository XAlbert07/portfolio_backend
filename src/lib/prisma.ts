import { PrismaClient } from "@prisma/client";

// On crée une seule instance de PrismaClient et on la réutilise partout,
// plutôt que d'en créer une nouvelle à chaque fichier (ça épuiserait vite
// les connexions PostgreSQL disponibles).
export const prisma = new PrismaClient();
