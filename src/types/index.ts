import { ValuesSensor } from "../nodes/types";

export type TContextMenu = {
  id: string;
  top: number | boolean;
  left: number | boolean;
  right: number | boolean;
  bottom: number | boolean;
};
export type Operator = ">" | "<" | ">=" | "<=" | "==" | "!=" | "===" | "!==";
export type ValueType = "number" | "text";

export interface ConditionConfig {
  value: ValuesSensor;
  operator: Operator;
  target: ValuesSensor;
  type: ValueType;
}

export interface ConditionResult {
  isValid: boolean;
  context: {
    value: ValuesSensor;
    operator: Operator;
    target: ValuesSensor;
  };
}
