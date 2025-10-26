export const Feature = ({
  title,
  subtitle,
  icon,
  size = "small",
}: {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  size?: string;
}) => (
  <div className="flex flex-col items-center text-center p-4">
    {icon && (
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-3">
        {icon}
      </div>
    )}
    <h3
      className={`${size === "small" ? "text-lg" : "text-xl"} font-semibold text-gray-800 mb-1`}
    >
      {title}
    </h3>
    <p
      className={`${size === "small" ? "text-sm" : "text-base"} text-gray-500`}
    >
      {subtitle}
    </p>
  </div>
);
