"use client";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        username: email,
        password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("authChange")); // Notify Appbar
        router.push("/");
      }
    } catch (err: any) {
      console.error("Signin error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to FlowFix
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <div className="rounded-md shadow-sm -space-y-px">
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
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div>
            <PrimaryButton onClick={handleSignIn} size="big" className="bg-blue-700 text-white">
              {loading ? "Signing In..." : "Sign In"}
            </PrimaryButton>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {`Don't have an account?`}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
