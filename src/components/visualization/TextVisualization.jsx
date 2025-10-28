import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TextVisualization({ text, pattern, currentStep, algorithm }) {
  const scrollContainerRef = useRef(null);
  
  useEffect(() => {
    if (scrollContainerRef.current && currentStep) {
      const textIndex = currentStep?.i ?? currentStep?.textIndex ?? -1;
      if (textIndex >= 0) {
        const charWidth = 44;
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollLeft = Math.max(0, textIndex * charWidth - containerWidth / 2 + charWidth / 2);
        
        scrollContainerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentStep?.i, currentStep?.textIndex]);

  if (!text) return null;

  const textIndex = currentStep?.i ?? currentStep?.textIndex ?? -1;
  const patternIndex = currentStep?.j ?? currentStep?.patternIndex ?? -1;
  const patternStartIndex = Math.max(0, textIndex - patternIndex);
  
  // Determine if current comparison is a match
  const isCurrentMatch = textIndex >= 0 && 
                         patternIndex >= 0 && 
                         text[textIndex] === pattern[patternIndex];

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg">
      <div className="text-2xl font-bold text-gray-800">
        {algorithm ? `${algorithm.toUpperCase()} Visualization` : "Pattern Matching"}
      </div>

      {/* SCROLLABLE CONTAINER FOR TEXT AND PATTERN */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-600">Text</div>
        
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto border-2 border-gray-300 rounded-lg bg-white shadow-inner"
        >
          <div className="inline-block px-4 py-6 min-w-min">
            {/* TEXT - INDEX LABELS AND CHARACTERS */}
            <div className="space-y-1 mb-6">
              <div className="flex gap-1">
                {text.split("").map((char, i) => (
                  <div
                    key={`text-idx-${i}`}
                    className="w-10 h-6 flex items-center justify-center text-xs text-gray-500 font-medium shrink-0"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {text.split("").map((char, i) => {
                  let bgColor = "bg-white";
                  let borderColor = "border-gray-300";
                  
                  // Only highlight if this is the current text index being compared
                  if (i === textIndex && textIndex >= 0) {
                    bgColor = "bg-blue-200";
                    borderColor = "border-blue-500";
                  }

                  return (
                    <motion.div
                      key={`text-${i}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                      className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-semibold shrink-0 ${bgColor} ${borderColor} transition-all`}
                    >
                      {char}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* PATTERN - INDEX LABELS AND CHARACTERS */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500 font-medium mb-2">
                Pattern (Position: {patternStartIndex})
              </div>
              
              {/* Padding before pattern to align with text */}
              <div className="flex gap-1">
                {Array(patternStartIndex)
                  .fill(0)
                  .map((_, i) => (
                    <div key={`pad-${i}`} className="w-10 h-6 shrink-0"></div>
                  ))}
                {pattern.split("").map((char, i) => (
                  <div
                    key={`pattern-idx-${i}`}
                    className="w-10 h-6 flex items-center justify-center text-xs text-gray-400 font-medium shrink-0"
                  >
                    {i}
                  </div>
                ))}
              </div>

              <div className="flex gap-1">
                {/* Padding to align pattern with text position */}
                {Array(patternStartIndex)
                  .fill(0)
                  .map((_, i) => (
                    <div key={`pad-char-${i}`} className="w-10 h-10 shrink-0"></div>
                  ))}
                
                {pattern.split("").map((char, i) => {
                  let bgColor = "bg-purple-100";
                  let borderColor = "border-purple-400";
                  
                  // Highlight current pattern index with match/mismatch color
                  if (i === patternIndex && patternIndex >= 0) {
                    bgColor = isCurrentMatch ? "bg-green-300" : "bg-red-300";
                    borderColor = isCurrentMatch ? "border-green-600" : "border-red-600";
                  }

                  return (
                    <motion.div
                      key={`pattern-${i}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                      className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-semibold shrink-0 ${bgColor} ${borderColor} transition-all`}
                    >
                      {char}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS INFORMATION */}
      {currentStep && (
        <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
          <div className="font-medium mb-2">Current Step:</div>
          <div className="space-y-1">
            {currentStep.i !== undefined && (
              <div>
                Text Index: <span className="font-mono font-bold text-blue-600">{currentStep.i}</span>
              </div>
            )}
            {currentStep.j !== undefined && (
              <div>
                Pattern Index:{" "}
                <span className="font-mono font-bold text-purple-600">{currentStep.j}</span>
              </div>
            )}
            <div className="text-xs text-gray-600 mt-2 italic">{currentStep.action}</div>
          </div>
        </div>
      )}
    </div>
  );
}
