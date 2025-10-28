import React from "react";
import { motion } from "framer-motion";

export default function TextVisualization({ text, pattern, currentStep, algorithm }) {
  if (!text) return null;

  // Extract current indices from the step object (you'll pass these from your logic)
  const { textIndex, patternIndex, match } = currentStep || {};

  return (
    <div className="flex flex-col items-center space-y-6 bg-gray-50 p-6 rounded-xl shadow-md">
      <div className="text-xl font-semibold text-gray-700">
        {algorithm ? `${algorithm.toUpperCase()} Visualization` : "Pattern Matching"}
      </div>

      {/* TEXT DISPLAY */}
      <div className="flex space-x-2">
        {text.split("").map((char, i) => {
          let bg = "bg-white";
          if (i === textIndex) bg = match ? "bg-green-300" : "bg-red-300";

          return (
            <motion.div
              key={i}
              animate={{ scale: i === textIndex ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`w-8 h-8 flex items-center justify-center border border-gray-400 rounded ${bg}`}
            >
              {char}
            </motion.div>
          );
        })}
      </div>

      {/* PATTERN DISPLAY */}
      <motion.div
        className="flex space-x-2 mt-4"
        animate={{ x: currentStep ? currentStep.textIndex * 34 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        {pattern.split("").map((char, i) => {
          let bg = "bg-white";
          if (i === patternIndex) bg = match ? "bg-green-300" : "bg-red-300";

          return (
            <div
              key={i}
              className={`w-8 h-8 flex items-center justify-center border border-gray-500 rounded ${bg}`}
            >
              {char}
            </div>
          );
        })}
      </motion.div>

      {currentStep && (
        <div className="text-sm text-gray-500 mt-2">
          Comparing text[{textIndex}] = <b>{text[textIndex]}</b> with pattern[{patternIndex}] = <b>{pattern[patternIndex]}</b>
        </div>
      )}
    </div>
  );
}
