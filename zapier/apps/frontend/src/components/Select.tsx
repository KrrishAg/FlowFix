export const Select = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-gray-900">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {options.map((val, idx) => (
          <option key={idx} value={val} className="text-base">
            {val}
          </option>
        ))}
      </select>
    </div>
  );
};
