"use client";

import { useState } from "react";
import { useSessionId } from "convex-helpers/react/sessions";
import { Button } from "@/components/ui/button";

type FlightNumProps = {
  onSubmitFlightNumber(flightNumber: string): void;
}

export default function FlightNum({ onSubmitFlightNumber }: FlightNumProps) {
  const [flightNumber, setFlightNumber] = useState("");

  const handleClick = async () => {
    onSubmitFlightNumber(flightNumber);
  };

  return (
    <div className="flex flex-col gap-4 sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%]">
      <h4 className="text-lg">
        worried about a flight cancellation or delay? enter your flight number
      </h4>
      <input
        className="drop-shadow-lg p-3 rounded-xl backdrop-blur bg-black bg-opacity-10 focus:outline-none text-white placeholder:text-slate-300"
        type="text"
        placeholder="Enter your flight number"
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value)}
      />
      <Button
        onClick={handleClick}
        className="disabled:opacity-50 hover:opacity-75 border-1 drop-shadow-lg bg-gradient-to-r from-sky-500 to-indigo-500 p-2 rounded-xl"
        disabled={flightNumber === ""}
      >
        {flightNumber === "" ? "Please enter your flight number" : "tell me if i'm cooked"}
      </Button>
      <p className="text-sm">
        we’ll use ai to calculate the chance of cancellation and help you discover backup
        routings to ensure that you'll be <b>where you need to be, when you need to be there</b>.
      </p>
    </div>
  );
}
