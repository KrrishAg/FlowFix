"use client";

import { useState } from "react";

export const Input = ({
  label,
  placeholder,
  onChange,
  type,
}: {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <div className="text-sm pb-1 pt-2">
        <label className="text-base font-medium">{label}</label>
      </div>
      <input
        className="border rounded px-4 py-2 w-full border-black"
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        onChange={onChange}
      />

      {type === "password" && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-1 top-[52%] cursor-pointer text-xl hover:bg-gray-100 p-1"
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      )}
    </div>
  );
};
