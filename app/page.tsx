"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Dashboard from "./components/Dashboard";
import FlightNum from "./components/FlightNum";

export default function Home() {
  const [showFlightNum, setShowFlightNum] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const handleFlightNumSubmit = (showDashboard: boolean, showFlightNum: boolean) => {
    setShowDashboard(showDashboard);
    setShowFlightNum(showFlightNum);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-5xl font-extrabold">
        am i cooked? ☁🛫️️
      </h1>
      {showFlightNum && <FlightNum onSubmit={handleFlightNumSubmit} />}
      {showDashboard && <Dashboard />}
    </div>
  );
}
