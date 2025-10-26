import { useState } from "react";
import { Input } from "../Input";
import { DarkButton } from "../buttons/DarkButton";

export const Email = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!email || !body) {
      alert("Please fill in the method.");
      return;
    }
    setMetadata({ email, body });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Recipient Email: "
          placeholder="e.g., {trigger.email} or Email"
          onChange={(e) => setEmail(e.target.value)}
          type="text"
        />
        <Input
          label="Body: "
          placeholder="e.g., {trigger.message} or Body"
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
