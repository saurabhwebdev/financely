import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Financly - Your Personal Finance Tracker",
  description: "Track your finances with style and ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`} style={{backgroundColor: 'white'}}>
        <Navbar />
        <main className="min-h-screen pt-16 bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
