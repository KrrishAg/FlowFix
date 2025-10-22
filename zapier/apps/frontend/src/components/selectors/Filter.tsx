import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { Select } from "../Select";

export const Filter = ({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) => {
  const [logic, setLogic] = useState("AND");
  const [condition1, setCondition1] = useState({
    field: "",
    operator: "text_contains",
    value: "",
  });
  const [condition2, setCondition2] = useState({
    field: "",
    operator: "text_contains",
    value: "",
  });

  const options = [
    "text_contains",
    "text_is_not",
    "text_starts_with",
    "number_greater_than",
    "number_less_than",
    "date_is_after",
    "exists",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Input
          label="Field 1: "
          placeholder="Enter value"
          onChange={(e) =>
            setCondition1((xx) => ({
              ...xx,
              field: e.target.value,
            }))
          }
        />
        <Select
          label="Select operator condition"
          options={options}
          value={condition1.operator}
          onChange={(e) =>
            setCondition1((xx) => ({
              ...xx,
              operator: e.target.value,
            }))
          }
        />
        <Input
          label="Value 1: "
          placeholder="Enter value"
          onChange={(e) =>
            setCondition1((xx) => ({
              ...xx,
              value: e.target.value,
            }))
          }
        />
      </div>

      <Select
        label="Select logical operator"
        options={["AND", "OR"]}
        value={logic}
        onChange={(e) => setLogic(e.target.value)}
      />

      <div className="flex flex-col gap-3">
        <Input
          label="Field 2: "
          placeholder="Enter value"
          onChange={(e) =>
            setCondition2((xx) => ({
              ...xx,
              field: e.target.value,
            }))
          }
        />
        <Select
          label="Select operator condition"
          options={options}
          value={condition2.operator}
          onChange={(e) =>
            setCondition2((xx) => ({
              ...xx,
              operator: e.target.value,
            }))
          }
        />
        <Input
          label="Value 2: "
          placeholder="Enter value"
          onChange={(e) =>
            setCondition2((xx) => ({
              ...xx,
              value: e.target.value,
            }))
          }
        />
      </div>
      <PrimaryButton
        onClick={() => {
          setMetadata({ logic, condition1, condition2 });
        }}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};
