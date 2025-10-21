import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Telegram = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="BotToken: "
          placeholder="BotToken . . ."
          onChange={(e) => setBotToken(e.target.value)}
        />
        <Input
          label="ChatId: "
          placeholder="Enter Chat Id . . ."
          onChange={(e) => setChatId(e.target.value)}
        />
        <Input
          label="Message: "
          placeholder="Enter the message . . ."
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <PrimaryButton
        onClick={() => {
          setMetadata({ botToken, chatId, message });
        }}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};
