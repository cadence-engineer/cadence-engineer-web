import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cadence Engineer",
  description: "Cadence Engineer web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
