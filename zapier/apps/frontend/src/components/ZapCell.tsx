import Image from "next/image";

export const ZapCell = ({
  name,
  index,
  onClick,
  image,
  removeAction,
}: {
  name?: string;
  index: number;
  onClick: () => void;
  image: string;
  removeAction?: (index: number) => void;
}) => {
  return (
    <div className={`flex gap-3 items-center ${removeAction ? "pl-13" : ""}`}>
      <div
        onClick={onClick}
        className="border border-black py-8 px-8 flex w-[300px] cursor-pointer"
      >
        <div className="flex text-xl gap-2 items-center">
          <div className="font-bold">{index}.</div>
          <div>
            {image.length > 0 && (
              <Image
                src={image}
                alt=""
                width={10}
                height={10}
                className="w-10 rounded-2xl"
              />
            )}
          </div>
          <div> {name}</div>
        </div>
      </div>
      {removeAction && (
        <div
          onClick={() => removeAction(index)}
          className="cursor-pointer hover:bg-gray-800 hover:text-white p-2 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
