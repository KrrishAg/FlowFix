"use client";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(""); // Clear previous errors
    setLoading(true);
    try {
      // 1. Sign up the user
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username: email, // Assuming backend expects 'username' for email
        password,
        name,
      });

      // 3. Store token, notify Appbar, and redirect
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("authChange")); // Notify Appbar
        router.push("/");
      } else {
        setError(
          "Signup successful, but failed to log in automatically. Please log in manually."
        );
        router.push("/login");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        {/* Left Side (Marketing) */}
        <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Automate Your Workflows with FlowFix
          </h2>
          <p className="text-indigo-800 mb-8">
            Connect your apps and automate tasks in minutes, no coding required.
          </p>
          <div className="space-y-4">
            <CheckFeature label={"Easy visual builder"} />
            <CheckFeature label={"Connect hundreds of apps"} />
            <CheckFeature label={"Start free, scale later"} />
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Get Started Free
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
          >
            <Input
              label={"Name"}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              type="text"
            />
            <Input
              onChange={(e) => setEmail(e.target.value)}
              label={"Email"}
              placeholder="you@example.com"
              type="email"
            />
            <Input
              onChange={(e) => setPassword(e.target.value)}
              label={"Password"}
              placeholder="••••••••"
              type="password"
            />

            {error && <p className="text-red-500 text-sm mt-2 mb-4">{error}</p>}

            <div className="mt-6">
              <PrimaryButton onClick={handleSignUp} size="big">
                {loading ? "Signing Up..." : "Sign Up"}
              </PrimaryButton>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
