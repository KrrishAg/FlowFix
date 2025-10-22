type OperatorType = keyof typeof OPERATORS;

interface FilterDatatype {
  logic: "AND" | "OR";
  condition1: {
    field: string;
    operator: OperatorType;
    value: string;
  };
  condition2: {
    field: string;
    operator: OperatorType;
    value: string;
  };
}

const OPERATORS = {
  text_contains: (a: string, b: string) => a.includes(b),
  text_is_not: (a: string, b: string) => a !== b,
  text_starts_with: (a: string, b: string) => a.startsWith(b),
  number_greater_than: (a: string, b: string) => Number(a) > Number(b),
  number_less_than: (a: string, b: string) => Number(a) < Number(b),
  date_is_after: (a: string, b: string) => new Date(a) > new Date(b),
  exists: (a: any) => a !== null && a !== undefined,
};

export function sendDataToFilter(filterData: FilterDatatype) {
  try {
    const { logic, condition1, condition2 } = filterData;
    let run1 = true;
    if (!condition1.field) run1 = false;
    let run2 = true;
    if (!condition2.field) run2 = false;

    if (run1 && run2) {
      console.log("first");
      if (logic === "AND") {
        return (
          OPERATORS[condition1.operator](condition1.field, condition1.value) &&
          OPERATORS[condition2.operator](condition2.field, condition2.value)
        );
      } else {
        return (
          OPERATORS[condition1.operator](condition1.field, condition1.value) ||
          OPERATORS[condition2.operator](condition2.field, condition2.value)
        );
      }
    } else if (run1) {
      console.log("second");
      return OPERATORS[condition1.operator](condition1.field, condition1.value);
    } else if (run2) {
      console.log("third");
      return OPERATORS[condition2.operator](condition2.field, condition2.value);
    } else return true;
  } catch (error) {
    console.log("Encountered an error while filtering", error);
  }
}
