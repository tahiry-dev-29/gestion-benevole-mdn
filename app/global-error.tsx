"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang="fr" className="dark">
      <body className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-950 text-slate-100">
        <main className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">
            Erreur inattendue
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Une erreur est survenue pendant le traitement de votre demande.
            Veuillez réessayer.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <p className="mt-4 rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-500">
              {error.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
