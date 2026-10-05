import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-24">
      <div className="flex flex-col items-start gap-3">
        <span className="tape text-base">JobTracker</span>
        <h1 className="text-3xl font-bold tracking-tight">Inicia sesión</h1>
        <p className="text-ink-soft">Entra para ver tus ofertas.</p>
      </div>
      <LoginForm />
    </main>
  );
}
