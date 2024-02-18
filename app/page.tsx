"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";

export default function Home() {
  const queryFetchAi = useAction(api.functions.queryFetchAi);

  return (
    <main>
      <div className="bg-[url('/images/clouds.png')] bg-center bg-cover fixed top-0 left-0 bottom-0 right-0" />
      <div className="min-h-screen flex items-center justify-center w-full relative p-24 backdrop-blur bg-slate-500/10 text-white text-center">
        <div className="flex flex-col gap-4 md:max-w-[33%]">
          <h1 className="text-5xl font-extrabold">
            am i cooked?
          </h1>
          <p>
            Enter your flight number, and we&apos;ll help
            you discover backup plans to ensure that you
            can make it happen.
          </p>
          <input
            className="drop-shadow-lg p-3 rounded-xl backdrop-blur bg-white/30 focus:outline-none text-black"
            type="text"
            placeholder="Enter your flight number"
          />
          <button className="drop-shadow-lg bg-gradient-to-r from-sky-500 to-indigo-500 p-2 rounded-xl">Submit</button>
        </div>
      </div>
    </main>
  );
}
