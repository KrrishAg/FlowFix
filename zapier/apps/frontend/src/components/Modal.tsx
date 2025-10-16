"use client";

import Image from "next/image";
import { useState } from "react";
import { Email } from "./selectors/Email";
import { Solana } from "./selectors/Solana";

export default function Modal({
  index,
  onSelect,
  availableItems,
}: {
  index: number;
  onSelect: (
    params: null | { name: string; id: string; metadata: any; image: string }
  ) => void;
  availableItems: { id: string; name: string; image: string }[];
}) {
  const [step, setStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    name: string;
  }>();

  const isTrigger = index === 1;

  return (
    <div
      id="static-modal"
      data-modal-backdrop="static"
      className="flex backdrop-blur-xs overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {index === 1 ? (
                <div>Select Trigger</div>
              ) : (
                <div>Select Action</div>
              )}
            </h3>
            <button
              onClick={() => onSelect(null)}
              type="button"
              className="cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="static-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-5 flex flex-col gap-5">
            {/* //render the first modal of chooisngg the trigger/action */}
            {step === 0 && (
              <div>
                {availableItems.map(({ id, name, image }) => {
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-5 p-2 border cursor-pointer h-15 hover:bg-slate-200"
                      onClick={() => {
                        if (isTrigger) {
                          onSelect({ id, name, image });
                        } else {
                          setStep((s) => s + 1);
                          setSelectedAction({ id, name });
                          onSelect({ id, name, image });
                        }
                      }}
                    >
                      <Image
                        src={image}
                        alt=""
                        width={10}
                        height={10}
                        className="w-10 rounded-2xl"
                      />
                      <p className="text-lg">{name}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* if next step, checked by step variable, and matches email */}
            {step === 1 && selectedAction?.id === "email" && (
              <div>
                <Email />
              </div>
            )}

            {/* if next step, checked by step variable, and matches solana */}
            {step === 1 && selectedAction?.id === "send-sol" && (
              <div>
                <Solana />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
