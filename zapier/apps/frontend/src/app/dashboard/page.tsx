"use client";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useAuthRedirect, { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import ModalFlowrun from "@/components/ModalFlowrun";

//the type of data returned by the backend, got from postman
interface Flow {
  id: string;
  triggerId: string;
  userId: number;
  date: Date;
  actions: {
    id: string;
    flowId: string;
    actionId: string;
    sortingOrder: number;
    AvailableAction: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    flowId: string;
    triggerId: string;
    AvailableTrigger: {
      id: string;
      name: string;
      image: string;
    };
  };
}

function useFlows() {
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/flow`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setFlows(res.data.flows);
      })
      .catch((err) => {
        // console.log("ERROR", err);
        setError(JSON.stringify(err.response.data.error));
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    flows,
    setFlows,
    error,
  };
}

export default function Page() {
  useAuthRedirect();
  const { loading, flows, setFlows, error } = useFlows();
  const router = useRouter();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  function changeModalLayout() {
    // if (text === null) {
    // } else {
    // }
    setSelectedFlowId(null);
  }

  return (
    <div>
      {/* <Appbar /> */}
      <div className="flex justify-center pt-8">
        <div className="w-full">
          <div className="flex justify-between px-30">
            <div className="text-3xl font-bold">My Flows</div>
            <DarkButton
              onClick={() => {
                router.push("/flow/create");
              }}
            >
              Create
            </DarkButton>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-xl font-semibold text-center mt-20">
          {error}
        </div>
      ) : (
        <div className="flex justify-center">
          <FlowTable
            flows={flows}
            setFlows={setFlows}
            setSelectedFlowId={setSelectedFlowId}
          />
          {selectedFlowId && (
            <ModalFlowrun
              flowId={selectedFlowId}
              onSelect={changeModalLayout}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FlowTable({
  flows,
  setFlows,
  setSelectedFlowId,
}: {
  flows: Flow[];
  setFlows: Dispatch<SetStateAction<Flow[]>>;
  setSelectedFlowId: Dispatch<SetStateAction<string | null>>;
}) {
  useAuthRedirect();
  const router = useRouter();

  return (
    <div className="px-30">
      <div className="mt-10 grid grid-cols-[3fr_3fr_3fr_9fr_2fr_2fr_2fr] justify-items-center border border-blue-400 p-3 font-bold text-lg">
        <div className="col-span-1">Name</div>
        <div className="col-span-1">ID</div>
        <div className="col-span-1">Created at</div>
        <div className="col-span-1">Webhook URL</div>
        <div className="col-span-1">Edit</div>
        <div className="col-span-1">Delete</div>
        <div className="col-span-1">Go</div>
      </div>
      {flows.map((z) => (
        <div
          key={z.id}
          className="grid grid-cols-[3fr_3fr_3fr_9fr_2fr_2fr_2fr] justify-items-center border border-t-0 border-blue-400 p-3"
        >
          <div className="flex-1 flex">
            <Image
              src={z.trigger.AvailableTrigger?.image}
              alt={z.trigger.AvailableTrigger?.name}
              width={60}
              height={60}
              className="w-[33px] h-[33px]"
            />
            {z.actions.map((x) => (
              <Image
                key={x.id}
                src={x.AvailableAction?.image}
                alt={x.AvailableAction?.name}
                width={60}
                height={60}
                className="w-[33px] h-[33px]"
              />
            ))}
          </div>
          <div className="flex-1">{z.id}</div>
          <div className="flex-1">{new Date(z.date).toLocaleDateString()}</div>
          {/* @ts-expect-error: huh */}
          <div className="flex-1">{`${HOOKS_URL}/hooks/catch/${jwtDecode(localStorage.getItem("token") as string).id}/${z.id}`}</div>
          <div className="flex-1">
            <LinkButton
              onClick={async () => {
                router.push(`/flow/edit/` + z.id);
              }}
            >
              Edit
            </LinkButton>
          </div>
          <div className="flex-1">
            <LinkButton
              onClick={async () => {
                await axios.delete(`${BACKEND_URL}/api/v1/flow/` + z.id, {
                  headers: { Authorization: localStorage.getItem("token") },
                });
                setFlows((s) => s.filter((flow) => flow.id !== z.id));
              }}
            >
              Delete
            </LinkButton>
          </div>
          <div className="flex-1">
            <LinkButton
              onClick={() => {
                setSelectedFlowId(z.id);
              }}
            >
              Go
            </LinkButton>
          </div>
        </div>
      ))}
    </div>
  );
}
