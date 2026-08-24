import fs from "node:fs/promises";
import path from "node:path";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

export async function removeLocalUpload(url?: string | null) {
  if (!url || !url.includes("/uploads/projects/")) return;
  const filename = path.basename(url.split("/uploads/projects/")[1]);
  if (!filename || filename.includes("..")) return;
  await fs.unlink(path.join(uploadsRoot, "projects", filename)).catch(() => undefined);
}
