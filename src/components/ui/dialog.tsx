"use client";

import type { ReactNode } from "react";
import { Button } from "./button";
import { Modal } from "./modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** destructive usa el color de error para acciones como eliminar. */
  tone?: "default" | "destructive";
  loading?: boolean;
};

/** Diálogo de confirmación corto (Sí/No) construido sobre Modal. */
export function Dialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", tone = "default", loading }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
          <Button
            variant={tone === "destructive" ? "accent" : "primary"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-text-muted">{description}</p>
    </Modal>
  );
}
