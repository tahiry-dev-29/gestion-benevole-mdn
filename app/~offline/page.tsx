import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-xl content-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold">Vous êtes hors connexion</h1>
      <p className="text-muted-foreground">
        Les pages publiques déjà consultées restent disponibles.
        Reconnectez-vous pour envoyer un témoignage.
      </p>
      <Link className="text-primary underline" href="/temoignages">
        Réessayer les témoignages
      </Link>
    </main>
  );
}
