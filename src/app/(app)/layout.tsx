import Link from "next/link";
import { buttonSecondary } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { signOut } from "./actions";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();

  return (
    <>
      <header className="border-b border-rule-strong">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="tape text-base">
              JobTracker
            </Link>
            <nav aria-label="Principal" className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/" className="hover:underline">
                Ofertas
              </Link>
              <Link href="/perfil" className="hover:underline">
                Perfil
              </Link>
            </nav>
          </div>
          <form action={signOut} className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-soft sm:inline">{user.email}</span>
            <button type="submit" className={`${buttonSecondary} py-1.5`}>
              Salir
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
