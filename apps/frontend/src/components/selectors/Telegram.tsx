import { useState } from "react";
import { Input } from "../Input";
import { DarkButton } from "../buttons/DarkButton";

export const Telegram = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message) {
      alert("Please fill in the method.");
      return;
    }
    setMetadata({ botToken, chatId, message });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs">{`(Need to be a real telegram bot token, if unsure leave empty, message will be sent to Krrish's BOT on telegram)`}</p>
        <Input
          label="BotToken: "
          placeholder="BotToken . . ."
          onChange={(e) => setBotToken(e.target.value)}
          type="text"
        />
        <Input
          label="ChatId: "
          placeholder="Enter Chat Id . . ."
          onChange={(e) => setChatId(e.target.value)}
          type="text"
        />
        <Input
          label="Message: "
          placeholder="Enter the message . . ."
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
      </div>
      <div className="mt-6 flex justify-end">
        <DarkButton onClick={handleSubmit}>Save Action</DarkButton>
      </div>
    </div>
  );
};
