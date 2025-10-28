import React from 'react';

import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
} from "../ui/Selecter"; // Your import path for the Select components

// Your local Label component
const Label = ({ children, htmlFor, className = '' }) => (
   <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

export default function AlgorithmSelector({ selected, onSelect }) {
  // 1. Create a map to find the display text from the selected value
  const displayOptions = {
    kmp: "Knuth-Morris-Pratt (KMP)",
    boyerMoore: "Boyer-Moore",
  };

  // 2. Get the correct text, or show the placeholder
  const displayText = displayOptions[selected] || "Choose...";

  return (
    <div className="space-y-2">
      <Label htmlFor="algorithm" className="text-sm font-medium">Select Algorithm</Label>
      <Select id="algorithm" value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
      {/* 3. Render the correct text directly instead of using SelectValue */}
          <span>{displayText}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kmp">Knuth-Morris-Pratt (KMP)</SelectItem>
          <SelectItem value="boyerMoore">Boyer-Moore</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}