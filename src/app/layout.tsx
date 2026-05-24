import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AVIDAN | Music Composer for Film, TV & Commercials",
  description: "Award-winning music composer creating cinematic soundscapes for film, television, commercials, and visual media.",
  keywords: ["music composer", "film scoring", "TV music", "commercial music", "sound design"],
  authors: [{ name: "AVIDAN" }],
  openGraph: {
    title: "AVIDAN | Music Composer for Film, TV & Commercials",
    description: "Award-winning music composer creating cinematic soundscapes for film, television, commercials, and visual media.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${syne.variable}`}>
      <body className="font-syne antialiased min-h-screen bg-zinc-950 text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}