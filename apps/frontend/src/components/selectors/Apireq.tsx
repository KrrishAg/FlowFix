import { useState } from "react";
import { Input } from "../Input";
import { DarkButton } from "../buttons/DarkButton";

export const Apireq = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("");
  const [headers, setHeaders] = useState<string | null>(null);
  const [body, setBody] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!method) {
      alert("Please fill in the method.");
      return;
    }
    setMetadata({ url, method, headers, body });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Url (or Variable)"
          placeholder="e.g., {trigger.url} or URL..."
          onChange={(e) => setUrl(e.target.value)}
          type="text"
        />
        <Input
          label="Method (or Variable)"
          placeholder="e.g., {trigger.method} or POST/GET/..."
          onChange={(e) => setMethod(e.target.value)}
          type="text"
        />
        <div className="mt-2">
          <label className="font-medium">Headers</label>
          <textarea
            placeholder={`Authorization":"{comment.authtoken}","factor":"{comment.factor}"}, then need to send authtoken value in comment object`}
            className="w-full border border-indigo-400 p-2 rounded h-25"
            onChange={(e) => setHeaders(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <label className="font-medium">Headers</label>
          <textarea
            placeholder={`Authorization":"{comment.authtoken}","factor":"{comment.factor}"}, then need to send authtoken value in comment object`}
            className="w-full border border-indigo-400 p-2 rounded h-25"
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <DarkButton onClick={handleSubmit}>Save Action</DarkButton>
      </div>
    </div>
  );
};
