import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Solana = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div>
      <Input
        label="To: "
        placeholder="Receiver's email"
        onChange={(e) => setAddress(e.target.value)}
      />
      <Input
        label="Amount: "
        placeholder="Text"
        onChange={(e) => setAmount(e.target.value)}
      />
      <PrimaryButton
        onClick={() => {
          setMetadata({ address, amount });
        }}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};
