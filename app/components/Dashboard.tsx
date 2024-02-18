"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import lolCooked from '../public/images/lolCooked.png';
import Image from 'next/image';
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function Dashboard() {

  return (
    <div className="min-h-screen text-white">
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold">am i cooked?</h1>
      </header>
      <main className="px-6 py-4">
        <h2 className="text-4xl font-bold mb-6">Find a way to Ann Arbor, Michigan</h2>
        <Tabs className="mb-6">
          <TabsList className="bg-black bg-opacity-5 rounded-lg">
          <TabsTrigger value="flights" className="text-white rounded-lg">Upcoming flights</TabsTrigger>
          <TabsTrigger value="airports" className="rounded-lg text-white">Nearby airports</TabsTrigger>
          <TabsTrigger value="transit" className="rounded-lg text-white">Public transit options</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
        <section className="bg-[#000] bg-opacity-5 p-6 rounded-lg items-start">
          <h3 className="text-2xl font-semibold mb-4">Upcoming flights</h3>
          <div className="space-y-4" />
          <div className="flex justify-between mt-6">
            <Button variant="outline">Back</Button>
            <Button>Next</Button>
          </div>
        </section>
      </main>
    </div>
  );
}