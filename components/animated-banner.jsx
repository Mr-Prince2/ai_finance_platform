import React from "react";

export default function AnimatedBanner() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 px-4 sm:px-6 animate-float-hero">
      {/* Decorative Cyberpunk Background Glows */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-screen filter animate-pulse-glow" />
      <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter animate-pulse-glow" />

      {/* Main Glassmorphic Dashboard Window Wrapper */}
      <div className="relative border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] overflow-hidden aspect-[16/9] flex flex-col">
        
        {/* Mock Window Top Bar */}
        <div className="h-10 border-b border-slate-800/60 bg-slate-950/40 flex items-center px-4 gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          <div className="h-4 w-32 bg-slate-800/50 rounded ml-4 max-sm:hidden" />
        </div>

        {/* Dashboard Frame Content */}
        <div className="flex-1 grid grid-cols-4 p-4 gap-4 overflow-hidden text-left">
          
          {/* Mock Sidebar (Hidden on mobile) */}
          <div className="col-span-1 border-r border-slate-800/40 pr-4 space-y-4 hidden md:block">
            <div className="h-8 bg-slate-800/70 rounded-lg w-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-800/40 rounded w-5/6" />
              <div className="h-4 bg-slate-800/40 rounded w-4/5" />
              <div className="h-4 bg-slate-800/40 rounded w-3/4" />
            </div>
          </div>

          {/* Core App View metrics */}
          <div className="col-span-4 md:col-span-3 space-y-4">
            
            {/* Cards row snapshot */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                <div className="h-5 bg-indigo-400/40 rounded w-3/4 animate-pulse" />
              </div>
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="h-3 bg-slate-800/60 rounded w-1/3" />
                <div className="h-5 bg-emerald-400/40 rounded w-2/3" />
              </div>
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                <div className="h-5 bg-rose-400/40 rounded w-5/6" />
              </div>
            </div>

            {/* Mock Chart Area Graph Grid Blocks */}
            <div className="border border-slate-800 bg-slate-950/20 rounded-xl p-4 h-40 flex items-end gap-2 sm:gap-4">
              <div className="bg-slate-800/60 rounded-t w-full h-[30%]" />
              <div className="bg-gradient-to-t from-indigo-600/40 to-indigo-500/80 rounded-t w-full h-[65%] transition-all duration-500 hover:h-[80%]" />
              <div className="bg-slate-800/60 rounded-t w-full h-[45%]" />
              <div className="bg-gradient-to-t from-purple-600/40 to-purple-500/80 rounded-t w-full h-[85%]" />
              <div className="bg-slate-800/60 rounded-t w-full h-[20%]" />
              <div className="bg-gradient-to-t from-indigo-600/40 to-indigo-500/80 rounded-t w-full h-[55%]" />
            </div>

            {/* Mock Recent Pipelines List */}
            <div className="space-y-2">
              <div className="h-3 bg-slate-800/60 rounded w-1/4 mb-3" />
              <div className="flex justify-between items-center p-2 rounded border border-slate-800/40 bg-slate-900/20">
                <div className="flex gap-2 items-center w-full">
                  <div className="w-6 h-6 rounded-full bg-slate-800" />
                  <div className="h-3 bg-slate-800/50 rounded w-1/3" />
                </div>
                <div className="h-3 bg-emerald-500/40 rounded w-12" />
              </div>
              <div className="flex justify-between items-center p-2 rounded border border-slate-800/40 bg-slate-900/20">
                <div className="flex gap-2 items-center w-full">
                  <div className="w-6 h-6 rounded-full bg-slate-800" />
                  <div className="h-3 bg-slate-800/50 rounded w-1/4" />
                </div>
                <div className="h-3 bg-rose-500/40 rounded w-16" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}