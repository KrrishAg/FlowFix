import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Sms = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="To: "
          placeholder="Receiver's phone number"
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="text-sm">*Will be sent to Krrish's personal number</p>
        <Input
          label="Message: "
          placeholder="Type message..."
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <PrimaryButton
        onClick={() => {
          setMetadata({ phone, body });
        }}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};
