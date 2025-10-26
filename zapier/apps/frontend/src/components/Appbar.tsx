"use client";
import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import Link from "next/link";

export const Appbar = () => {
  const router = useRouter();
  // const [token, setToken] = useState(localStorage.getItem("token") || "");
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [, setToggle] = useState(true);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/user`, {
        headers: { Authorization: token },
      })
      .then((res) => setName(res.data.user.name));
  }, [token]);

  //adding an event listner, so as to trigger change in togle which will in turn re-render appbar
  useEffect(() => {
    // The function that runs when the doorbell rings
    const toggleFn = () => {
      setToggle((s) => !s);
    };

    // Listening for the 'authChange' event
    window.addEventListener("authChange", toggleFn);

    // Cleanup
    return () => {
      window.removeEventListener("authChange", toggleFn);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              FlowFix
            </Link>
          </div>

          {/* Nav Links/Actions */}
          <div className="flex items-center space-x-4">
            {token ? (
              // --- Logged In State ---
              <>
                <span className="text-sm text-gray-700 hidden sm:block">
                  Hello,{" "}
                  <span className="font-semibold text-gray-900">
                    {name || "User"}
                  </span>
                </span>
                {/* Add other nav links for logged-in users if needed */}
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md text-sm transition"
                >
                  Dashboard
                </Link>
                <PrimaryButton
                  onClick={handleLogout}
                  // className="py-1.5 px-3 text-sm"
                >
                  {" "}
                  {/* Smaller button */}
                  Logout
                </PrimaryButton>
              </>
            ) : (
              // --- Logged Out State ---
              <>
                {/* Optionally add marketing links like Pricing, Features */}
                <LinkButton onClick={() => router.push("/login")}>
                  Login
                </LinkButton>
                <PrimaryButton
                  onClick={() => router.push("/signup")}
                  // className="py-1.5 px-3 text-sm"
                >
                  Sign Up Free
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
