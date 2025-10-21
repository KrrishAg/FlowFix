import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Apireq = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("");
  const [headers, setHeaders] = useState<string | null>(null);
  const [body, setBody] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Url to Hit"
          placeholder="url"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          label="Method:  "
          placeholder="Choose Method"
          onChange={(e) => setMethod(e.target.value)}
        />
        <p className="text-sm mt-3">
          HEADERS, format should be like:
          <br />
          {JSON.stringify({
            Authorization: "{comment.authtoken}",
            factor: "{comment.factor}",
          })}
          , then need to send authtoken value in comment object
        </p>
        <textarea
          placeholder="Headers ..."
          className="w-full border border-orange-400 p-2 rounded h-25"
          onChange={(e) => setHeaders(e.target.value)}
        />
        <p className="text-sm mt-3">
          BODY, format should be like:
          <br />
          {JSON.stringify({
            Authorization: "{comment.authtoken}",
            factor: "{comment.factor}",
          })}
          , then need to send authtoken value in comment object
        </p>
        <textarea
          placeholder="Body ..."
          className="w-full border border-orange-400 p-2 rounded h-25"
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <PrimaryButton
        onClick={() => {
          setMetadata({ url, method, headers, body });
        }}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};
