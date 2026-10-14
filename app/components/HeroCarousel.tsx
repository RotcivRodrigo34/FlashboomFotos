"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type HeroCarouselProps = {
  imagenes: string[];
};

export default function HeroCarousel({ imagenes }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Si el evento no tiene portadas, no mostrar el carrusel.
  if (imagenes.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex py-2">
          {imagenes.map((imagen, index) => (
            <div
              key={`${imagen}-${index}`}
              className="flex-[0_0_82%] px-1"
            >
              <div
                className={`
                  relative
                  h-[200px]
                  rounded-[24px]
                  overflow-hidden
                  shadow-xl
                  transition-all
                  duration-500
                  ${
                    selectedIndex === index
                      ? "scale-100"
                      : "scale-90 opacity-70"
                  }
                `}
              >
                <Image
                  src={imagen}
                  alt="Portada del evento"
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {imagenes.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {imagenes.map((_, index) => (
            <div
              key={index}
              className={`
                transition-all
                duration-300
                rounded-full
                ${
                  selectedIndex === index
                    ? "w-8 h-2 bg-violet-600"
                    : "w-2 h-2 bg-gray-300"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}