"use client";

import { useState } from "react";
import UploadButton from "./UploadButton";
import MomentosCompartidos from "./MomentosCompartidos";

interface Props{

    codigoEvento:string;

}

export default function EventoFotos({

    codigoEvento

}:Props){

    const [refresh,setRefresh]=useState(0);

    return(

        <>

            <UploadButton

                codigoEvento={codigoEvento}

                onUploadComplete={()=>{

                    setRefresh(prev=>prev+1);

                }}

            />

            <MomentosCompartidos

                codigoEvento={codigoEvento}

                refresh={refresh}

            />

        </>

    );

}