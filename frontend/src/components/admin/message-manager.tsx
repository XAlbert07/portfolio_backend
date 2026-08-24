"use client";

import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type Message = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  content: string;
  read: boolean;
  createdAt: string;
};

type Filter = "all" | "unread" | "read";

export function MessageManager({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = messages.filter((message) => !message.read).length;
  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr-FR");
    return messages.filter((message) => {
      const matchesFilter = filter === "all" || (filter === "read" ? message.read : !message.read);
      const searchable = `${message.name} ${message.email} ${message.subject ?? ""} ${message.content}`.toLocaleLowerCase("fr-FR");
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, messages, query]);

  async function markRead(id: string) {
    const response = await fetch(`/api/admin/messages/${id}/read`, { method: "PATCH" });
    if (response.ok) setMessages((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  }

  async function remove() {
    if (!deleteId) return;
    const response = await fetch(`/api/admin/messages/${deleteId}`, { method: "DELETE" });
    if (response.ok) setMessages((current) => current.filter((item) => item.id !== deleteId));
    setDeleteId(null);
  }

  return <div className="message-list">
    <ConfirmDialog open={Boolean(deleteId)} title="Supprimer ce message ?" description="Ce message sera définitivement retiré de la boîte de réception." onCancel={() => setDeleteId(null)} onConfirm={remove} />
    <div className="message-toolbar">
      <label className="message-search"><span className="sr-only">Rechercher un message</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un nom, email ou sujet" /></label>
      <div className="message-filters" role="group" aria-label="Filtrer les messages">
        {([["all", "Tous"], ["unread", `Non lus (${unreadCount})`], ["read", "Lus"]] as [Filter, string][]).map(([value, label]) => <button key={value} className={`filter-button ${filter === value ? "is-active" : ""}`} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
    </div>
    <p className="message-summary">{filteredMessages.length} message{filteredMessages.length > 1 ? "s" : ""} affiché{filteredMessages.length > 1 ? "s" : ""}</p>
    {filteredMessages.length === 0 && <div className="message-empty"><strong>{messages.length === 0 ? "Aucun message reçu." : "Aucun résultat."}</strong><span>{messages.length === 0 ? "Les nouveaux messages apparaîtront ici." : "Modifiez votre recherche ou votre filtre."}</span></div>}
    {filteredMessages.map((message) => <article className={`message-item ${message.read ? "is-read" : ""}`} key={message.id}>
      <div><div className="message-heading"><strong>{message.name}</strong><span>{new Date(message.createdAt).toLocaleDateString("fr-FR")}</span></div><p>{message.email}{message.subject ? ` · ${message.subject}` : ""}</p><div className="message-content">{message.content}</div></div>
      <div className="message-actions"><a className="quiet-button" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject ?? "Votre message"}`)}`}>Répondre</a>{!message.read && <button className="quiet-button" onClick={() => markRead(message.id)}>Marquer lu</button>}<button className="danger-button" onClick={() => setDeleteId(message.id)}>Supprimer</button></div>
    </article>)}
  </div>;
}
