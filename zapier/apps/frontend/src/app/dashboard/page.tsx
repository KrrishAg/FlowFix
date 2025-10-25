"use client";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useAuthRedirect, { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import ModalZaprun from "@/components/ModalZaprun";

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
  useAuthRedirect();
  const { loading, zaps, setZaps, error } = useZaps();
  const router = useRouter();
  const [selectedZapId, setSelectedZapId] = useState<string | null>(null);

  function changeModalLayout() {
    // if (text === null) {
    // } else {
    // }
    setSelectedZapId(null);
  }

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
          <ZapTable
            zaps={zaps}
            setZaps={setZaps}
            setSelectedZapId={setSelectedZapId}
          />
          {selectedZapId && (
            <ModalZaprun zapId={selectedZapId} onSelect={changeModalLayout} />
          )}
        </div>
      )}
    </div>
  );
}

function ZapTable({
  zaps,
  setZaps,
  setSelectedZapId,
}: {
  zaps: Zap[];
  setZaps: Dispatch<SetStateAction<Zap[]>>;
  setSelectedZapId: Dispatch<SetStateAction<string | null>>;
}) {
  useAuthRedirect();
  const router = useRouter();

  return (
    <div className="px-30">
      <div className="mt-10 grid grid-cols-[3fr_3fr_3fr_9fr_2fr_2fr_2fr] justify-items-center border p-3">
        <div className="col-span-1">Name</div>
        <div className="col-span-1">ID</div>
        <div className="col-span-1">Created at</div>
        <div className="col-span-1">Webhook URL</div>
        <div className="col-span-1">Edit</div>
        <div className="col-span-1">Delete</div>
        <div className="col-span-1">Go</div>
      </div>
      {zaps.map((z) => (
        <div
          key={z.id}
          className="grid grid-cols-[3fr_3fr_3fr_9fr_2fr_2fr_2fr] justify-items-center border p-3"
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
                router.push(`/zap/edit/` + z.id);
              }}
            >
              Edit
            </LinkButton>
          </div>
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
                setSelectedZapId(z.id);
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
