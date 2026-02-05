import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { TConditionData, Operations, ValuesSensor } from "../../nodes/types";
import { operations, operators } from "../../constant";
import { ArrowLeftRight, Binary, Equal, Send } from "lucide-react";
import { Operator } from "../../types";

type TProps = {
  data: TConditionData<ValuesSensor>;
  handleUpdate: (data: Partial<TConditionData<ValuesSensor>>) => void;
};

const convert_operations: Record<Operations, (value: any) => any> = {
  number: Number,
  text: String,
};

const ConditionDetails = (props: TProps) => {
  const { data, handleUpdate } = props;
  const firstCondition =
    (data.if as Record<string, any>[] | undefined)?.[0] ?? {};
  const operator = data.operator as Operator;

  const [convertOperation, setConvertOperation] =
    useState<Operations>("number");
  const [payload, setPayload] = useState<string | number>(
    firstCondition[operator as Operator]?.[1] ?? ""
  );

  const [trueValue, setTrueValue] = useState(String(data.outputTruePath || ""));
  const [falseValue, setFalseValue] = useState(String(data.outputFalsePath || ""));

  const handleConvertOperation = (e: ChangeEvent<HTMLSelectElement>) => {
    const operation = e.target.value as Operations;

    const updatedCondition = {
      ...firstCondition,
      [operator]: [
        firstCondition[operator][0],
        convert_operations[operation](firstCondition[operator][1]),
      ],
    };

    setConvertOperation(operation);
    handleUpdate({
      if: [updatedCondition],
    });
  };

  const handleChangePayload = (e: FocusEvent<HTMLInputElement>) => {
    const payload = e.target.value;
    firstCondition[operator][1] = payload;

    handleUpdate({ if: [firstCondition] });
  };

  const handleSelectOperator = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOperator = e.target.value as Operator;
    firstCondition[selectedOperator] = firstCondition[operator];
    delete firstCondition[operator];

    handleUpdate({
      if: [firstCondition],
      operator: selectedOperator,
    });
  };

  useEffect(() => {
    if (firstCondition[operator]) {
      const value = firstCondition[operator][1];
      const type = typeof value;

      // Dynamically set the convertOperation based on the type of the value
      if (type === "string") {
        setConvertOperation("text");
      } else if (type === "number") {
        setConvertOperation("number");
      }

      setPayload(value); // Set the initial threshold value
    }
  }, [firstCondition, operator]);

  return (
    <div className="space-y-6">
      {/* Type Operations Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Binary className="w-4 h-4" />
          <label className="text-sm font-medium">Value Type</label>
        </div>
        <select
          value={convertOperation}
          onChange={handleConvertOperation}
          className="w-full px-3 py-2 rounded-lg border border-gray-300
                   focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                   transition-all duration-200 bg-white"
        >
          {operations.map((op) => (
            <option key={op} value={op} className="py-1">
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {/* Payload Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <ArrowLeftRight className="w-4 h-4" />
          <label className="text-sm font-medium">Compare Value</label>
        </div>
        <div className="relative">
          <input
            type={convertOperation === "number" ? "number" : "text"}
            defaultValue={payload}
            onBlur={handleChangePayload}
            className="w-full px-3 py-2 rounded-lg border border-gray-300
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                     transition-all duration-200
                     placeholder:text-gray-400"
            placeholder={`Enter ${convertOperation} value`}
          />
        </div>
      </div>
      {/* Operator Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Equal className="w-4 h-4" />
          <label className="text-sm font-medium">Comparison Operator</label>
        </div>
        <select
          defaultValue={data.operator as Operator}
          onChange={handleSelectOperator}
          className="w-full px-3 py-2 rounded-lg border border-gray-300
                   focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                   transition-all duration-200 bg-white"
        >
          {operators.map((op) => (
            <option key={op} value={op} className="py-1">
              {op}
            </option>
          ))}
        </select>
      </div>
      {/* Current Value Display */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">
            Current Expression
          </span>
          <div className="font-mono text-sm">
            <span className="text-purple-600">if</span>
            <span className="text-gray-600"> ({data.value !== undefined ? String(data.value) : "value"}) </span>
            <span className="text-purple-600">{data.operator}</span>
            <span className="text-gray-600"> ({payload})</span>
          </div>
        </div>
      </div>
      {/* Help Text */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Configure how the condition should evaluate incoming values
        </p>
      </div>
      {/* Output Button Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-600">
          <Send className="w-4 h-4" />
          <label className="text-sm font-medium">Output True Path</label>
        </div>
        {/* True Path */}
        <div className="grid grid-row-2 gap-3">
          <div className="space-y-2">
            <input
              type="text"
              value={trueValue}
              onChange={(e) => setTrueValue(e.target.value)}
              onBlur={() => handleUpdate({ outputTruePath: trueValue })}
              placeholder="Value to send if true"
              className="w-full px-3 py-2 rounded-lg border border-gray-300
                       focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                       transition-all duration-200 text-sm"
            />{" "}
          </div>
          {/* False Path */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <Send className="w-4 h-4" />
              <label className="text-sm font-medium">Output False Path</label>
            </div>
            <input
              type="text"
              value={falseValue}
              onChange={(e) => setFalseValue(e.target.value)}
              onBlur={() => handleUpdate({ outputFalsePath: falseValue })}
              placeholder="Value to send if false"
              className="w-full px-3 py-2 rounded-lg border border-gray-300
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                     transition-all duration-200 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter values to send when condition evaluates to true or false
        </p>
      </div>
    </div>
  );
};

export default ConditionDetails;
