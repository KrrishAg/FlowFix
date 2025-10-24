import { useEffect, useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";

export const Notion = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [apikey, setApikey] = useState("");
  const [databases, setDatabases] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [properties, setProperties] = useState<
    {
      name: string;
      type: string;
    }[]
  >([]);
  const [values, setValues] = useState<Record<string, string>>({});

  async function getDatabases() {
    const res = await axios.get(`${BACKEND_URL}/api/v1/notion/databases`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    setDatabases([{ id: "", name: "Choose DB" }, ...res.data.databases]);
  }
  useEffect(() => {
    async function checkIsConnected() {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/usercred/available?service=NOTION`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setIsConnected(res.data.isConnected);
      if (res.data.isConnected) {
        getDatabases();
      }
    }
    checkIsConnected();
  }, []);

  // async function getSchema() {
  //   if (!selectedDatabase) return;
  //   const res = await axios.get(
  //     `${BACKEND_URL}/api/v1/notion/database/${selectedDatabase}`,
  //     {
  //       headers: {
  //         Authorization: localStorage.getItem("token"),
  //       },
  //     }
  //   );
  //   setProperties(res.data.properties);
  // }

  useEffect(() => {
    async function getSchema() {
      if (!selectedDatabase) return;
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/notion/database/${selectedDatabase}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setProperties(res.data.properties);
    }
    getSchema();
  }, [selectedDatabase]);

  return (
    <div className="flex flex-col gap-6">
      {selectedDatabase}
      {isConnected ? (
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-900">Choose Database</label>
          <select
            // value={value}
            onChange={(e) => {
              setSelectedDatabase(e.target.value);
              console.log(e.target.value);
            }}
            value={selectedDatabase}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {databases.map((db, idx) => (
              <option key={idx} value={db.id} className="text-base">
                {db.name}
              </option>
            ))}
          </select>

          {selectedDatabase && (
            <div>
              {JSON.stringify(values)}

              {properties.map((prop, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_1fr_1fr_4.5fr] items-center mb-4"
                >
                  <div className="font-semibold text-xl">{prop.name}</div>
                  <div className="font-semibold text-base">{`(${prop.type})`}</div>
                  <div className="font-semibold text-xl">:</div>
                  <input
                    className="border border-orange-400 p-2 text-lg"
                    onChange={(e) =>
                      setValues((xx) => ({
                        ...xx,
                        [prop.name]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
              <PrimaryButton
                onClick={() => {
                  setMetadata(values);
                }}
              >
                Submit
              </PrimaryButton>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Input
            label="API KEY: "
            placeholder="enter notion api key"
            onChange={(e) => setApikey(e.target.value)}
          />
          <PrimaryButton
            onClick={async () => {
              await axios.post(
                `${BACKEND_URL}/api/v1/usercred/setapi`,
                {
                  service: "NOTION",
                  apikey,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );
              setIsConnected(true);
              getDatabases();
            }}
          >
            Submit
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
