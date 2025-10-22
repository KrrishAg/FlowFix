"use client";

import { useState } from "react";

export const Input = ({
  label,
  placeholder,
  onChange,
  isPass = false,
}: {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPass?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <div className="text-sm pb-1 pt-2">
        <label className="text-base font-medium">{label}</label>
      </div>
      <input
        className="border rounded px-4 py-2 w-full border-black"
        type={isPass && !showPassword ? "password" : "text"}
        placeholder={placeholder}
        onChange={onChange}
      />

      {isPass && (
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
