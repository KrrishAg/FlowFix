"use client";
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

//the type of data returned by the backend, got from postman
interface Zap {
  id: string;
  triggerId: string;
  userId: number;
  date: Date;
  actions: {
    id: string;
    zapId: string;
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
    zapId: string;
    triggerId: string;
    AvailableTrigger: {
      id: string;
      name: string;
      image: string;
    };
  };
}

function useZaps() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setZaps(res.data.zaps);
      })
      .catch((err) => {
        // console.log("ERROR", err);
        setError(JSON.stringify(err.response.data.error));
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    zaps,
    setZaps,
    error,
  };
}

export default function Page() {
  const { loading, zaps, setZaps, error } = useZaps();
  const router = useRouter();

  return (
    <div>
      {/* <Appbar /> */}
      <div className="flex justify-center pt-8">
        <div className="max-w-screen-lg	 w-full">
          <div className="flex justify-between pr-8 ">
            <div className="text-2xl font-bold">My Zaps</div>
            <DarkButton
              onClick={() => {
                router.push("/zap/create");
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
          <ZapTable zaps={zaps} setZaps={setZaps} />
        </div>
      )}
    </div>
  );
}

function ZapTable({
  zaps,
  setZaps,
}: {
  zaps: Zap[];
  setZaps: Dispatch<SetStateAction<Zap[]>>;
}) {
  const router = useRouter();

  return (
    <div className="p-8 max-w-screen-lg w-full">
      <div className="flex">
        <div className="flex-1">Name</div>
        <div className="flex-1">ID</div>
        <div className="flex-1">Created at</div>
        <div className="flex-1">Webhook URL</div>
        <div className="flex-1">Delete</div>
        <div className="flex-1">Go</div>
      </div>
      {zaps.map((z) => (
        <div key={z.id} className="flex border-b border-t py-4">
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
          <div className="flex-1">{`${HOOKS_URL}/hooks/catch/${jwtDecode(localStorage.getItem("token") as string).id}/${z.id}`}</div>
          <div className="flex-1">
            <LinkButton
              onClick={async () => {
                await axios.delete(`${BACKEND_URL}/api/v1/zap/` + z.id, {
                  headers: { Authorization: localStorage.getItem("token") },
                });
                setZaps((s) => s.filter((zap) => zap.id !== z.id));
              }}
            >
              Delete
            </LinkButton>
          </div>
          <div className="flex-1">
            <LinkButton
              onClick={() => {
                // router.push("/zap/" + z.id);
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
