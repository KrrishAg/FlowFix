import { useState } from "react";
import { Input } from "../Input";
import { SecondaryButton } from "../buttons/SecondaryButton";

export const Solana = ({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
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
        label="Body: "
        placeholder="Text"
        onChange={(e) => setAmount(e.target.value)}
      />
      <SecondaryButton
        onClick={() => {
          setMetadata({ address, amount });
        }}
      >
        Submit
      </SecondaryButton>
    </div>
  );
};
