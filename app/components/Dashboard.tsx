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
import { Checkbox } from "@/components/ui/checkbox"

export default function Dashboard( {onSubmit}) {
  const [isChecked, setIsChecked] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showFlightNum, setShowFlightNum] = useState(false);


  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };  

  const handleBackClick = async () => {
    setShowDashboard(!showDashboard);
    setShowFlightNum(!showFlightNum);
    console.log('clicked')
    onSubmit(showDashboard)
    onSubmit(showFlightNum)

  };
  return (
    <div className="min-h-screen text-white">
      <main className="px-8 py-12">
        <div className="flex flex-col space-y-1 mb-12">
          <h2 className="text-3xl font-bold">Find a better flight to</h2>
          <h2 className="text-5xl font-bold">Ann Arbor, Michigan</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <Card className={`bg-[#000] bg-opacity-40 ${isChecked ? 'border-blue-400 border-2' : 'border-gray-400'} rounded-xl`}>
              <CardContent>
                <div className="flex justify-between content-start mb-1 py-5">
                  <div className="content-start">
                    <div className="text-sm text-white content-start text-left">Leaving from</div>
                    <div className="text-2xl font-bold text-left text-white">SFO</div>
                    <div className="text-sm text-white text-left">San Francisco</div>
                  </div>
                  {/* <Image src={lolCooked} alt="place"></Image> */}
                  <div>
                    <div className="text-sm text-white text-left">Going to</div>
                    <div className="text-2xl font-bold text-left text-white">DTW</div>
                    <div className="text-sm text-white text-left">Detroit</div>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <Badge className="bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-20 mb-4 space-x-2 px-4 py-1">
                    <div className="text-sm text-white">Flight status</div>
                    <div className="mb-4 bg-white bg-opacity-20"> </div>
                    <div className="text-sm text-green">Confirmed</div>
                  </Badge>
                  <Badge className="bg-[#FFF] bg-opacity-20 hover:bg-white hover:bg-opacity-20 mb-4 space-x-1 px-4 py-1">
                    <div className="text-sm text-[#d1bc35]">66%</div>
                    <div className="text-sm text-green">chance of delay</div>
                  </Badge>
                </div>

                <div className="flex items-left justify-between mb-4 bg-white bg-opacity-20 rounded-xl px-4 py-3">
                <Image src="/images/delta.png" alt="Logo" width={34} height={34} />
                  <div className="flex text-sm text-white text-left flex-col">
                    <div className="font-bold mb-2">8:30 AM - 4:50PM</div>
                    <div>United</div>
                  </div>
                  <div className="text-sm text-white text-left">
                    <div className="font-bold mb-2">5 hr 20 min</div>
                    <div>Nonstop</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">$797</div>
                    <div className="text-sm text-white">round trip</div>
                  </div>
                </div>
                <div className="flex items-center flex-row justify-between">


                </div>
              </CardContent>
              <CardFooter className="flex content-left flex-row justify-between">
                <Badge className="bg-[#000] bg-opacity-20 hover:bg-black hover:bg-opacity-20 mb-4 px-4 py-1">
                      <div className="text-sm text-white">You are 22 miles from SFO</div>
                </Badge>
                <div className="space-x-3">
                  <Button className="bg-transparent hover:text-[#fff] hover:bg-transparent px-0 py-0">Select flight</Button>
                  <Checkbox onClick={toggleCheckbox} className="ring-offset-white data-[state=checked]:text-white data-[state=checked]:bg-[#076AFF] rounded-full items-center "> </Checkbox>
                </div>
              </CardFooter>
            </Card>
            
          </div>
        
        </div>
        <div className="flex justify-between items-center mt-12 align-middle">
          <Button 
            onClick={handleBackClick}
            className="hover:opacity-75 drop-shadow-lg bg-[#fff] bg-opacity-20 px-12 rounded-xl"
          >Try new flight number</Button>
          <Button className="bg-[#fff] bg-opacity-100 hover:bg-[#11111] text-black px-12 rounded-xl">Confirm new flight</Button>
        </div>
        <div>
          
        </div>
      </main>
    </div>
  );
}