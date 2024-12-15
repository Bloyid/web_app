import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { AuthProvider } from "@/context/auth";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bloyid",
  description: "Real-time chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased bg-[#1a1a1a]`}>
        <AuthProvider>
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] text-white min-h-screen">
            <Providers>{children}</Providers>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}