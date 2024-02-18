"use client";

import { Button } from "@/components/ui/button";

export default function FlightNum() {
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
