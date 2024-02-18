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
        would you like the most cost-efficient or time-efficient route?
      </p>
      <Button variant="secondary" className="w-full">
        I haven’t booked my flight yet
      </Button>
    </div>
  );
}
