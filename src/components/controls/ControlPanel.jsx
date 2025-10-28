import React from 'react';
import { Play, Pause, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
const Button = ({ children, onClick, className = '', size = 'md', ...props }) => (
  <button
    onClick={onClick}
    {...props}
    className={`rounded-xl font-medium transition-all ${size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'} ${className}`}
  >
    {children}
  </button>
);

export default function ControlPanel({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  onSpeedChange,
}) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={onStepBackward}><ChevronsLeft className="w-4 h-4" /></Button>
        {isPlaying ? (
          <Button onClick={onPause} className="bg-purple-600 text-white"><Pause className="w-4 h-4" /></Button>
        ) : (
          <Button onClick={onPlay} className="bg-indigo-600 text-white"><Play className="w-4 h-4" /></Button>
        )}
        <Button variant="outline" onClick={onStepForward}><ChevronsRight className="w-4 h-4" /></Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Step {currentStepIndex + 1} of {totalSteps}</div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Speed:</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <Button variant="destructive" onClick={onReset}><RotateCcw className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
