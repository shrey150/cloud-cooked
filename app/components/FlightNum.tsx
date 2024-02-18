"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useState } from "react";
import { useSessionId } from "convex-helpers/react/sessions";
import { Button } from "@/components/ui/button";
import Dashboard from "./Dashboard";

export default function FlightNum({ onSubmit }) {
  const [sessionId] = useSessionId();
  const initializeFetchAiSession = useAction(api.actions.initializeFetchAiSession);
  const getFetchAiResponse = useAction(api.actions.getFetchAiResponse);
  const [flightNumber, setFlightNumber] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFlightNum, setShowFlightNum] = useState(true);

  const handleClick = async () => {
    setShowDashboard(!showDashboard);
    setShowFlightNum(!showFlightNum);
    console.log('clicked')
    // await initializeFetchAiSession({
    //   sessionId,
    //   flightNumber,
    // });
    // const result = await getFetchAiResponse({ sessionId });
    // console.log(result)
    onSubmit(showDashboard)
    onSubmit(showFlightNum)

  };

  return (
    <div className="flex flex-col gap-4 sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%]">
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
      <Button
        onClick={handleClick}
        className="disabled:opacity-50 hover:opacity-75 drop-shadow-lg bg-gradient-to-r from-sky-500 to-indigo-500 p-2 rounded-xl"
        disabled={flightNumber === ""}
      >
        {flightNumber === "" ? "Enter your flight number" : "Submit"}
      </Button>
      {/* {showDashboard && <Dashboard />} */}
    </div>
  );
}
