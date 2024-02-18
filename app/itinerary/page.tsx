"use client";

import { api } from '@/convex/_generated/api';
import { useSessionId } from 'convex-helpers/react/sessions.js';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import lolCooked from '../public/images/lolCooked.png';
import plane from '../public/images/plane.png';
import Image from 'next/image';
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
export default function Itinerary() {
    const destinationAirport = 'Ann Arbor, Michigan';

    return (
        <div className="p-24">
            <div className="flex flex-row space-x-2 mb-12">
            <h2 className="text-5xl font-bold">Your flight to</h2>
            <h2 className="text-5xl font-bold">{destinationAirport}</h2>
          </div>
          <AlertDialog>
            <AlertDialogTrigger className="bg-white rounded-xl text-black px-6 py-2">View airport conditions</AlertDialogTrigger>
            <AlertDialogContent className="bg-[#fff] bg-opacity-30">
            <AlertDialogHeader>
                <div className="flex flex-row justify-between">
                <AlertDialogTitle className="text-white">San Francisco</AlertDialogTitle>
                <AlertDialogCancel className="bg-[#fff] bg-opacity-30 rounded-full"><Image src="/images/x.png" alt="place" width={9} height={9}></Image></AlertDialogCancel>
                </div>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>

);
}

