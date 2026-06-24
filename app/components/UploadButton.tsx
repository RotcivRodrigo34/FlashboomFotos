"use client";

import { useRef } from "react";

interface Props{

    codigoEvento:string;

}

export default function UploadButton({

    codigoEvento

}:Props){

  const inputFile = useRef<HTMLInputElement>(null);

  async function subirArchivo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    if (!e.target.files?.length) return;

    const foto = e.target.files[0];

const formData = new FormData();

formData.append("foto", foto);

formData.append("codigoEvento", codigoEvento);

    const response = await fetch("/api/evento/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    console.log(data);

  }

  return (

    <>

      <input
        ref={inputFile}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={subirArchivo}
      />

      <button
        onClick={() => inputFile.current?.click()}
        className="
          w-full
          bg-violet-600
          hover:bg-violet-700
          text-white
          font-semibold
          text-lg
          py-4
          rounded-full
          transition
          shadow-lg
        "
      >

        <div className="flex justify-center items-center gap-3">

          <span className="text-lg">
            📷
          </span>

          <span>
            Subir mis fotografías
          </span>

        </div>

      </button>

    </>

  );

}