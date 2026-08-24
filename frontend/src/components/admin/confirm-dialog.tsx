"use client";

type ConfirmDialogProps = { open: boolean; title: string; description: string; confirmLabel?: string; onCancel: () => void; onConfirm: () => void };

export function ConfirmDialog({ open, title, description, confirmLabel = "Supprimer", onCancel, onConfirm }: ConfirmDialogProps) {
  if (!open) return null;
  return <div className="confirm-backdrop" role="presentation"><div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><p className="eyebrow">Confirmation</p><h2 id="confirm-title">{title}</h2><p>{description}</p><div className="confirm-actions"><button type="button" className="quiet-button" onClick={onCancel}>Annuler</button><button type="button" className="danger-button confirm-danger" onClick={onConfirm}>{confirmLabel}</button></div></div></div>;
}
