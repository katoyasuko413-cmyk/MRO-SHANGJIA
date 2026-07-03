import React from 'react';
import { Plus, X } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 5 }: ImageUploaderProps) {
  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (images.length < max) {
      // 模拟上传
      onChange([...images, `https://source.unsplash.com/random/200x200?product&sig=${Math.random()}`]);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((img, index) => (
        <div key={index} className="relative w-24 h-24 rounded-lg border border-slate-200 group overflow-hidden bg-slate-50">
          <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => handleRemove(index)}
              className="text-white hover:text-red-400"
            >
              <X size={20} />
            </button>
          </div>
          {index === 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
              主图
            </div>
          )}
        </div>
      ))}
      
      {images.length < max && (
        <button 
          onClick={handleAdd}
          className="w-24 h-24 rounded-lg flex flex-col items-center justify-center border border-dashed border-slate-300 text-slate-400 hover:text-blue-500 hover:border-blue-500 bg-slate-50 transition-colors"
        >
          <Plus size={24} className="mb-1" />
          <span className="text-xs">上传图片</span>
        </button>
      )}
    </div>
  );
}
