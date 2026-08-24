import fs from "node:fs/promises";
import path from "node:path";

const localRoot = path.resolve(process.cwd(), "uploads", "projects");
const provider = process.env.STORAGE_PROVIDER ?? "local";
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "portfolio-projects";

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis avec STORAGE_PROVIDER=supabase.");
  return { url: url.replace(/\/$/, ""), key };
}

export async function storeProjectImage(file: Express.Multer.File) {
  const extension = path.extname(file.originalname).toLowerCase();
  const filename = `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  if (provider !== "supabase") {
    await fs.mkdir(localRoot, { recursive: true });
    await fs.writeFile(path.join(localRoot, filename), file.buffer);
    return `/uploads/projects/${filename}`;
  }
  const { url, key } = supabaseConfig();
  const objectPath = `projects/${filename}`;
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, { method: "POST", headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": file.mimetype, "x-upsert": "false" }, body: file.buffer });
  if (!response.ok) throw new Error(`Supabase Storage upload failed: ${response.status}`);
  return `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export async function removeStoredProjectImage(imageUrl?: string | null) {
  if (!imageUrl) return;
  if (provider !== "supabase" || imageUrl.includes("/uploads/projects/")) {
    const filename = imageUrl.split("/uploads/projects/")[1];
    if (filename && !filename.includes("..")) await fs.unlink(path.join(localRoot, path.basename(filename))).catch(() => undefined);
    return;
  }
  const marker = `/storage/v1/object/public/${bucket}/`;
  const objectPath = imageUrl.split(marker)[1];
  if (!objectPath) return;
  const { url, key } = supabaseConfig();
  await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, { method: "DELETE", headers: { Authorization: `Bearer ${key}`, apikey: key } });
}
