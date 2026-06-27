import HeroCarousel from "@/app/components/HeroCarousel";
import EventoFotos from "@/app/components/EventoFotos";
import MomentosCompartidos from "@/app/components/MomentosCompartidos";
import UploadButton from "@/app/components/UploadButton";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
export default async function EventoPublico({

    params

}:{

    params:Promise<{

        codigo:string;

    }>

}){

const {codigo}=await params;
function formatearFecha(fecha: string) {

    return new Date(fecha).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}
const { data: evento, error } = await supabase
  .from("eventos")
  .select("*")
  .eq("codigo", codigo)
  .single();

if (error || !evento) {

  notFound();

}
  
  return (

<main className="bg-white min-h-screen">
   <div className="w-full max-w-[430px] mx-auto">
        <HeroCarousel/>
        <section className="px-5 mt-4 text-center">

   <h1 className="text-2xl font-bold text-gray-900">

        {evento.nombre_evento}

    </h1>

<p className="text-gray-500 text-sm">

    {formatearFecha(evento.fecha)}

</p>

</section>
        {/* MENSAJE */}

        <section className="mt-5">
           <h2 className="text-center text-lg font-semibold text-gray-800">
              Cada fotografía cuenta una historia
           </h2>
           <p className="text-center text-sm text-gray-500 mt-1">
              Comparte la tuya
           </p>

</section>

        {/* BOTÓN */}


<section className="px-5 mt-5">

<EventoFotos

    codigoEvento={codigo}

/>

</section>

  



      </div>

    </main>

  );

}