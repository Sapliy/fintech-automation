import { convertType } from "../constant";
import { ValuesSensor } from "../nodes/types";
import { ConditionConfig, Operator } from "../types";

export class ConditionEvaluator {
  static evaluate(config: ConditionConfig): boolean {
    const { value, operator, target: payload, type } = config;

    const val = convertType[type](value) as ValuesSensor;
    const trg = convertType[type](payload) as ValuesSensor;

    const isNumeric = !isNaN(Number(val)) || !isNaN(Number(trg));
    const a = isNumeric ? Number(val) : val;
    const b = isNumeric ? Number(trg) : trg;

    const operators: Record<
      Operator,
      (a: ValuesSensor, b: ValuesSensor) => boolean
    > = {
      ">": (a, b) => a > b,
      "<": (a, b) => a < b,
      ">=": (a, b) => a >= b,
      "<=": (a, b) => a <= b,
      "==": (a, b) => a == b,
      "!=": (a, b) => a != b,
      "===": (a, b) => a === b,
      "!==": (a, b) => a !== b,
    };

    const opFunc = operators[operator];
    if (process.env.NODE_ENV !== "production") {
      console.log("opFunc", opFunc(a, b));
    }
    if (!opFunc) return false;

    return opFunc(a, b);
  }
}
