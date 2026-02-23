import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./components/footer";

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
      <body className="flex min-h-screen flex-col antialiased">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
