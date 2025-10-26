import { useEffect, useState } from "react";
import { Input } from "../Input";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { DarkButton } from "../buttons/DarkButton";

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
  const [values, setValues] = useState<
    Record<string, { type: string; value: string }>
  >({});

  const handleSubmit = () => {
    if (!selectedDatabase) {
      alert("Please select a database");
      return;
    }
    setMetadata({ ...values, dbId: selectedDatabase });
  };

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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
          >
            {databases.map((db, idx) => (
              <option key={idx} value={db.id} className="text-base">
                {db.name}
              </option>
            ))}
          </select>

          {selectedDatabase && (
            <div>
              {/* {JSON.stringify(values)} */}
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
                        [prop.name]: {
                          type: prop.type,
                          value: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ))}
              <div className="mt-6 flex justify-end">
                <DarkButton onClick={handleSubmit}>Save Action</DarkButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4 font-medium">
            <h2>Steps:</h2>
            <p>
              1. User need to create a notion api key from their notion account
            </p>
            <p>
              2. Add a connection from that api key to the DATABSES user wants
              to connect.
            </p>
          </div>
          <Input
            label="API KEY: "
            placeholder="enter notion api key"
            onChange={(e) => setApikey(e.target.value)}
            type="text"
          />
          <div className="mt-6 flex justify-center">
            <DarkButton
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
            </DarkButton>
          </div>
        </div>
      )}
      <p className="text-center -mt-4 text-sm">
        To use the link created by notion in further actions, use{" "}
        {`--> {notionUrl}`}
      </p>
    </div>
  );
};
