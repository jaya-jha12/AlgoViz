// src/components/ui/Selecter.jsx
import React, { useState, useRef, useEffect } from "react";

export const Select = ({ value, onValueChange, children, id }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // map children
  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === SelectTrigger) {
      return React.cloneElement(child, { onClick: () => setOpen(!open) , id});
    }
    if (child.type === SelectContent) {
      return React.cloneElement(child, { open, onSelect: (val) => { onValueChange?.(val); setOpen(false); } });
    }
    if (child.type === SelectValue) {
      return React.cloneElement(child, { selected: value });
    }
    return child;
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {clonedChildren}
    </div>
  );
};

export const SelectTrigger = ({ children, className = "", onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 w-full ${className}`}
  >
    {children}
    <span className="ml-2 text-gray-500">▾</span>
  </button>
);

export const SelectValue = ({ selected, placeholder }) => (
  <span className="truncate">{selected ?? <span className="text-gray-400">{placeholder}</span>}</span>
);

export const SelectContent = ({ open, children, onSelect }) => {
  if (!open) return null;
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === SelectItem) {
      return React.cloneElement(child, { onSelect });
    }
    return child;
  });
  return (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
      {items}
    </div>
  );
};

export const SelectItem = ({ value, children, onSelect }) => (
  <div
    role="option"
    onClick={() => onSelect?.(value)}
    className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 cursor-pointer"
  >
    {children}
  </div>
);
