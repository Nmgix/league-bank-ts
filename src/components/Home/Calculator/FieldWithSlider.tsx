import { useState, createRef, useEffect, useCallback } from "react";
import { changeStateFunc, AvailableKeys } from "../../../interfaces/ICalculator";
import { useGlobalContext } from "../Calculator";
// import { useGlobalContext } from "../Calculator";

const FieldWithSlider: React.FC<{
  field: AvailableKeys;
  step: number;
  defaultValue: number;
  min: number;
  max: number;
  prefix?: string;
  showStep?: boolean;
  minBoundError?: React.ReactNode;
  maxBoundError?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ children, field, step, defaultValue, min, max, minBoundError, maxBoundError, prefix, showStep }) => {
  const [fieldState, setFieldState] = useState<number>(defaultValue);
  const [currentPercentage, setCurrentPercentage] = useState<number>((fieldState / min) * 10);

  const { state, setState } = useGlobalContext();

  return (
    <div className='field-slider' key={field}>
      <input
        min={min}
        max={max}
        type={"number"}
        value={fieldState}
        className={`field-input ${fieldState < min ? "error" : fieldState > max ? "error" : ""}`}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setCurrentPercentage((e.target.valueAsNumber / min) * 10);
          setFieldState(!isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : min);
          setState({ ...state, [field]: !isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : min });
        }}
      />
      {fieldState < min ? minBoundError : <></>}
      {fieldState > max ? maxBoundError : <></>}
      <input
        type={"range"}
        min={min}
        max={max}
        value={fieldState}
        step={step}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setCurrentPercentage((e.target.valueAsNumber / min) * 10);
          setFieldState(!isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : min);
          setState({ ...state, [field]: !isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : min });
        }}
      />
      <div className='range-help'>
        {showStep ? <div>{currentPercentage.toFixed(0)}%</div> : <span>{`${fieldState} ${prefix}`}</span>}
        {showStep ? <></> : <span>{`${max} ${prefix}`}</span>}
      </div>
      {children ? children : <></>}
    </div>
  );
};

export { FieldWithSlider };
