import { useState } from "react";

const useField = (type: string) => {
  const [value, setValue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const reset = () => setValue("");

  return {
    type,
    value,
    onChange,
    reset,
  };
};

type UseField = ReturnType<typeof useField>;
export type InputProps = Omit<UseField, "reset">;

export default useField;
