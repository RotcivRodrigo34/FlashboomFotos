"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Props{

    codigoEvento:string;

}

interface Foto{

    id:number;

    google_file_id:string;

    nombre_archivo:string;

}

export default function MomentosCompartidos({

    codigoEvento

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

    },[codigoEvento]);
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

    console.log(foto);

    return (

        <div
            key={foto.id}
            className="border p-2 text-xs"
        >

         <a
    href={`https://drive.google.com/uc?export=view&id=${foto.google_file_id}`}
    target="_blank"
    rel="noreferrer"
>
    Abrir imagen
</a>
        </div>

    );

})}

            </div>

        </section>

    );

}