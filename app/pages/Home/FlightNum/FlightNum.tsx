"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FlightNum() {
  const queryFetchAi = useAction(api.functions.queryFetchAi);
  const [flightNumber, setFlightNumber] = useState("");

  return (
    <main>
      <div className="bg-[url('/images/clouds.png')] bg-center bg-cover fixed top-0 left-0 bottom-0 right-0" />
      <div className="min-h-screen flex items-center justify-center w-full relative p-6 sm:p-12 backdrop-blur bg-slate-500/10 text-white text-center">
        <div className="flex flex-col gap-4 sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%]">
          <h1 className="text-5xl font-extrabold">
            am i cooked?☁🛫️️
          </h1>
          <p>
            enter your flight number, and we’ll help you discover backup plans to ensure that you can make it happen.
          </p>
          <input
            className="drop-shadow-lg p-3 rounded-xl backdrop-blur bg-white/80 focus:outline-none text-black"
            type="text"
            placeholder="Enter your flight number"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
          />
          <button
            onClick={() => queryFetchAi({
              flightNumber,
            })}
            className="disabled:opacity-50 hover:opacity-75 drop-shadow-lg bg-gradient-to-r from-sky-500 to-indigo-500 p-2 rounded-xl"
            disabled={flightNumber === ""}
          >
            {flightNumber === "" ? "Enter your flight number" : "Submit"}
          </button>
          <div className="flex flex-row gap-2.5 sm:max-w-[100%] md:max-w-[100%] lg:max-w-[100%]">
            <Button variant="default" className="w-full">Back</Button>
            <Button variant="secondary" className="w-full">Next</Button>
          </div>


        </div>
      </div>
    </main>
  );
}
