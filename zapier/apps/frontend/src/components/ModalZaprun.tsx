"use client";

import { useState } from "react";
import axios from "axios";
import { HOOKS_URL } from "@/app/config";
import { jwtDecode } from "jwt-decode";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { EnhancedTextarea } from "./TextArea";

export default function ModalZaprun({
  zapId,
  onSelect,
}: {
  zapId: string;
  onSelect: () => void;
}) {
  //when action clicked, it stores these three fields which will later be used to call the onSelect function
  const [text, setText] = useState("");

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
              Write JSON to send to Backend
            </h3>
            <button
              onClick={onSelect}
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
            <div>
              {/* <textarea
                onChange={(e) => setText(e.target.value)}
                className="w-full h-50 px-3 py-1 text-lg my-4 border outline-0 border-red-400 focus:border-blue-400"
                /> */}

              <EnhancedTextarea setText={setText} />
              <PrimaryButton
                onClick={() => {
                  console.log(text);
                  axios.post(
                    `${HOOKS_URL}/hooks/catch/${jwtDecode(localStorage.getItem("token") as string).id}/${zapId}`,
                    JSON.parse(text),
                    {
                      headers: { Authorization: localStorage.getItem("token") },
                    }
                  );
                }}
              >
                Submit
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
