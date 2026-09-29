const phases = ["Guardada", "En curso", "Entrevista", "Completada", "Descartada"];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-24">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">JobTracker</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Evalúa y haz seguimiento de tus ofertas de empleo.
        </p>
      </div>
      <ol className="flex flex-wrap gap-2">
        {phases.map((phase) => (
          <li
            key={phase}
            className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm dark:border-zinc-800"
          >
            {phase}
          </li>
        ))}
      </ol>
    </main>
  );
}
