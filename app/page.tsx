"use client";

import type { MouseEvent } from "react";
import { ArrowRight, Upload, Brain, BarChart3, Citrus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HiroshimaDropZone from "@/components/HiroshimaDropZone";

export default function Home() {
  const handleScrollToInfo = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("Info");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Individual Education Plan (IEP) Scanning
          </h1>
          <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400 text-lg sm:text-xl">
            Scan, analyze, and organize IEPs efficiently. Gain actionable insights and save valuable time.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/scans" passHref>
              <Button className="px-6 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started <ArrowRight className="inline ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#Info" onClick={handleScrollToInfo} passHref>
              <Button variant="outline" className="px-6 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex justify-center w-full">
      <div className="w-full max-w-md">
        <HiroshimaDropZone />
      </div>
    </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Transform how therapists handle IEPs. AI-powered insights for faster, smarter decision-making.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<Upload className="h-10 w-10 text-blue-600" />} title="Easy Uploads" description="Drag and drop IEPs or upload PDFs for instant scanning and secure processing." />
            <FeatureCard icon={<Brain className="h-10 w-10 text-green-600" />} title="AI + OCR Analysis" description="Automatically extract goals, progress notes, and key insights with precision." />
            <FeatureCard icon={<BarChart3 className="h-10 w-10 text-purple-600" />} title="Therapist Insights" description="Generate progress reports and actionable insights to support therapy planning." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">Pricing</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Flexible plans that grow with your needs.</p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <PricingCard tier="Starter" price="$9" details={["50 IEP scans per month", "AI-powered analysis", "Basic reports"]} />
            <PricingCard tier="Pro" price="$29" highlight details={["500 IEP scans per month", "Advanced AI + OCR insights", "Team collaboration tools", "Export detailed reports"]} />
            <PricingCard tier="Enterprise" price="$99" details={["Unlimited IEP scans", "Priority support", "Custom integrations", "Admin dashboard & analytics"]} contact />
          </div>
        </div>
      </section>

      {/* Info */}
      <section id="Info" className="py-20">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Our AI-driven platform ensures accuracy, efficiency, and simplicity so you can focus on supporting students effectively.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <Citrus className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold">Tangerina</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 md:mt-0">
            Tangerina — the smarter way to manage your students.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Feature Card
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 text-center space-y-4">
      <div className="flex justify-center">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

// Pricing Card
function PricingCard({ tier, price, details, highlight = false, contact = false }: { tier: string; price: string; details: string[]; highlight?: boolean; contact?: boolean }) {
  return (
    <div className={`p-8 rounded-2xl shadow-md border ${highlight ? "border-blue-500 bg-blue-50 dark:bg-gray-800" : "bg-white dark:bg-gray-800"} hover:shadow-lg transition transform hover:-translate-y-2 text-center space-y-4`}>
      <h3 className={`text-xl font-semibold ${highlight ? "text-blue-600" : ""}`}>{tier}</h3>
      <p className="text-4xl font-bold">{price}<span className="text-lg">/mo</span></p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
        {details.map((d, i) => <li key={i}>✔ {d}</li>)}
      </ul>
      <Button className="mt-6 w-full">{contact ? "Contact Sales" : `Choose ${tier}`}</Button>
    </div>
  );
}
