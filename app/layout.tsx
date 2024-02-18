import type { Metadata } from "next";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "check if your trip is still possible ☁️🛫️️",
  description: "don't get cooked...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ConvexClientProvider>
          <main className="p-2 h-full">
            <div className="bg-[url('/images/clouds.png')] bg-center bg-cover fixed top-0 left-0 bottom-0 right-0" />
            <div className="min-h-full h-full relative backdrop-blur bg-slate-500/10 text-white text-center">
              {children}
            </div>
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
