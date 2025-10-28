import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TextVisualization({ text, pattern, currentStep, algorithm }) {
  const [matches, setMatches] = useState([]);
  
  useEffect(() => {
    if (currentStep?.matches) {
      setMatches(currentStep.matches);
    }
  }, [currentStep?.matches]);

  if (!text) return null;

  const textIndex = currentStep?.i ?? currentStep?.textIndex ?? -1;
  const patternIndex = currentStep?.j ?? currentStep?.patternIndex ?? -1;
  const isMatch = currentStep?.match || currentStep?.action?.includes('found') || false;

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg">
      <div className="text-2xl font-bold text-gray-800">
        {algorithm ? `${algorithm.toUpperCase()} Visualization` : "Pattern Matching"}
      </div>

      {/* TEXT WITH INDICES */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-600">Text</div>
        <div className="flex gap-1 justify-start">
          <div className="flex gap-1">
            {/* Index labels above text */}
            <div className="flex gap-1 pb-2">
              {text.split("").map((char, i) => (
                <div key={`text-idx-${i}`} className="w-10 h-6 flex items-center justify-center text-xs text-gray-500 font-medium">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-1 justify-start flex-wrap">
          {text.split("").map((char, i) => {
            let bgColor = "bg-white";
            let borderColor = "border-gray-300";
            
            if (i === textIndex && !isMatch) {
              bgColor = "bg-blue-200";
              borderColor = "border-blue-500";
            } else if (matches.includes(i)) {
              bgColor = "bg-green-200";
              borderColor = "border-green-500";
            }

            return (
              <motion.div
                key={`text-${i}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-semibold ${bgColor} ${borderColor} transition-all`}
              >
                {char}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PATTERN VISUALIZATIONS - STACKING FOR MATCHES */}
      <div className="space-y-4">
        <div className="text-sm font-semibold text-gray-600">Pattern</div>
        
        {/* Current Pattern Position */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 pl-1">Current Position (Shift = {currentStep?.shift ?? 0})</div>
          <motion.div
            className="flex gap-1 justify-start"
            animate={{ x: textIndex >= 0 ? (textIndex - patternIndex) * 44 : 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          >
            {/* Index labels */}
            <div className="flex gap-1 pb-2">
              {pattern.split("").map((char, i) => (
                <div key={`pattern-idx-${i}`} className="w-10 h-6 flex items-center justify-center text-xs text-gray-400 font-medium">
                  {i}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="flex gap-1 justify-start"
            animate={{ x: textIndex >= 0 ? (textIndex - patternIndex) * 44 : 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          >
            {pattern.split("").map((char, i) => {
              let bgColor = "bg-purple-100";
              let borderColor = "border-purple-400";
              
              if (i === patternIndex) {
                bgColor = isMatch ? "bg-green-300" : "bg-red-300";
                borderColor = isMatch ? "border-green-600" : "border-red-600";
              }

              return (
                <div
                  key={`pattern-${i}`}
                  className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-semibold ${bgColor} ${borderColor} transition-all`}
                >
                  {char}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Stack of Found Matches */}
        <AnimatePresence>
          {matches.length > 0 && (
            <div className="space-y-2 border-t pt-6 mt-6">
              <div className="text-xs font-semibold text-gray-500 pl-1">Matches Found</div>
              {matches.map((matchIndex, idx) => (
                <motion.div
                  key={`match-${matchIndex}-${idx}`}
                  initial={{ opacity: 0, y: -15, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="space-y-1"
                >
                  <div className="text-xs text-gray-500 pl-1">
                    Match #{idx + 1} at index {matchIndex}
                  </div>
                  <div className="flex gap-1 justify-start">
                    {/* Index labels */}
                    <div className="flex gap-1 pb-2">
                      {pattern.split("").map((char, i) => (
                        <div key={`match-idx-${matchIndex}-${i}`} className="w-10 h-6 flex items-center justify-center text-xs text-gray-400 font-medium">
                          {matchIndex + i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 justify-start">
                    {pattern.split("").map((char, i) => (
                      <div
                        key={`match-char-${matchIndex}-${i}`}
                        className="w-10 h-10 flex items-center justify-center border-2 border-green-500 rounded-lg font-mono font-semibold bg-green-200 text-green-900 transition-all"
                      >
                        {text[matchIndex + i]}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Information */}
      {currentStep && (
        <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
          <div className="font-medium mb-2">Current Step:</div>
          <div className="space-y-1">
            {currentStep.i !== undefined && <div>Text Index: <span className="font-mono font-bold text-blue-600">{currentStep.i}</span></div>}
            {currentStep.j !== undefined && <div>Pattern Index: <span className="font-mono font-bold text-purple-600">{currentStep.j}</span></div>}
            <div className="text-xs text-gray-600 mt-2 italic">{currentStep.action}</div>
          </div>
        </div>
      )}
    </div>
  );
}
