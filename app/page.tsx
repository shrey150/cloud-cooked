"use client";

import { useRouter, useSearchParams } from 'next/navigation'
import FlightNum from "./components/FlightNum";

export default function Home() {
  const searchParams = useSearchParams()
  const simpleMode = (searchParams.get('simple-mode') ?? "") === 'true';
  const router = useRouter();
  const handleFlightNumSubmit = (flightNumber: string) => {
    router.push(`/fetch-ai?flight-number=${flightNumber}&simple-mode=${simpleMode}`)
  };

  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <h1 className="text-5xl font-extrabold">
        am i cooked? ☁🛫️️
      </h1>
      <FlightNum onSubmitFlightNumber={handleFlightNumSubmit} />
    </div>
  );
}
