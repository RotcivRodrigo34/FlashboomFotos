"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const slides = [
  "/XV.png",
  "/XV.png",
  "/XV.png",
];

export default function HeroCarousel() {

  const [emblaRef, emblaApi] = useEmblaCarousel({

    align: "center",

    loop: true,

    dragFree: false

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

  }, [emblaApi, onSelect]);

  return (

    <section>

      <div

        className="overflow-hidden"

        ref={emblaRef}

      >

       <div className="flex py-2">

          {

            slides.map((imagen, index) => (

              <div

                key={index}

                className="flex-[0_0_82%] px-1"

              >

                <div

                  className={

                    `

                    relative

                    h-[150px]

                    rounded-[24px]

                    overflow-hidden

                    shadow-xl

                    transition-all

                    duration-500

                    ${

                      selectedIndex===index

                      ?

                      "scale-100"

                      :

                      "scale-90 opacity-70"

                    }

                    `

                  }

                >

                  <Image

                    src={imagen}

                    alt="Evento"

                    fill

                    priority

                    className="object-cover"

                  />

                </div>

              </div>

            ))

          }

        </div>

      </div>

      <div className="flex justify-center gap-2 mt-2">

        {

          slides.map((_,index)=>(

            <div

              key={index}

              className={

                `

                transition-all

                duration-300

                rounded-full

                ${

                  selectedIndex===index

                  ?

                  "w-8 h-2 bg-violet-600"

                  :

                  "w-2 h-2 bg-gray-300"

                }

                `

              }

            />

          ))

        }

      </div>

    </section>

  );

}