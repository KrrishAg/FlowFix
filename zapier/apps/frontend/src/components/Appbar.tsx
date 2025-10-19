"use client";
import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";

export const Appbar = () => {
  const router = useRouter();
  // const [token, setToken] = useState(localStorage.getItem("token") || "");
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    if (token)
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
    <div className="flex border-b justify-between p-4">
      <div className="flex flex-col justify-center text-2xl font-extrabold">
        Zapier
      </div>
      {token ? (
        <div className="flex gap-6 items-center">
          <div className="text-lg">
            Hello, <span className="font-semibold">{name}</span>
          </div>
          <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
        </div>
      ) : (
        <div className="flex gap-6 items-center">
          <div className="text-lg">
            Hello, <span className="font-semibold">User</span>
          </div>
          <LinkButton
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </LinkButton>
          <PrimaryButton
            onClick={() => {
              router.push("/signup");
            }}
          >
            Signup
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
