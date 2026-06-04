import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, statsData } from "@/data/landing";
import HeroSection from "@/components/hero";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Hero Section - Elevated with dynamic spacing */}
      <HeroSection />

      {/* Stats Section - Responsive Grid with Glassmorphism */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center p-6 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm transition-all hover:bg-muted/50">
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features - Hover-Optimized Cards */}
      <section id="features" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Intelligent Finance at your fingertips
            </h2>
            <p className="text-muted-foreground text-lg">
              We combine AI with real-time data to give you insights that traditional banking misses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={index} className="group border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="mb-6 p-3 w-fit rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Optimistic Design */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10 blur-3xl rounded-full translate-y-1/2" />
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-b from-card to-background border border-border p-12 rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">Ready to Take Control?</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of users who have optimized their wealth using Kuber's AI-driven insights.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="px-10 py-7 text-lg rounded-full group">
                Start Free Trial 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;