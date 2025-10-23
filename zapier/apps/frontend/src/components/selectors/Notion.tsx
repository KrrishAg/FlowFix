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

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/usercred/available?service=NOTION`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => res.data)
      .then((data) => setIsConnected(data.isConnected));
  }, []);

  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="flex flex-col gap-6">
      {isConnected ? (
        <div>
            
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
            }}
          >
            Submit
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
