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
  const [token, setToken] = useState<string | null>(null);
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
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
    };

    syncAuth();

    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center h-16 px-10">
        {/* Left Part*/}
        <div className="flex-shrink-0 flex items-center">
          <Link
            href="/"
            className="text-4xl font-black text-indigo-600 hover:text-indigo-800 transition"
          >
            FlowFix
          </Link>
        </div>

        {/* Right Part*/}
        <div className="flex items-center space-x-4">
          {token ? (
            // Logged In State
            <>
              <span className="text-lg text-gray-700 hidden sm:block">
                Hello,{" "}
                <span className="font-semibold text-gray-900">
                  {name || "User"}
                </span>
              </span>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md text-base transition"
              >
                Dashboard
              </Link>
              <PrimaryButton
                onClick={handleLogout}
                className="bg-blue-700 text-white"
              >
                Logout
              </PrimaryButton>
            </>
          ) : (
            // Logged Out State
            <>
              <LinkButton onClick={() => router.push("/login")}>
                Login
              </LinkButton>
              <PrimaryButton
                onClick={() => router.push("/signup")}
                className="bg-blue-700 text-white"
              >
                Sign Up Free
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
