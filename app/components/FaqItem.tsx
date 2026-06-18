"use client";

import { useState } from "react";

interface Props {
  question: string;
  answer: string;
}

export default function FaqItem({
  question,
  answer,
}: Props) {

  const [open, setOpen] = useState(false);

  return (

<div
className={`
rounded-3xl
border
${open ? "border-violet-500" : "border-violet-100"}
bg-white
overflow-hidden
shadow-md
hover:shadow-xl
hover:shadow-violet-200/40
transition-all
duration-500
`}>

      <button
        onClick={() => setOpen(!open)}
      className="
w-full
flex
justify-between
items-center
px-8
py-6
text-left">

        <h3 className="text-2xl font-bold">

          {question}

        </h3>

    <span
  className={`
  text-2xl
  transition-all
  duration-300
  ${open
    ? "rotate-180 text-violet-700"
    : "text-violet-400"}
  `}
>

  ⌄

</span>

      </button>

      <div
        className={`
        transition-all
        duration-500
        overflow-hidden
        ${open ? "max-h-96 pb-8 px-8" : "max-h-0"}
        `}
      >

        <p className="text-gray-500 leading-8">

          {answer}

        </p>

      </div>

    </div>
  );
}