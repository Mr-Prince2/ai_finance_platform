"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-40 pb-20 px-4 bg-slate-950 text-slate-100 overflow-hidden">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Finances <br /> with Intelligence
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4 mb-16">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/Mr-Prince2/ai_finance_platform.git">
            <Button size="lg" variant="outline" className="px-8 border-slate-800 text-slate-300 hover:bg-slate-900 rounded-xl">
              GitHub Repo
            </Button>
          </Link>
        </div>

        {/* Dynamic Mockup Wrapper - Retaining Scroll Animation Logic */}
        <div className="hero-image-wrapper mt-5 md:mt-0 relative">
          
          {/* Ambient Blurred Vector Glows behind the code mockup */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 bg-purple-500/15 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" />

          {/* Core Animating Element */}
          <div ref={imageRef} className="hero-image max-w-5xl mx-auto transition-all duration-500 ease-out">
            <div className="relative border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden aspect-[16/9] flex flex-col">
              
              {/* Window Controls Top Bar */}
              <div className="h-10 border-b border-slate-800/60 bg-slate-950/40 flex items-center px-4 gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <div className="h-4 w-32 bg-slate-800/40 rounded ml-4 max-sm:hidden" />
              </div>

              {/* Grid Layout Dashboard Mockup Preview */}
              <div className="flex-1 grid grid-cols-4 p-4 gap-4 overflow-hidden text-left select-none">
                
                {/* Simulated Left Sidebar Component */}
                <div className="col-span-1 border-r border-slate-800/40 pr-4 space-y-4 hidden md:block">
                  <div className="h-8 bg-slate-800/60 rounded-xl w-full" />
                  <div className="space-y-2.5 pt-2">
                    <div className="h-4 bg-slate-800/30 rounded w-5/6" />
                    <div className="h-4 bg-slate-800/30 rounded w-4/5" />
                    <div className="h-4 bg-slate-800/30 rounded w-3/4" />
                  </div>
                </div>

                {/* Simulated Core View Port Context */}
                <div className="col-span-4 md:col-span-3 space-y-4 flex flex-col justify-between">
                  
                  {/* Summary Metric Component Nodes */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/30 space-y-2">
                      <div className="h-2.5 bg-slate-800/50 rounded w-1/2" />
                      <div className="h-4 bg-indigo-400/30 rounded w-3/4" />
                    </div>
                    <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/30 space-y-2">
                      <div className="h-2.5 bg-slate-800/50 rounded w-1/3" />
                      <div className="h-4 bg-emerald-400/30 rounded w-2/3" />
                    </div>
                    <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/30 space-y-2">
                      <div className="h-2.5 bg-slate-800/50 rounded w-1/2" />
                      <div className="h-4 bg-rose-400/30 rounded w-4/5" />
                    </div>
                  </div>

                  {/* Simulated Recharts Graphical Grid Canvas */}
                  <div className="border border-slate-800/80 bg-slate-950/10 rounded-xl p-4 flex-1 min-h-[140px] flex items-end gap-2 sm:gap-4">
                    <div className="bg-slate-800/40 rounded-t w-full h-[25%] transition-all duration-300 hover:bg-slate-800/60" />
                    <div className="bg-gradient-to-t from-indigo-600/30 to-indigo-500/60 rounded-t w-full h-[60%] transition-all duration-500 hover:scale-y-105" />
                    <div className="bg-slate-800/40 rounded-t w-full h-[40%]" />
                    <div className="bg-gradient-to-t from-purple-600/30 to-purple-500/60 rounded-t w-full h-[80%] transition-all duration-500 hover:scale-y-105" />
                    <div className="bg-slate-800/40 rounded-t w-full h-[15%]" />
                    <div className="bg-gradient-to-t from-indigo-600/30 to-indigo-500/60 rounded-t w-full h-[50%]" />
                  </div>

                  {/* Transaction Pipelines Activity Simulator */}
                  <div className="space-y-2 pt-1 hidden sm:block">
                    <div className="flex justify-between items-center p-2 rounded-lg border border-slate-800/30 bg-slate-900/10">
                      <div className="flex gap-2 items-center w-full">
                        <div className="w-5 h-5 rounded-full bg-slate-800/60" />
                        <div className="h-3 bg-slate-800/40 rounded w-1/4" />
                      </div>
                      <div className="h-3 bg-emerald-500/30 rounded w-12" />
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg border border-slate-800/30 bg-slate-900/10">
                      <div className="flex gap-2 items-center w-full">
                        <div className="w-5 h-5 rounded-full bg-slate-800/60" />
                        <div className="h-3 bg-slate-800/40 rounded w-1/3" />
                      </div>
                      <div className="h-3 bg-rose-500/30 rounded w-16" />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;