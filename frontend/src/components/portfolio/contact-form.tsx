"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    if (response.ok) { form.reset(); setMessage("Votre message a bien été envoyé."); setState("success"); }
    else { setMessage(data.message ?? "Impossible d’envoyer le message."); setState("error"); }
  }

  return <form className="contact-form" onSubmit={submit}>
    <label>Nom<input name="name" required placeholder="Votre nom" /></label>
    <label>Email<input name="email" type="email" required placeholder="vous@exemple.com" /></label>
    <label>Sujet<input name="subject" placeholder="Objet du message" /></label>
    <label>Message<textarea name="content" required rows={6} placeholder="Votre message" /></label>
    <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi en cours…" : "Envoyer le message →"}</button>
    {message && <p className={`form-feedback ${state}`}>{message}</p>}
  </form>;
}
