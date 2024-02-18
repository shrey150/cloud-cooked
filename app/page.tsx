"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%]">
      <h1 className="text-5xl font-extrabold">
        am i cooked? ☁🛫️️
      </h1>
      <p>
        share why you&apos;re cooked lol.
      </p>
      <Button variant="secondary" className="w-full">I haven&apos;t booked my flight yet</Button>
      <Button
        variant="secondary"
        className="w-full"
      >
        I missed my flight
      </Button>
      <Button variant="secondary" className="w-full">
        My flight got cancelled
      </Button>
      <div className="flex flex-row gap-2.5 sm:max-w-[100%] md:max-w-[100%] lg:max-w-[100%]">
        <Button variant="default" className="w-full">
          Back
        </Button>
        <Button variant="secondary" className="w-full">
          Next
        </Button>
      </div>
    </div>
  );
}
