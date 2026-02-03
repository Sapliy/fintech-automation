import { ValuesSensor } from "../nodes/types";
import { Operator } from "../types";

type ConditionExpressionProps = {   
  currentValue: ValuesSensor;
  condition: Operator;
  payload: ValuesSensor;
};

const ConditionExpression = ({ currentValue, condition, payload }: ConditionExpressionProps) => {
  return <div
  className="flex items-center justify-center space-x-2 
              font-mono text-sm p-2 rounded-lg
              bg-white/50 backdrop-blur-sm shadow-inner"
>
  <span className="text-purple-700">if</span>
  <span className="px-2 py-1 bg-purple-100 rounded text-purple-700">
    {String(currentValue)}
  </span>
  <span className="text-purple-500 font-bold">{condition}</span>
  <span className="px-2 py-1 bg-purple-100 rounded text-purple-700">
    {payload}
  </span>
</div>;
};

export default ConditionExpression;
