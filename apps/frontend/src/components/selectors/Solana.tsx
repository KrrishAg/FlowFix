import { useState } from "react";
import { Input } from "../Input";
import { DarkButton } from "../buttons/DarkButton";

export const Solana = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (!address || !amount) {
      alert("Please fill in both fields.");
      return;
    }
    setMetadata({ address, amount });
  };
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="Recipient Address (or Variable)" // Updated label
          placeholder="e.g., {trigger.recipient_address} or SoLAddress..."
          onChange={(e) => setAddress(e.target.value)}
          type="text"
        />
        <Input
          label="Amount (SOL) (or Variable)" // Updated label
          placeholder="e.g., {trigger.amount} or 0.1"
          onChange={(e) => setAmount(e.target.value)}
          type="text"
        />
      </div>
      <div className="mt-6 flex justify-end">
        <DarkButton onClick={handleSubmit}>Save Action</DarkButton>
      </div>
    </div>
  );
};
