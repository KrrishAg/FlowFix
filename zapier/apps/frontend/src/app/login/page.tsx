"use client";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div>
      {/* <Appbar /> */}
      <div className="flex justify-center">
        <div className="flex pt-8 max-w-4xl">
          <div className="flex-1 pt-20 px-4">
            <div className="font-semibold text-3xl pb-4">
              Join millions worldwide who automate their work using Zapier.
            </div>
            <div className="flex flex-col gap-4">
              <CheckFeature label={"Easy setup, no coding required"} />
              <CheckFeature label={"Free forever for core features"} />
              <CheckFeature label={"14-day trial of premium features & apps"} />
            </div>
          </div>
          <div className="flex flex-col flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
            <Input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              label={"Email"}
              placeholder="Your Email"
            ></Input>
            <Input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label={"Password"}
              placeholder="Password"
              isPass
            ></Input>
            <div className="pt-4">
              <PrimaryButton
                onClick={async () => {
                  const res = await axios.post(
                    `${BACKEND_URL}/api/v1/user/signin`,
                    {
                      username: email,
                      password,
                    }
                  );
                  localStorage.setItem("token", res.data.token);
                  window.dispatchEvent(new Event("authChange"));
                  router.push("/dashboard");
                }}
                size="big"
              >
                Login
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
