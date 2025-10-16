import { useState } from "react";
import { Input } from "../Input";
import { SecondaryButton } from "../buttons/SecondaryButton";

export const Email = ({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) => {
  const [recEmail, setRecEmail] = useState("");
  const [body, setBody] = useState("");
  return (
    <div>
      <Input
        label="To: "
        placeholder="Receiver's email"
        onChange={(e) => setRecEmail(e.target.value)}
      />
      <Input
        label="Body: "
        placeholder="Text"
        onChange={(e) => setBody(e.target.value)}
      />
      <SecondaryButton
        onClick={() => {
          setMetadata({ recEmail, body });
        }}
      >
        Submit
      </SecondaryButton>
    </div>
  );
};
