import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options, value, onChange, placeholder = '请选择' }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeTag = (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optValue));
  };

  const displayValue = value.map(v => options.find(o => o.value === v)?.label || v);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[38px] px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg flex flex-wrap items-center gap-1 cursor-pointer hover:border-blue-500 transition-colors shadow-sm"
      >
        {value.length === 0 ? (
          <span className="text-slate-400 py-0.5">{placeholder}</span>
        ) : (
          displayValue.map((label, idx) => (
            <span key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
              {label}
              <button 
                type="button" 
                onClick={(e) => removeTag(e, value[idx])}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
        <div className="flex-1"></div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {options.map((opt) => (
            <label 
              key={opt.value} 
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <input 
                type="checkbox" 
                checked={value.includes(opt.value)}
                onChange={() => handleToggle(opt.value)}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
