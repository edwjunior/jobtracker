"use client";

import { useActionState } from "react";
import { buttonPrimary, fieldClass } from "@/components/ui";
import { signIn } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="email" required className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-phase-descartada">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
