"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import lolCooked from '../public/images/lolCooked.png';
import plane from '../public/images/plane.png';
import Image from 'next/image';
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {

  return (
    <div className="min-h-screen text-white">
      <main className="px-8 py-12">
        <h2 className="text-5xl font-bold mb-12">Find a better flight to Ann Arbor, Michigan</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="bg-[#000] bg-opacity-30">
              <CardContent>
                <div className="flex justify-between items-center mb-4 p-5 border-gray-700">
                  <div>
                    <div className="text-sm text-white">Leaving from</div>
                    <div className="text-2xl font-bold">SFO</div>
                    <div className="text-sm text-white">San Francisco</div>
                  </div>
                  {/* <Image src={lolCooked} alt="place"></Image> */}
                  <div>
                    <div className="text-sm text-white">Going to</div>
                    <div className="text-2xl font-bold">DTW</div>
                    <div className="text-sm text-white">Detroit</div>
                  </div>
                </div>
                <Badge className="bg-[#FFF] bg-opacity-20 mb-4">
                  <div className="text-sm text-white">Flight status</div>
                  <div className="mb-4 bg-white bg-opacity-20"> </div>
                  <div className="text-sm text-green">Confirmed</div>
                </Badge>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    <div>8:30 AM - 4:50PM</div>
                    <div>5 hr 20 min</div>
                  </div>
                  <div className="text-sm">
                    <div>United</div>
                    <div>Nonstop</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">66% chance of delay</Badge>
                  <div className="text-xl font-bold text-white">$797</div>
                  <div className="text-sm text-white">round trip</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">Select flight</Button>
              </CardFooter>
            </Card>
            
          </div>
        
        </div>
        <div className="flex justify-between items-center mt-12">
          <Button className="hover:opacity-75 drop-shadow-lg bg-#fff bg-opacity-25 px-12 rounded-xl">Try new flight number</Button>
          <Button className="bg-[#fff] bg-opacity-100 hover:bg-[#11111] text-black px-12 rounded-xl">Confirm new flight</Button>
        </div>
        <div>
          
        </div>
      </main>
    </div>
  );
}