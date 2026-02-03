import { Operations } from "../nodes/types";

export const operations: Operations[] = ["number", "text"];
export const operators = [">=", "<=", "==", ">", "<", "!="];
export const convertType: Record<Operations, <T>(val: any) => T> = {
  number: <T>(value: any): T => Number(value) as T,
  text: <T>(value: any): T => String(value) as T,
};
