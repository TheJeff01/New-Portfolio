import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./lib/AuthProvider";
import { DataProvider } from "./lib/DataStore";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jeffthedev.vercel.app'),
  title: {
    default: "Jeff — Full-Stack Developer & Wordpress Developer",
    template: "%s | JeffTheDev",
  },
  description:
    "Multi-disciplinary Wordpress Developer and Full-Stack Developer based in Nigeria. Crafting pixel-perfect interfaces and robust, secure digital experiences.",
  keywords: [
    "Wordpress Developer",
    "Full-Stack Developer",
    "Portfolio",
    "Next.js",
    "React",
    "Nigeria",
  ],
  openGraph: {
    title: "Jeff — Full-Stack Developer & Wordpress Developer",
    description:
      "Multi-disciplinary creative bridging design and engineering. Crafting sleek, secure digital experiences.",
    url: "https://jeffthedev.vercel.app",
    siteName: "JeffTheDev",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/apple-icon.svg",
        width: 1200,
        height: 630,
        alt: "BluDevs Open Graph Image",
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "JeffTheDev — Wordpress & Full-Stack Developer",
    description: "Multi-disciplinary Full-Stack Developer and Wordpress Developer based in Nigeria.",
    images: ['/apple-icon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              {children}
              <Analytics />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
