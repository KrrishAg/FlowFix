import Image from "next/image";

// export const FlowCell = ({
//   name,
//   index,
//   onClick,
//   image,
//   removeAction,
// }: {
//   name?: string;
//   index: number;
//   onClick: () => void;
//   image: string;
//   removeAction?: (index: number) => void;
// }) => {
//   return (
//     <div className={`flex gap-3 items-center ${removeAction ? "pl-13" : ""}`}>
//       <div
//         onClick={onClick}
//         className="border border-blue-400 py-8 px-8 flex w-[300px] cursor-pointer rounded-lg"
//       >
//         <div className="flex text-xl gap-2 items-center">
//           <div className="font-bold">{index}.</div>
//           <div>
//             {image.length > 0 && (
//               <Image
//                 src={image}
//                 alt=""
//                 width={10}
//                 height={10}
//                 className="w-10 rounded-2xl"
//               />
//             )}
//           </div>
//           <div> {name}</div>
//         </div>
//       </div>
//       {removeAction && (
//         <div
//           onClick={() => removeAction(index)}
//           className="cursor-pointer hover:bg-indigo-500 hover:text-white p-2 rounded"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="size-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18 18 6M6 6l12 12"
//             />
//           </svg>
//         </div>
//       )}
//     </div>
//   );
// };

export const FlowCell = ({
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
    <div className="relative flex items-center group">
      <button
        onClick={onClick}
        className="flex items-center w-full max-w-xs sm:max-w-sm p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-500"
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3 border border-gray-300">
          <span className="font-bold text-indigo-600">{index}</span>
        </div>
        <div className="flex-grow flex items-center space-x-3 min-w-0">
          {image ? (
            <Image
              src={image}
              alt={name || "Icon"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-md"
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-gray-200"></div>
          )}
          <span className="text-gray-700 font-medium truncate flex-grow text-left">
            {name || (index === 1 ? "Choose Trigger" : "Choose Action")}
          </span>
        </div>
      </button>
      {removeAction && (
        <button
          onClick={() => removeAction(index)}
          title="Remove Action"
          className="absolute -right-10 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-full "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
