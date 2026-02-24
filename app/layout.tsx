import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { LandingNodeBackground } from "./components/landing-node-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cadence Engineer",
  description: "Cadence Engineer web app",
  icons: {
    icon: [{ url: "/cadence-logo.svg", type: "image/svg+xml" }],
    shortcut: "/cadence-logo.svg",
    apple: "/cadence-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} relative flex min-h-screen flex-col antialiased`}>
        <LandingNodeBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
