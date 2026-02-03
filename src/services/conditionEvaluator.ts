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
      "contains": (a, b) => String(a).includes(String(b)),
      "not_contains": (a, b) => !String(a).includes(String(b)),
      "starts_with": (a, b) => String(a).startsWith(String(b)),
      "ends_with": (a, b) => String(a).endsWith(String(b)),
      "regex": (a, b) => new RegExp(String(b)).test(String(a)),
    };

    const opFunc = operators[operator];
    if (process.env.NODE_ENV !== "production") {
      console.log("opFunc", opFunc(a, b));
    }
    if (!opFunc) return false;

    return opFunc(a, b);
  }
}
