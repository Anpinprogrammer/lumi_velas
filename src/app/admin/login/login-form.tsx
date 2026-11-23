"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Input name="email" type="email" label="Correo" autoComplete="email" required />
      <Input name="password" type="password" label="Contraseña" autoComplete="current-password" required error={state.error} />
      <Button type="submit" loading={pending}>Entrar</Button>
    </form>
  );
}
