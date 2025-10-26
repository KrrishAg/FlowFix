"use client";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Hero = () => {
  const router = useRouter();
  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24 text-center bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Connect Your Apps. Automate Your Work.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          FlowFix empowers you to link your favorite tools and build automated
          workflows without writing a single line of code. Focus on what
          matters, let FlowFix handle the rest.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <PrimaryButton
            onClick={() => router.push("/signup")}
            size="big"
            className="w-full sm:w-auto bg-indigo-600 text-white"
          >
            Get Started Free
          </PrimaryButton>
        </div>
      </div>
      {/* Visual Element - Replacing the Video */}
      {/*  */}
      <AutomationAnimation />
    </section>
  );
};

const AutomationAnimation = () => {
  return (
    <div className="relative w-full max-w-xl h-64 md:h-80 lg:h-96 mx-auto overflow-hidden rounded-lg bg-gradient-to-br from-indigo-50 to-purple-100 shadow-lg border border-gray-200 mt-10 mb-10">
      {/* Basic representation of data flow/connection */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-500 rounded-full animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-purple-500 rounded-lg animate-spin-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-green-500 rounded-md animate-bounce-slow"></div>
      {/* Simple connecting lines (could be enhanced) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="30%"
          y1="30%"
          x2="50%"
          y2="50%"
          stroke="#a78bfa"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <line
          x1="50%"
          y1="50%"
          x2="70%"
          y2="70%"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin-slow {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: spin-slow 10s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};
