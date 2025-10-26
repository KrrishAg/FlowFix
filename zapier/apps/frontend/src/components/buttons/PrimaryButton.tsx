import { ReactNode } from "react";

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "big" | "small";
  className?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-10 py-4"} ${className} cursor-pointer hover:shadow-md rounded-full text-center flex justify-center flex-col`}
    >
      {children}
    </div>
  );
};
