import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberInput({ value, onChange, min = 0, max = Infinity }: NumberInputProps) {
  const handleMinus = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handlePlus = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  return (
    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-9 shadow-sm">
      <button 
        onClick={handleMinus}
        disabled={value <= min}
        className="w-10 h-full flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200 transition-colors"
      >
        <Minus size={14} />
      </button>
      <input 
        type="number" 
        value={value}
        onChange={handleChange}
        className="flex-1 w-full h-full text-center text-sm font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 no-spinner min-w-[60px]"
      />
      <button 
        onClick={handlePlus}
        disabled={value >= max}
        className="w-10 h-full flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border-l border-slate-200 transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
