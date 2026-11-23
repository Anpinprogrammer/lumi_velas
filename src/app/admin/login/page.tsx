import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { getSupabaseEnv } from "@/lib/env";
import { getAdminUser } from "@/lib/auth/admin";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Lumi Studio · Acceso", robots: { index: false, follow: false } };

async function LoginGate() {
  if (!getSupabaseEnv()) {
    return <p role="alert" className="text-error">Supabase no está configurado. Define las variables de .env.example.</p>;
  }
  if (await getAdminUser()) redirect("/admin");
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-12">
      <Card className="flex w-full max-w-sm flex-col gap-6">
        <Image src="/brand/lumi-wordmark.webp" alt="Lumi" width={180} height={59} priority className="mx-auto" />
        <Suspense fallback={null}>
          <LoginGate />
        </Suspense>
      </Card>
    </main>
  );
}
