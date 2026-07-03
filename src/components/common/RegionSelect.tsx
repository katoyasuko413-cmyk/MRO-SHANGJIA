import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

const REGION_DATA = [
  {
    province: '江苏省',
    cities: ['南京市', '苏州市', '无锡市', '常州市', '南通市', '扬州市', '徐州市']
  },
  {
    province: '浙江省',
    cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市']
  },
  {
    province: '广东省',
    cities: ['广州市', '深圳市', '东莞市', '佛山市', '珠海市', '惠州市', '中山市']
  },
  {
    province: '全国',
    cities: ['全国区划']
  }
];

interface RegionSelectProps {
  value?: { province: string, city: string }[];
  onChange?: (value: { province: string, city: string }[]) => void;
}

export function RegionSelect({ value = [], onChange }: RegionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProvince, setActiveProvince] = useState<string>(REGION_DATA[0].province);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = value.length;

  const handleProvinceToggle = (province: string) => {
    const provinceData = REGION_DATA.find(r => r.province === province);
    if (!provinceData) return;

    const cities = provinceData.cities;
    const isAllSelected = cities.every(city => value.some(v => v.province === province && v.city === city));

    let newValue = [...value];
    if (isAllSelected) {
      // Remove all cities of this province
      newValue = newValue.filter(v => v.province !== province);
    } else {
      // Add all cities of this province
      const newCities = cities.filter(city => !value.some(v => v.province === province && v.city === city))
      newValue = [...newValue, ...newCities.map(city => ({ province, city }))];
    }
    onChange?.(newValue);
  };

  const handleCityToggle = (province: string, city: string) => {
    const isSelected = value.some(v => v.province === province && v.city === city);
    let newValue;
    if (isSelected) {
      newValue = value.filter(v => !(v.province === province && v.city === city));
    } else {
      newValue = [...value, { province, city }];
    }
    onChange?.(newValue);
  };

  const removeProvince = (e: React.MouseEvent, province: string) => {
    e.stopPropagation();
    onChange?.(value.filter(v => v.province !== province));
  };

  const activeProvinceData = REGION_DATA.find(r => r.province === activeProvince);

  const groupedProvinces = REGION_DATA.map(region => {
    const selectedInProvince = value.filter(v => v.province === region.province);
    return {
      province: region.province,
      selectedCount: selectedInProvince.length,
      cities: selectedInProvince
    };
  }).filter(item => item.selectedCount > 0);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="w-full min-h-[42px] border border-slate-200 rounded-lg px-3 py-2 text-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white cursor-pointer flex flex-wrap gap-1.5 items-center pr-8"
        onClick={() => setIsOpen(!isOpen)}
      >
        {groupedProvinces.length === 0 ? (
          <span className="text-slate-400">请选择服务区域</span>
        ) : (
          groupedProvinces.map((gp, i) => (
             <span key={`${gp.province}-${i}`} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200">
               {gp.province === '全国' ? '全国' : `${gp.province}(${gp.selectedCount})`}
               <button onClick={(e) => removeProvince(e, gp.province)} className="hover:text-red-500 rounded-full transition-colors ml-0.5" title="清除该省份选择">
                 <X size={12} />
               </button>
             </span>
          ))
        )}
        <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full sm:w-[480px] bg-white border border-slate-200 rounded-xl shadow-lg z-[100] flex overflow-hidden max-h-[300px]">
          {/* 左侧省份 */}
          <div className="w-1/2 border-r border-slate-100/100 bg-slate-50/50 overflow-y-auto">
            {REGION_DATA.map(region => {
               const cityCount = region.cities.length;
               const selectedCityCount = value.filter(v => v.province === region.province).length;
               const isAllSelected = selectedCityCount === cityCount;
               const isPartiallySelected = selectedCityCount > 0 && selectedCityCount < cityCount;

               return (
                 <div 
                   key={region.province}
                   className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${activeProvince === region.province ? 'bg-white font-bold text-blue-600 border-l-2 border-l-blue-500' : 'text-slate-700 hover:bg-slate-100 border-l-2 border-l-transparent'}`}
                   onClick={() => setActiveProvince(region.province)}
                 >
                   <div className="flex items-center gap-3 w-full">
                     <div 
                       className="relative w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
                       onClick={(e) => {
                         e.stopPropagation();
                         handleProvinceToggle(region.province);
                         setActiveProvince(region.province);
                       }}
                     >
                       <input 
                         type="checkbox" 
                         className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                       />
                       <div className={`w-full h-full rounded border flex items-center justify-center transition-colors ${isAllSelected ? 'bg-blue-500 border-blue-500' : isPartiallySelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                         {isAllSelected && <Check size={12} className="text-white relative z-0" />}
                         {isPartiallySelected && <div className="w-2 h-0.5 bg-white rounded-full"></div>}
                       </div>
                     </div>
                     <span className="flex-1 select-none">{region.province}</span>
                     {selectedCityCount > 0 && (
                       <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium ml-auto">
                         {selectedCityCount}/{cityCount}
                       </span>
                     )}
                   </div>
                 </div>
               )
            })}
          </div>

          {/* 右侧城市 */}
          <div className="w-1/2 overflow-y-auto bg-white p-2">
            {activeProvinceData?.cities.map(city => {
              const isSelected = value.some(v => v.province === activeProvince && v.city === city);
              return (
                <div 
                  key={city}
                  className="px-3 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors group"
                  onClick={() => handleCityToggle(activeProvince, city)}
                >
                   <div 
                     className="relative w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
                   >
                     <div className={`w-full h-full rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                       {isSelected && <Check size={12} className="text-white relative z-0" />}
                     </div>
                   </div>
                   <span className={`select-none text-sm transition-colors ${isSelected ? 'text-blue-600 font-medium' : 'text-slate-700 group-hover:text-slate-900'}`}>{city === '全国区划' ? '全国' : city}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
