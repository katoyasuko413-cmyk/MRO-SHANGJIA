import React from 'react';
import { Upload } from 'lucide-react';

export const UploadBox = ({ title, extra }: { title: string, extra?: string }) => (
  <div className="border border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 group transition-colors">
    <div className="w-10 h-10 bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 rounded-full flex items-center justify-center mb-3 transition-colors">
        <Upload size={18} />
    </div>
    <div className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{title}</div>
    {extra && <div className="text-xs text-slate-400 mt-1">{extra}</div>}
  </div>
);
