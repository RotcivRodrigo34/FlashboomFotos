import Image from "next/image";

const fotos = [
    "/XV.png",
    "/XV.png",
    "/XV.png",
    "/XV.png",
    "/XV.png",
    "/XV.png",
];

export default function MomentosCompartidos() {

    return (

        <section className="px-4 mt-5 pb-8">

 <div className="flex items-center justify-between mb-3">

    <h3 className="text-base font-semibold tracking-tight text-gray-900">

        Momentos compartidos

    </h3>

</div>

            <div className="grid grid-cols-3 gap-2">

                {

                    fotos.map((foto,index)=>(

                        <div

                            key={index}

                            className="
relative
aspect-square
rounded-xl
overflow-hidden
shadow-sm
"

                        >

                            <Image

                                src={foto}

                                alt="foto"

                                fill

                                className="object-cover hover:scale-105 transition"

                            />

                        </div>

                    ))

                }

            </div>

        </section>

    );

}