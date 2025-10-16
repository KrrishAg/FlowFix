import { useState } from "react";
import { Input } from "../Input";
import { SecondaryButton } from "../buttons/SecondaryButton";

export const Email = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  return (
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
      <SecondaryButton
        onClick={() => {
          setMetadata({ email, body });
        }}
      >
        Submit
      </SecondaryButton>
    </div>
  );
};
