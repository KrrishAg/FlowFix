"use client";

import { BACKEND_URL } from "@/app/config";
import Modal from "@/components/Modal";
import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useEffect, useState } from "react";

function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState([]);
  const [availableTriggers, setAvailableTriggers] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/action/available`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => setAvailableActions(res.data.availableActions));
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => setAvailableTriggers(res.data.availableTriggers));
  }, []);

  return { availableActions, availableTriggers };
}

export default function Page() {
  //get avl actions and triggers from backend
  const { availableActions, availableTriggers } =
    useAvailableActionsAndTriggers();

  //which trigger is chosen
  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
  }>();

  //which actions are chosen by the user
  const [selectedActions, setSelectedActions] = useState<
    {
      idx: number;
      availableActionId: string;
      availableActionName: string;
      metadata: unknown;
    }[]
  >([]);

  //to see which zapbox has been selected
  const [modelIndex, setModelIndex] = useState<null | number>(null);

  function addAction() {
    setSelectedActions((a) => [
      ...a,
      {
        idx: a.length + 2,
        availableActionId: "",
        availableActionName: "",
        metadata: {},
      },
    ]);
  }

  function changeModelLayout(
    params: null | { name: string; id: string; metadata: any }
  ) {
    if (params === null) {
      //clciked on cross
    } else if (modelIndex === 1) {
      //chose a trigger
      setSelectedTrigger({
        id: params.id,
        name: params.name,
      });
    } else if (modelIndex != undefined) {
      //chose an action, so chnaging its data in the array, its at idx-1
      setSelectedActions((a) => {
        const newActs = [...a];
        newActs[modelIndex - 2] = {
          idx: modelIndex,
          availableActionId: params.id,
          availableActionName: params.name,
          metadata: params.metadata,
        };
        return newActs;
      });
    }
    setModelIndex(null);
  }

  return (
    <div>
      {/* <Appbar /> */}
      <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
        <div className="flex justify-center w-full">
          <ZapCell
            onClick={() => {
              setModelIndex(1);
            }}
            name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"}
            index={1}
          />
        </div>
        <div className="w-full pt-2 pb-2">
          {selectedActions.map((action, index) => (
            <div key={index} className="pt-2 flex justify-center">
              <ZapCell
                onClick={() => {
                  setModelIndex(action.idx);
                }}
                name={
                  action.availableActionName
                    ? action.availableActionName
                    : "Action"
                }
                index={action.idx}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div>
            <PrimaryButton onClick={addAction}>
              <div className="text-2xl">+</div>
            </PrimaryButton>
          </div>
        </div>
      </div>
      {modelIndex && (
        <Modal
          index={modelIndex}
          onSelect={changeModelLayout}
          availableItems={
            modelIndex === 1 ? availableTriggers : availableActions
          }
        />
      )}
    </div>
  );
}
