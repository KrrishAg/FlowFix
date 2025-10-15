import Image from "next/image";

export const ZapCell = ({
  name,
  index,
  onClick,
  image,
}: {
  name?: string;
  index: number;
  onClick: () => void;
  image: string;
}) => {
  return (
    <div
      onClick={onClick}
      className="border border-black py-8 px-8 flex w-[300px]  cursor-pointer"
    >
      <div className="flex text-xl gap-2">
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
  );
};
