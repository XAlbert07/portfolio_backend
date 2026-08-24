import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const rl = readline.createInterface({ input, output });

async function main() {
  const email = (await rl.question("Email admin : ")).trim().toLowerCase();
  const password = await rl.question("Mot de passe admin (8 caractères minimum) : ");
  const name = (await rl.question("Nom admin [Albert Sama] : ")).trim() || "Albert Sama";
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Adresse email invalide.");
  if (password.length < 8) throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({ where: { email }, update: { password: hash, name }, create: { email, password: hash, name } });
  console.log(`Compte admin prêt : ${user.email}`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(async () => { rl.close(); await prisma.$disconnect(); });
