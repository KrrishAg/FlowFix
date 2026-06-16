"use client";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { FeaturesList } from "@/components/FeaturesList";
import { Hero } from "@/components/Hero";
import { WorkflowList } from "@/components/WorkflowList";

// Main Landing Page Component
export default function Home() {
  // Use simple navigation for landing page buttons
  const navigate = (path: string) => {
    window.location.href = path; // Simple redirect
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main>
        <Hero />

        <FeaturesList />
        <WorkflowList />

        <section className="py-16 md:py-24 bg-indigo-700 text-white text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Automate Your Work?
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              Sign up for FlowFix today and start building your first automated
              workflow in minutes.
            </p>
            <PrimaryButton
              onClick={() => navigate("/signup")}
              size="big"
              className="bg-white text-indigo-600 hover:bg-gray-100" // Inverted colors for dark background
            >
              Get Started Free Now
            </PrimaryButton>
          </div>
        </section>
      </main>
    </div>
  );
}
