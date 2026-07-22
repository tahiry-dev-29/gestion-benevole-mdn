import Link from "next/link";
import {
  Award,
  Calendar,
  Heart,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-700/50 backdrop-blur-md fixed w-full top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 text-white p-2 rounded-xl shadow-lg shadow-sky-500/20">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-sky-400 to-blue-200 bg-clip-text text-transparent">
              Maison du Numérique
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link
              href="#activites"
              className="hover:text-sky-400 transition-colors"
            >
              Activités
            </Link>
            <Link
              href="#partages"
              className="hover:text-sky-400 transition-colors"
            >
              Partages
            </Link>
            <Link
              href="#temoignages"
              className="hover:text-sky-400 transition-colors"
            >
              Témoignages
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-sky-500 text-sky-400 hover:bg-sky-500/10"
              >
                Espace Bénévole
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
          <ShieldCheck className="w-4 h-4" /> Platform PWA Officielle – Gestion
          Bénévoles
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Engagés ensemble pour l&apos;inclusion numérique
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Suivez l&apos;impact de nos bénévoles, gérez les présences, valorisez
          les crédits d&apos;heures et découvrez les actualités et témoignages
          de la Maison du Numérique.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 px-8"
            >
              Accéder à l&apos;Espace Bénévole
            </Button>
          </Link>
          <Link href="#activites">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-200 hover:bg-slate-800 px-8"
            >
              Découvrir les activités
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Suivi des Présences
          </h3>
          <p className="text-slate-400">
            Pointage quotidien facile et rapide pour assurer le suivi précis de
            la présence sur site.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Crédits & Heures
          </h3>
          <p className="text-slate-400">
            Cumul transparent et valorisation des crédits d&apos;heures
            d&apos;engagement bénévole.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-4">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Partages & Témoignages
          </h3>
          <p className="text-slate-400">
            Vitrine publique d&apos;activités, de retours d&apos;expérience et
            de témoignages inspirants.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Maison du Numérique. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span>Fait avec</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>par l&apos;équipe Bénévoles</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
