import { useState } from "react";
import { Input } from "../Input";
import { DarkButton } from "../buttons/DarkButton";

export const Sms = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!body) {
      alert("Please fill the body.");
      return;
    }
    setMetadata({ phone, body });
  };
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Recipiuent Phone Number: "
          placeholder="e.g., {trigger.recipient_number} or Mobile Number"
          onChange={(e) => setPhone(e.target.value)}
          type="text"
        />
        <p className="text-sm">*Will be sent to Krrish_s personal number</p>
        <Input
          label="Message: "
          placeholder="e.g., {trigger.sms} or SmsMessage"
          onChange={(e) => setBody(e.target.value)}
          type="text"
        />
      </div>
      <div className="mt-6 flex justify-end">
        <DarkButton onClick={handleSubmit}>Save Action</DarkButton>
      </div>
    </div>
  );
};
