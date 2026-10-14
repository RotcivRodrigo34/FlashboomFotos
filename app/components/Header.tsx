
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const router = useRouter();

  async function cerrarSesion() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error);
      return;
    }

    localStorage.removeItem("logueado");
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/dashboard">
          <Image
            src="/logofb.png"
            alt="FlashboomFotos"
            width={150}
            height={60}
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-violet-600 transition"
          >
            Inicio
          </Link>

          <p className="font-semibold text-violet-600">Mis Eventos</p>

          <button
            type="button"
            onClick={cerrarSesion}
            className="text-gray-700 hover:text-violet-600"
          >
            Cerrar Sesión
          </button>

          <Link
            href="/crear-album/evento"
            className="bg-violet-600 hover:bg-violet-700 transition text-white px-6 py-3 rounded-xl"
          >
            Nuevo Evento
          </Link>
        </div>
      </div>
    </header>
  );
}
