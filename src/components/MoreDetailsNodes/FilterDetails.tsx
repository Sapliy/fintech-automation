import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { type TFilterData } from "../../nodes/types";
import { operators } from "../../constant";
import { ArrowLeftRight, Binary, Equal, Tag, Gauge } from "lucide-react";
import { Operator } from "../../types";

type TProps = {
  data: TFilterData;
  handleUpdate: (data: Partial<TFilterData>) => void;
};

const FilterDetails = (props: TProps) => {
  const { data, handleUpdate } = props;
  const [valueType, setValueType] = useState<"number" | "text">(data.valueType || "number");
  const [filterValue, setFilterValue] = useState<string | number>(data.filterValue || 0);
  const [operator, setOperator] = useState<Operator>(data.operator as Operator || "==");

  useEffect(() => {
    setValueType(data.valueType || "number");
    setFilterValue(data.filterValue || 0);
    setOperator(data.operator as Operator || "==");
  }, [data.valueType, data.filterValue, data.operator]);

  const handleValueTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValueType = e.target.value as "number" | "text";
    setValueType(newValueType);

    // Convert the filter value to the appropriate type
    let newFilterValue: string | number = filterValue;
    if (newValueType === "number") {
      newFilterValue = Number(filterValue);
    } else {
      newFilterValue = String(filterValue);
    }

    handleUpdate({
      valueType: newValueType,
      filterValue: newFilterValue
    });
  };

  const handleFilterValueChange = (e: FocusEvent<HTMLInputElement>) => {
    let newValue: string | number = e.target.value;

    if (valueType === "number") {
      newValue = Number(newValue);
    }

    setFilterValue(newValue);
    handleUpdate({ filterValue: newValue });
  };

  const handleOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newOperator = e.target.value as Operator;
    setOperator(newOperator);
    handleUpdate({ operator: newOperator });
  };

  const handleLabelChange = (e: FocusEvent<HTMLInputElement>) => {
    handleUpdate({ label: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Label Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-4 h-4" />
          <label className="text-sm font-medium">Label</label>
        </div>
        <input
          className="w-full px-3 py-2 rounded-lg border border-gray-300
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    transition-all duration-200
                    placeholder:text-gray-400"
          placeholder="Enter filter label"
          defaultValue={data.label}
          onBlur={handleLabelChange}
        />
      </div>

      {/* Current Value Display */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Gauge className="w-4 h-4" />
          <label className="text-sm font-medium">Current Input Value</label>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 
                      rounded-lg border border-gray-200"
        >
          <span
            className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${data.value
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-600"
              }
          `}
          >
            {data.value !== undefined ? String(data.value) : "Waiting for input"}
          </span>
        </div>
      </div>

      {/* Type Operations Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Binary className="w-4 h-4" />
          <label className="text-sm font-medium">Value Type</label>
        </div>
        <select
          value={valueType}
          onChange={handleValueTypeChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-300
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition-all duration-200 bg-white"
        >
          <option value="number">Number</option>
          <option value="text">Text</option>
        </select>
      </div>

      {/* Filter Value Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <ArrowLeftRight className="w-4 h-4" />
          <label className="text-sm font-medium">Filter Value</label>
        </div>
        <div className="relative">
          <input
            type={valueType === "number" ? "number" : "text"}
            defaultValue={filterValue}
            onBlur={handleFilterValueChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     transition-all duration-200
                     placeholder:text-gray-400"
            placeholder={`Enter ${valueType} value`}
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
          value={operator}
          onChange={handleOperatorChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-300
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition-all duration-200 bg-white"
        >
          {operators.map((op) => (
            <option key={op} value={op} className="py-1">
              {op}
            </option>
          ))}
        </select>
      </div>

      {/* Current Filter Expression Display */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">
            Current Filter Expression
          </span>
          <div className="font-mono text-sm">
            <span className="text-indigo-600">if</span>
            <span className="text-gray-600"> (value) </span>
            <span className="text-indigo-600">{operator}</span>
            <span className="text-gray-600"> ({valueType === "text" ? `'${filterValue}'` : filterValue})</span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Configure how the filter should process incoming values
        </p>
      </div>
    </div>
  );
};

export default FilterDetails;