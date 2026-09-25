"use client";
import { useEffect, useState } from "react";

interface Props{
    codigoEvento:string;
    refresh:number;
}

interface Foto{
    id:number;
    google_file_id:string;
    thumbnail_url:string;
    nombre_archivo:string;
}

export default function MomentosCompartidos({
    codigoEvento,
    refresh
    }:Props){
       const [fotos,setFotos]=useState<Foto[]>([]);
       const [fotosGaleria, setFotosGaleria] = useState<Foto[]>([]);
       const [totalFotos, setTotalFotos] = useState(0);
       const [cargando,setCargando]=useState(true);
       const [fotoSeleccionada, setFotoSeleccionada] = useState<Foto | null>(null);
       const [galeriaAbierta, setGaleriaAbierta] = useState(false);
       useEffect(()=>{
       async function cargarFotos(){
            const response=await fetch(
                `/api/evento/fotos?codigo=${codigoEvento}`
            );
            const data=await response.json();
    if (data.ok) {
       console.log("Respuesta API:", data);
       setFotos(data.fotos);
       setTotalFotos(data.totalFotos);
}
       setCargando(false);
}
       cargarFotos();
},[codigoEvento,refresh]);
console.log("TOTAL EN REACT:", totalFotos);
    return(
        <section className="px-4 mt-5 pb-8">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold tracking-tight text-gray-900">
                    Momentos compartidos
                </h3>
                <span className="text-sm text-gray-500">
                  {totalFotos} fotos
                </span>
            </div>
            {
                cargando && (
                    <p className="text-center text-gray-400 py-10">
                        Cargando fotografías...
                    </p>
                )
            }
            {
                !cargando && fotos.length===0 && (
                    <p className="text-center text-gray-400 py-10">
                        Aún no hay fotografías.
                    </p>
                )
            }
            <div className="grid grid-cols-3 gap-2">
            {fotos.map((foto) => {
               return (
            <div key={foto.id} onClick={() => setFotoSeleccionada(foto)} className=" aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm flex items-center justify-center cursor-pointer" > <img src={foto.thumbnail_url} alt={foto.nombre_archivo} className="max-w-full max-h-full object-contain" />
            
</div>

);

})}
</div>
            <div className="text-center mt-4">
                <button
                    onClick={async () => {
                        const response = await fetch(
                            `/api/evento/fotos?codigo=${codigoEvento}&todas=true`
                        );

                        const data = await response.json();

                        if (data.ok) {
                            setFotosGaleria(data.fotos);
                            setGaleriaAbierta(true);
                        }
                    }}
                    className="
                    text-sm
                    font-semibold
                    text-gray-600
                    hover:text-gray-900"
                >
                    Ver galería
                </button>
            </div>

                 {galeriaAbierta && (
                 <div className=" fixed inset-0 z-40 bg-white overflow-y-auto p-4" >
                 <div className="flex items-center justify-between mb-5">
                 <h2 className="text-xl font-bold text-gray-900">
                   Galería
                 </h2>
                 <button
                    onClick={() => setGaleriaAbierta(false)}
                    className="
                    text-2xl
                    text-gray-500
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center"
                    aria-label="Cerrar galería"
                >
                    ×
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {fotosGaleria.map((foto) => (
                    <div
                        key={foto.id}
                        onClick={() => setFotoSeleccionada(foto)}
                        className="
                        aspect-square
                        rounded-xl
                        overflow-hidden
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                        cursor-pointer"
                    >
                        <img
                            src={foto.thumbnail_url}
                            alt={foto.nombre_archivo}
                            className="
                            max-w-full
                            max-h-full
                            object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    )}
       
        {fotoSeleccionada && (
            <div
                className="
                fixed
                inset-0
                z-50
                bg-black/90
                flex
                items-center
                justify-center
                p-4"
            >
                <button
                    onClick={() => setFotoSeleccionada(null)}
                    className="
                    absolute
                    top-4
                    right-4
                    text-white
                    text-3xl
                    font-bold
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center"
                    aria-label="Cerrar fotografía"
                >
                    ×
                </button>

                <img
                    src={fotoSeleccionada.thumbnail_url}
                    alt={fotoSeleccionada.nombre_archivo}
                    className="
                    max-w-full
                    max-h-[85vh]
                    object-contain
                    rounded-lg"
                />
                            <a
                href={`/api/evento/download/${fotoSeleccionada.id}`}
                className="
                absolute
                bottom-6
                left-1/2
                -translate-x-1/2
                bg-white
                text-gray-900
                px-5
                py-2
                rounded-full
                font-semibold
                shadow-lg"
            >
                Descargar
            </a>
            </div>
        )}
</section>
);
}