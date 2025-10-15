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
      className="border border-black py-8 px-8 flex w-[300px] justify-center cursor-pointer"
    >
      <div className="flex text-xl">
        <div className="font-bold">{index}.</div>
        <div className="font-bold">
          <Image
            src={image}
            alt=""
            width={10}
            height={10}
            className="w-10 rounded-2xl"
          />
        </div>
        <div> {name}</div>
      </div>
    </div>
  );
};
