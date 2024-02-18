"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FlightNum() {
  const queryFetchAi = useAction(api.functions.queryFetchAi);
  const [flightNumber, setFlightNumber] = useState("");

  return (
    <div>
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
    </div>
  );
}
