import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Discord = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState<string | null>(null);
  const [hyperlink, setHyperlink] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Webhook Url"
          placeholder="url"
          onChange={(e) => setUrl(e.target.value)}
        />
        <p className="text-xs">(Need to be a real discord webhook url, if unsure leave empty, message will be sent to Krrish's pvt channel)</p>
        <Input
          label="Message: "
          placeholder="Type message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <Input
          label="Hyperlink to include (OPTIONAL)"
          placeholder="hyperlink..."
          onChange={(e) => setHyperlink(e.target.value)}
        />
        <Input
          label="Title for link (OPTIONAL)"
          placeholder="Title..."
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <PrimaryButton
        onClick={() => {
          setMetadata({ url, message, title, hyperlink });
        }}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};
