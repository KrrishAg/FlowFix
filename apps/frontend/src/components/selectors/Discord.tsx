import { useState } from "react";
import { Input } from "../Input";
import { DarkButton } from "../buttons/DarkButton";

export const Discord = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState<string | null>(null);
  const [hyperlink, setHyperlink] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!message) {
      alert("Please fill in the message.");
      return;
    }
    setMetadata({ url, message, title, hyperlink });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Webhook Url"
          placeholder="e.g., {trigger.webhookUrl} or Webhook URL"
          onChange={(e) => setUrl(e.target.value)}
          type="text"
        />
        <p className="text-xs">{`(Need to be a real discord webhook url, if unsure leave empty, message will be sent to Krrish's pvt channel)`}</p>
        <Input
          label="Message: "
          placeholder="e.g., {trigger.message} or Discord Message..."
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
        <Input
          label="Hyperlink to include (OPTIONAL)"
          placeholder="e.g., {trigger.hyperlink} or Hyperlink"
          onChange={(e) => setHyperlink(e.target.value)}
          type="text"
        />
        <Input
          label="Title for link (OPTIONAL)"
          placeholder="e.g., {trigger.title} or Link Title"
          onChange={(e) => setTitle(e.target.value)}
          type="text"
        />
      </div>
      <div className="mt-6 flex justify-end">
        <DarkButton onClick={handleSubmit}>Save Action</DarkButton>
      </div>
    </div>
  );
};
