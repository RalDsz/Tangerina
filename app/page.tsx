"use client";

import type { MouseEvent } from "react";
import { ArrowRight, Upload, Brain, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Citrus } from "lucide-react";
export default function Home() {
  // Smooth scroll for in-page anchor
  const handleScrollToInfo = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("Info");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-blue-100 to-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Individual Education Plan (IEP) Scanning
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Scan, analyze, and organize your IEPs with AI-powered precision.
                Save time and gain insights from your educational data.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/scans" passHref>
                <Button
                  size="lg"
                  className="transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              {/* Smooth scroll on click */}
              <Link href="#Info" onClick={handleScrollToInfo} passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Upload / Drop Area */}
        <div className="mt-16 w-full flex justify-center">
          <div className="relative w-full max-w-3xl rounded-xl border-2 border-dashed border-gray-300 bg-white shadow-sm hover:shadow-md transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 p-10 text-center">
            <Upload className="h-10 w-10 mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold">Upload Your IEPs</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Drag & drop files here or click to browse. Our AI will scan,
              analyze, and organize them for you.
            </p>
            <div className="mt-6">
              <Button className="transition-all duration-300 hover:scale-105 hover:shadow-md">
                Choose File
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Features
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Our AI-powered platform transforms how therapists handle IEPs
                and supports collaboration across teams.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="p-8 rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Easy Uploads</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Drag and drop IEP documents or upload PDFs for instant scanning
                and secure processing.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <Brain className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">AI + OCR Analysis</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Automatically extract goals, progress notes, and key insights
                with advanced AI and OCR precision.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <BarChart3 className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Therapist Insights</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Generate progress reports and uncover actionable insights to
                support therapy planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Pricing</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Flexible plans that grow with your needs.
          </p>

          {/* Pricing Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Starter */}
            <div className="p-8 rounded-xl border bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <h3 className="text-xl font-semibold">Starter</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Perfect for individual therapists.
              </p>
              <p className="mt-4 text-4xl font-bold">$9<span className="text-lg">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✔ 50 IEP scans per month</li>
                <li>✔ AI-powered analysis</li>
                <li>✔ Basic reports</li>
              </ul>
              <Button className="mt-6 w-full">Choose Starter</Button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-xl border-2 border-blue-500 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-blue-600">Pro</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Best for small therapy teams.
              </p>
              <p className="mt-4 text-4xl font-bold">$29<span className="text-lg">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✔ 500 IEP scans per month</li>
                <li>✔ Advanced AI + OCR insights</li>
                <li>✔ Team collaboration tools</li>
                <li>✔ Export detailed reports</li>
              </ul>
              <Button className="mt-6 w-full">Choose Pro</Button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-xl border bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <h3 className="text-xl font-semibold">Enterprise</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Scalable for schools & organizations.
              </p>
              <p className="mt-4 text-4xl font-bold">$99<span className="text-lg">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✔ Unlimited IEP scans</li>
                <li>✔ Priority support</li>
                <li>✔ Custom integrations</li>
                <li>✔ Admin dashboard & analytics</li>
              </ul>
              <Button className="mt-6 w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section id="Info" className="py-20">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Why Choose Us?</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-driven platform ensures accuracy, efficiency, and simplicity
            so you can focus on what matters most—supporting students.
          </p>
        </div>
      </section>
      {/* Footer */}
{/* Footer */}

<footer className="border-t border-gray-200 dark:border-gray-800">
  <div className="container px-4 md:px-6 py-8 mx-auto">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Citrus className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-semibold">Tangerina</span>
      </div>
      <div className="mt-4 md:mt-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tangerina. The smarter way to manage your Students.
        </p>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
}
