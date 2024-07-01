import React, { useState } from "react";
import { PairValue } from "../api";

export interface PairValueProps {
  pairs: PairValue[];
  setPairs: React.Dispatch<React.SetStateAction<PairValue[]>>;
}

export const PairValueComponent: React.FC<PairValueProps> = ({
  pairs,
  setPairs,
}) => {
  const addPair = () => {
    setPairs([...pairs, { key: "", value: "" }]);
  };

  const updatePair = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const newPairs = [...pairs];
    newPairs[index][field] = newValue;
    setPairs(newPairs);
  };

  const removePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
  };

  return (
    <div className="mt-2">
      {pairs.map((pair, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            value={pair.key}
            onChange={(e) => updatePair(index, "key", e.target.value)}
            placeholder="Key"
            className="border rounded px-2 py-1 mr-2 flex-1"
          />
          <input
            type="text"
            value={pair.value}
            onChange={(e) => updatePair(index, "value", e.target.value)}
            placeholder="Value"
            className="border rounded px-2 py-1 mr-2 flex-1"
          />
          <button onClick={() => removePair(index)} className="text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addPair}
        className="flex items-center text-blue-500 mt-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Add
      </button>
    </div>
  );
};
