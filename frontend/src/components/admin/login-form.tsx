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
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (response.ok) router.push("/admin"); else { setError(data.message ?? "Connexion impossible."); setLoading(false); }
    } catch {
      setError("Serveur inaccessible. Vérifie l’adresse utilisée et que le backend est démarré.");
      setLoading(false);
    }
  }
  return <form className="contact-form" method="post" action="/api/auth/login" onSubmit={submit}><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Mot de passe<input name="password" type="password" autoComplete="current-password" required /></label><button type="submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter →"}</button>{error && <p className="form-feedback error">{error}</p>}</form>;
}
