"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    if (response.ok) router.push("/admin"); else { setError(data.message ?? "Connexion impossible."); setLoading(false); }
  }
  return <form className="contact-form" onSubmit={submit}><label>Email<input name="email" type="email" required /></label><label>Mot de passe<input name="password" type="password" required /></label><button type="submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter →"}</button>{error && <p className="form-feedback error">{error}</p>}</form>;
}
