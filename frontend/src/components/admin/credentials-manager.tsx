"use client";

import { FormEvent, useState } from "react";

export function CredentialsManager({ email }: { email: string }) {
  const [form, setForm] = useState({ email, currentPassword: "", newPassword: "", confirmation: "" });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);

  function set(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setError(false);
    if (form.newPassword !== form.confirmation) { setError(true); setFeedback("Les deux nouveaux mots de passe ne correspondent pas."); return; }
    setFeedback("Enregistrement…");
    const response = await fetch("/api/admin/security", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, currentPassword: form.currentPassword, newPassword: form.newPassword }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(true); setFeedback(data.message ?? "Impossible de modifier les identifiants."); return; }
    setForm({ email: data.user.email, currentPassword: "", newPassword: "", confirmation: "" });
    setFeedback("Identifiants mis à jour. Utilise les nouveaux identifiants à la prochaine connexion.");
  }

  return <form className="admin-form credentials-form" onSubmit={submit}><div className="admin-form-grid"><label className="wide-field">Nouvel email<input required type="email" value={form.email} onChange={(event) => set("email", event.target.value)} /></label><label className="wide-field">Mot de passe actuel<input required type="password" autoComplete="current-password" value={form.currentPassword} onChange={(event) => set("currentPassword", event.target.value)} /></label><label>Nouveau mot de passe<input required minLength={8} type="password" autoComplete="new-password" value={form.newPassword} onChange={(event) => set("newPassword", event.target.value)} /></label><label>Confirmation<input required minLength={8} type="password" autoComplete="new-password" value={form.confirmation} onChange={(event) => set("confirmation", event.target.value)} /></label></div><p className="form-hint">Minimum 8 caractères. Cette modification ne change pas ta session actuelle.</p><button type="submit">Enregistrer les identifiants →</button>{feedback && <p className={`form-feedback ${error ? "error" : "success"}`}>{feedback}</p>}</form>;
}
