import { type CSSProperties } from "react";
import type { InputProps } from "../hooks/useField";

const fieldsetStyle: CSSProperties = {
  border: 0,
  marginInline: 0,
  padding: 0,
  display: "flex",
  alignItems: "baseline",
  gap: 20,
};

const legendStyle: CSSProperties = { float: "left", padding: 0 };

const radioGroupStyle: CSSProperties = { display: "flex", gap: 5 };

const RadioButtonGroup = ({
  name,
  options,
  input,
}: {
  name: string;
  options: string[];
  input: InputProps;
}) => {
  return (
    <fieldset style={fieldsetStyle}>
      <legend style={legendStyle}>{name}</legend>
      <span style={radioGroupStyle}>
        {options.map((o) => (
          <label key={`${name}-${o}`}>
            {o}
            <input {...input} value={o} checked={input.value === o} />
          </label>
        ))}
      </span>
    </fieldset>
  );
};

export default RadioButtonGroup;
