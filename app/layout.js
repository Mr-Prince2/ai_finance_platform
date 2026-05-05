import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kuber",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {/* 1. Added "dark" class and color-scheme style */}
      <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        {/* 2. Added bg-background and text-foreground to body */}
        <body className={`${inter.className} bg-background text-foreground`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          {/* 3. Replaced hardcoded light colors with theme variables */}
          <footer className="border-t border-border py-12">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>Made with 💗 by Prince</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}