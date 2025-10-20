import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Email = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="To: "
          placeholder="Receiver's email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Body: "
          placeholder="Text"
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <PrimaryButton
        onClick={() => {
          setMetadata({ email, body });
        }}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};
