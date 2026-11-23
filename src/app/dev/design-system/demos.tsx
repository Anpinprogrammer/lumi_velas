"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

export function InteractiveDemos() {
  const [modal, setModal] = useState(false);
  const [dialog, setDialog] = useState(false);
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => setModal(true)}>Abrir modal</Button>
      <Button variant="secondary" onClick={() => setDialog(true)}>Abrir confirmación</Button>
      <Button variant="ghost" onClick={() => toast("Producto guardado correctamente", "success")}>Toast éxito</Button>
      <Button variant="ghost" onClick={() => toast("No se pudo subir la imagen", "error")}>Toast error</Button>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Cotiza tu evento"
        description="Cuéntanos lo esencial y te respondemos por WhatsApp."
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button><Button onClick={() => setModal(false)}>Enviar</Button></>}
      >
        <div className="flex flex-col gap-4">
          <Input label="Tu nombre" required />
          <Textarea label="Detalles del evento" hint="Fecha, cantidad aproximada y estilo." />
        </div>
      </Modal>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        onConfirm={() => { setDialog(false); toast("Producto eliminado", "info"); }}
        title="¿Eliminar este producto?"
        description="Esta acción no se puede deshacer. Si solo quieres ocultarlo, usa «Ocultar»."
        confirmLabel="Eliminar"
        tone="destructive"
      />
    </div>
  );
}
