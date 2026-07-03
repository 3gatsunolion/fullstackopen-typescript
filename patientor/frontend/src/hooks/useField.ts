import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";

const useField = <T>(type: string, initialValue: T) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<T>,
  ) => {
    setValue(event.target.value as T);
  };

  const reset = () => setValue(initialValue);

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
