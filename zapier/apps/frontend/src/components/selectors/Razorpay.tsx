import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const Razorpay = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [amnt, setAmnt] = useState(0);
  const [description, setDescription] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Input
          label="KeyID (necessary): "
          placeholder="Enter key id"
          onChange={(e) => setKeyId(e.target.value)}
        />
        <Input
          label="Ket Secret (necessary): "
          placeholder="Enter key secret"
          onChange={(e) => setKeySecret(e.target.value)}
        />
        <Input
          label="Amount in INR: "
          placeholder="Enter amount"
          onChange={(e) => setAmnt(+e.target.value)}
        />
        <Input
          label="Description: "
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Customer Name"
          placeholder="Enter Customer Name"
          onChange={(e) => setCustName(e.target.value)}
        />
        <Input
          label="Customer Email: "
          placeholder="Enter Customer Email"
          onChange={(e) => setCustEmail(e.target.value)}
        />
      </div>
      <PrimaryButton
        onClick={() => {
          setMetadata({
            keyId,
            keySecret,
            amntInPaise: amnt * 100,
            description,
            custName,
            custEmail,
          });
        }}
      >
        Submit
      </PrimaryButton>
      <p className="text-center -mt-4 text-sm">
        To use the link created by razorpay in further actions, use{" "}
        {`--> {razorpayUrl}`}
      </p>
    </div>
  );
};
