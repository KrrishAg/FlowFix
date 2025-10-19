"use client";

import { BACKEND_URL } from "@/app/config";
import Modal from "@/components/Modal";
import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//the type of data returned by the backend, got from postman
interface Action {
  id: string;
  zapId: string;
  actionId: string;
  sortOrder: number;
  metadata: JSON;
  AvailableAction: {
    id: string;
    name: string;
    image: string;
  };
}
[];

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
  const { zapid } = useParams();
  const router = useRouter();

  //get avl actions and triggers from backend
  const { availableActions, availableTriggers } =
    useAvailableActionsAndTriggers();

  //which trigger is chosen
  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
    image: string;
  }>();

  //which actions are chosen by the user
  const [selectedActions, setSelectedActions] = useState<
    {
      idx: number;
      availableActionId: string;
      availableActionName: string;
      availableActionImage: string;
      metadata: unknown;
    }[]
  >([]);

  //to see which zapbox has been selected
  const [modelIndex, setModelIndex] = useState<null | number>(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap/${zapid}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => res.data)
      .then((res) => {
        console.log(res.zap);
        setSelectedTrigger(res.zap.trigger.AvailableTrigger);
        setSelectedActions(
          res.zap.actions.map((act: Action, idx: number) => ({
            idx: idx + 2,
            availableActionId: act.AvailableAction.id,
            availableActionName: act.AvailableAction.name,
            availableActionImage: act.AvailableAction.image,
            metadata: act.metadata,
          }))
        );
      });
  }, [zapid]);

  function addAction() {
    setSelectedActions((a) => [
      ...a,
      {
        idx: a.length + 2,
        availableActionId: "",
        availableActionName: "",
        availableActionImage: "",
        metadata: {},
      },
    ]);
  }

  function changeModelLayout(
    params: null | { name: string; id: string; metadata: any; image: string }
  ) {
    if (params === null) {
      //clciked on cross
    } else if (modelIndex === 1) {
      //chose a trigger
      setSelectedTrigger({
        id: params.id,
        name: params.name,
        image: params.image,
      });
    } else if (modelIndex != undefined) {
      //chose an action, so chnaging its data in the array, its at idx-1
      setSelectedActions((a) => {
        const newActs = [...a];
        newActs[modelIndex - 2] = {
          idx: modelIndex,
          availableActionId: params.id,
          availableActionName: params.name,
          availableActionImage: params.image,
          metadata: params.metadata,
        };
        return newActs;
      });
    }
    setModelIndex(null);
  }

  function removeAction(actIndex: number) {
    //since dif of 2 in index of action array, to show in serial
    const idx = actIndex - 2;

    setSelectedActions((a) => {
      const tmpActions = a.filter((xx) => xx.idx !== actIndex);
      console.log(a);
      const newActions = tmpActions.map((action, i) => {
        if (i < idx) return { ...action };
        else {
          return { ...action, idx: action.idx - 1 };
        }
      });
      console.log(newActions);
      return newActions;
    });
  }

  return (
    <div>
      {/* <Appbar /> */}
      <div className="flex justify-end">
        <PrimaryButton
          onClick={async () => {
            //returning if no trigger selected
            if (!selectedTrigger?.id) {
              alert("Kindly select a trigger");
              return;
            }
            const find = selectedActions.find(
              (action) => !action.availableActionId
            );

            //returning if no action selected or some action not chosen
            if (find || selectedActions.length === 0) {
              alert("Kindly choose the actions");
              return;
            }

            await axios.post(
              `${BACKEND_URL}/api/v1/zap/editZap/` + zapid,
              {
                availableTriggerId: selectedTrigger?.id,
                triggerMetaData: {},
                actions: selectedActions.map((action) => ({
                  availableActionId: action.availableActionId,
                  actionMetaData: action.metadata,
                })),
              },
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );
            router.push("/dashboard");
          }}
        >
          Publish
        </PrimaryButton>
      </div>
      <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
        <div className="flex justify-center w-full">
          <ZapCell
            onClick={() => {
              setModelIndex(1);
            }}
            name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"}
            index={1}
            image={selectedTrigger?.image ? selectedTrigger.image : ""}
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
                image={
                  action?.availableActionImage
                    ? action.availableActionImage
                    : ""
                }
                removeAction={removeAction}
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
