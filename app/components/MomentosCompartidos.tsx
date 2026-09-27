"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
    codigoEvento: string;
    refresh: number;
}

interface Foto {
    id: number;
    google_file_id: string;
    thumbnail_url: string;
    nombre_archivo: string;
}

export default function MomentosCompartidos({
    codigoEvento,
    refresh
}: Props) {

    const [fotos, setFotos] = useState<Foto[]>([]);
    const [fotosGaleria, setFotosGaleria] = useState<Foto[]>([]);
    const [totalFotos, setTotalFotos] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [fotoSeleccionada, setFotoSeleccionada] = useState<Foto | null>(null);
    const [galeriaAbierta, setGaleriaAbierta] = useState(false);

    // Referencia para detectar swipe
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    useEffect(() => {

        async function cargarFotos() {

            const response = await fetch(
                `/api/evento/fotos?codigo=${codigoEvento}`
            );

            const data = await response.json();

            if (data.ok) {

                console.log("Respuesta API:", data);

                setFotos(data.fotos);
                setTotalFotos(data.totalFotos);

            }

            setCargando(false);
        }

        cargarFotos();

    }, [codigoEvento, refresh]);

    console.log("TOTAL EN REACT:", totalFotos);

    /*
     * Fotos disponibles para navegar.
     *
     * Si la foto fue abierta desde "Ver galería",
     * usamos todas las fotografías.
     *
     * Si fue abierta desde las 6 fotos principales,
     * navegamos entre esas 6.
     */
    const fotosNavegacion = galeriaAbierta
        ? fotosGaleria
        : fotos;

    /*
     * Ir a la siguiente fotografía
     */
    function siguienteFoto() {

        if (!fotoSeleccionada || fotosNavegacion.length === 0) {
            return;
        }

        const indiceActual = fotosNavegacion.findIndex(
            (foto) => foto.id === fotoSeleccionada.id
        );

        if (indiceActual === -1) {
            return;
        }

        const siguienteIndice =
            (indiceActual + 1) % fotosNavegacion.length;

        setFotoSeleccionada(
            fotosNavegacion[siguienteIndice]
        );
    }

    /*
     * Ir a la fotografía anterior
     */
    function anteriorFoto() {

        if (!fotoSeleccionada || fotosNavegacion.length === 0) {
            return;
        }

        const indiceActual = fotosNavegacion.findIndex(
            (foto) => foto.id === fotoSeleccionada.id
        );

        if (indiceActual === -1) {
            return;
        }

        const anteriorIndice =
            (indiceActual - 1 + fotosNavegacion.length) %
            fotosNavegacion.length;

        setFotoSeleccionada(
            fotosNavegacion[anteriorIndice]
        );
    }

    /*
     * Teclado:
     *
     * ← fotografía anterior
     * → fotografía siguiente
     * ESC cerrar
     */
    useEffect(() => {

        if (!fotoSeleccionada) {
            return;
        }

        function manejarTeclado(event: KeyboardEvent) {

            if (event.key === "ArrowRight") {
                event.preventDefault();
                siguienteFoto();
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                anteriorFoto();
            }

            if (event.key === "Escape") {
                setFotoSeleccionada(null);
            }
        }

        window.addEventListener(
            "keydown",
            manejarTeclado
        );

        return () => {
            window.removeEventListener(
                "keydown",
                manejarTeclado
            );
        };

    }, [fotoSeleccionada, fotosNavegacion]);

    /*
     * Inicio del swipe
     */
    function manejarTouchStart(
        event: React.TouchEvent<HTMLDivElement>
    ) {

        touchStartX.current =
            event.touches[0].clientX;

        touchEndX.current = null;
    }

    /*
     * Movimiento del dedo
     */
    function manejarTouchMove(
        event: React.TouchEvent<HTMLDivElement>
    ) {

        touchEndX.current =
            event.touches[0].clientX;
    }

    /*
     * Final del swipe
     */
    function manejarTouchEnd() {

        if (
            touchStartX.current === null ||
            touchEndX.current === null
        ) {
            return;
        }

        const distancia =
            touchStartX.current -
            touchEndX.current;

        const distanciaMinima = 50;

        /*
         * Deslizar hacia la izquierda
         * → siguiente foto
         */
        if (distancia > distanciaMinima) {
            siguienteFoto();
        }

        /*
         * Deslizar hacia la derecha
         * → foto anterior
         */
        if (distancia < -distanciaMinima) {
            anteriorFoto();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    }

    return (

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
                !cargando && fotos.length === 0 && (

                    <p className="text-center text-gray-400 py-10">
                        Aún no hay fotografías.
                    </p>

                )
            }

            <div className="grid grid-cols-3 gap-2">

                {fotos.map((foto) => {

                    return (

                        <div
                            key={foto.id}
                            onClick={() =>
                                setFotoSeleccionada(foto)
                            }
                            className="
                                aspect-square
                                rounded-xl
                                overflow-hidden
                                bg-gray-100
                                shadow-sm
                                flex
                                items-center
                                justify-center
                                cursor-pointer
                            "
                        >

                            <img
                                src={foto.thumbnail_url}
                                alt={foto.nombre_archivo}
                                className="
                                    max-w-full
                                    max-h-full
                                    object-contain
                                "
                            />

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
                        hover:text-gray-900
                    "
                >
                    Ver galería
                </button>

            </div>

            {
                galeriaAbierta && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-40
                            bg-white
                            overflow-y-auto
                            p-4
                        "
                    >

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-xl font-bold text-gray-900">
                                Galería
                            </h2>

                            <button
                                onClick={() =>
                                    setGaleriaAbierta(false)
                                }
                                className="
                                    text-2xl
                                    text-gray-500
                                    w-10
                                    h-10
                                    flex
                                    items-center
                                    justify-center
                                "
                                aria-label="Cerrar galería"
                            >
                                ×
                            </button>

                        </div>

                        <div className="grid grid-cols-3 gap-2">

                            {fotosGaleria.map((foto) => (

                                <div
                                    key={foto.id}
                                    onClick={() =>
                                        setFotoSeleccionada(foto)
                                    }
                                    className="
                                        aspect-square
                                        rounded-xl
                                        overflow-hidden
                                        bg-gray-100
                                        flex
                                        items-center
                                        justify-center
                                        cursor-pointer
                                    "
                                >

                                    <img
                                        src={foto.thumbnail_url}
                                        alt={foto.nombre_archivo}
                                        className="
                                            max-w-full
                                            max-h-full
                                            object-contain
                                        "
                                    />

                                </div>

                            ))}

                        </div>

                    </div>

                )
            }

            {
                fotoSeleccionada && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            bg-black/90
                            flex
                            items-center
                            justify-center
                            p-4
                        "
                        onTouchStart={manejarTouchStart}
                        onTouchMove={manejarTouchMove}
                        onTouchEnd={manejarTouchEnd}
                    >

                        {/* Cerrar */}

                        <button
                            onClick={() =>
                                setFotoSeleccionada(null)
                            }
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
                                justify-center
                                z-20
                            "
                            aria-label="Cerrar fotografía"
                        >
                            ×
                        </button>

                        {/* Flecha izquierda */}

                        {
                            fotosNavegacion.length > 1 && (

                                <button
                                    onClick={anteriorFoto}
                                    className="
                                        absolute
                                        left-2
                                        sm:left-5
                                        top-1/2
                                        -translate-y-1/2
                                        z-20
                                        w-12
                                        h-12
                                        sm:w-14
                                        sm:h-14
                                        rounded-full
                                        bg-black/40
                                        hover:bg-black/60
                                        text-white
                                        text-3xl
                                        flex
                                        items-center
                                        justify-center
                                        transition
                                    "
                                    aria-label="Fotografía anterior"
                                >
                                    ‹
                                </button>

                            )
                        }

                        {/* Fotografía */}

                        <img
                            src={fotoSeleccionada.thumbnail_url}
                            alt={fotoSeleccionada.nombre_archivo}
                            className="
                                max-w-full
                                max-h-[85vh]
                                object-contain
                                rounded-lg
                                select-none
                            "
                            draggable={false}
                        />

                        {/* Flecha derecha */}

                        {
                            fotosNavegacion.length > 1 && (

                                <button
                                    onClick={siguienteFoto}
                                    className="
                                        absolute
                                        right-2
                                        sm:right-5
                                        top-1/2
                                        -translate-y-1/2
                                        z-20
                                        w-12
                                        h-12
                                        sm:w-14
                                        sm:h-14
                                        rounded-full
                                        bg-black/40
                                        hover:bg-black/60
                                        text-white
                                        text-3xl
                                        flex
                                        items-center
                                        justify-center
                                        transition
                                    "
                                    aria-label="Fotografía siguiente"
                                >
                                    ›
                                </button>

                            )
                        }

                        {/* Descargar */}

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
                                shadow-lg
                                z-20
                            "
                        >
                            Descargar
                        </a>

                    </div>

                )
            }

        </section>

    );
}