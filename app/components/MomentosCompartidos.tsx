"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

    const [cargando,setCargando]=useState(true);

    useEffect(()=>{

        async function cargarFotos(){

            const response=await fetch(

                `/api/evento/fotos?codigo=${codigoEvento}`

            );

            const data=await response.json();

            if(data.ok){

                setFotos(data.fotos);

            }

            setCargando(false);

        }

        cargarFotos();

    },[codigoEvento,refresh]);
console.log(fotos);
    return(

        <section className="px-4 mt-5 pb-8">

            <div className="flex items-center justify-between mb-3">

                <h3 className="text-base font-semibold tracking-tight text-gray-900">

                    Momentos compartidos

                </h3>

                <span className="text-sm text-gray-500">

                    {fotos.length} fotos

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

    console.log("FOTO:", foto);

    return (

<div
    key={foto.id}
    className="relative aspect-square rounded-xl overflow-hidden border"
>

    <p className="absolute top-0 left-0 z-10 text-[9px] bg-white">
        {foto.thumbnail_url}
    </p>

    <img
        src={foto.thumbnail_url}
        alt=""
        className="w-full h-full object-cover"
        onLoad={() => console.log("OK:", foto.thumbnail_url)}
        onError={() => console.log("ERROR:", foto.thumbnail_url)}
    />

</div>

    );

})}

            </div>

        </section>

    );

}