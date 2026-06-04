import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Header = () => {
  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/60 backdrop-blur-md z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Animated Text Logo with Fade/Breathing Effect */}
        <Link 
          href="/" 
          className="flex items-center gap-2 select-none active:scale-95 transition-transform"
        >
          <span className="animate-logo-fade text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 font-sans">
            KUBER
          </span>
        </Link>

        {/* Action Group */}
        <div className="flex items-center gap-2 md:gap-4">
          <SignedIn>
            {/* Dashboard Link - Hidden on very small screens, visible on mobile/desktop */}
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            {/* Add Transaction - Primary CTA */}
            <Link href="/transaction/create">
              <Button className="bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all group">
                <PenBox className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <div className="flex items-center border-l border-border/40 pl-2 md:pl-4 gap-2 md:gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/5 rounded-full px-6">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>

            {/* Styled User Button to match theme */}
            <UserButton 
              appearance={{
                baseTheme: dark,
                elements: {
                  avatarBox: "w-9 h-9 border border-primary/20 hover:scale-105 transition-transform",
                  userButtonPopoverCard: "border border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl",
                  userButtonTrigger: "focus:shadow-none focus:ring-0",
                }
              }} 
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;