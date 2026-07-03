import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, ChevronDown, HelpCircle } from 'lucide-react';

const PRESET_BRANDS = [
  { name: '华为', enName: 'HUAWEI', initial: 'H', logo: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=100&h=100&fit=crop&q=80' },
  { name: '小米', enName: 'XIAOMI', initial: 'X', logo: 'https://images.unsplash.com/photo-1614680376712-42a26179e0de?w=100&h=100&fit=crop&q=80' },
  { name: '苹果', enName: 'Apple', initial: 'A', logo: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&h=100&fit=crop&q=80' },
  { name: '联想', enName: 'Lenovo', initial: 'L', logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop&q=80' },
  { name: '戴尔', enName: 'DELL', initial: 'D', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80' },
  { name: '霍尼韦尔', enName: 'Honeywell', initial: 'H', logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=100&h=100&fit=crop&q=80' },
  { name: '3M', enName: '3M', initial: 'M', logo: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=100&h=100&fit=crop&q=80' },
];

interface BrandApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brandData: any) => void;
  initialData?: any;
  rejectReason?: string;
  isView?: boolean;
}

export function BrandApplicationModal({ isOpen, onClose, onSave, initialData, rejectReason, isView }: BrandApplicationModalProps) {
  const [brandName, setBrandName] = useState('');
  const [enName, setEnName] = useState('');
  const [initial, setInitial] = useState('');
  const [isPreset, setIsPreset] = useState(false);
  const [activeBrandDropdown, setActiveBrandDropdown] = useState(false);
  const [nature, setNature] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setBrandName(initialData.name || '');
        setEnName(initialData.enName || '');
        setInitial(initialData.initial || '');
        setIsPreset(!!PRESET_BRANDS.find(p => p.name === initialData.name));
        setNature(initialData.nature || '');
        setServiceArea(initialData.serviceArea || '');
        setLogo(initialData.logo || '');
        
        // Extract start and end dates from validityPeriod (format: "YYYY-MM-DD 至 YYYY-MM-DD")
        if (initialData.validityPeriod) {
          const parts = initialData.validityPeriod.split(' 至 ');
          if (parts.length === 2) {
            setStartDate(parts[0]);
            setEndDate(parts[1] === '长期' ? '' : parts[1]);
          } else {
             setStartDate('');
             setEndDate('');
          }
        } else {
          setStartDate('');
          setEndDate('');
        }
      } else {
        setBrandName('');
        setEnName('');
        setInitial('');
        setIsPreset(false);
        setNature('');
        setServiceArea('');
        setStartDate('');
        setEndDate('');
        setLogo('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (brandName.trim()) {
      onSave({
        ...initialData,
        name: brandName,
        enName,
        initial,
        nature,
        serviceArea,
        logo,
        validityPeriod: startDate && endDate ? `${startDate} 至 ${endDate}` : '2024-01-01 至 2025-01-01'
      });
    }
  };

  const handleBrandNameChange = (val: string) => {
    const preset = PRESET_BRANDS.find(p => p.name === val);
    if (preset) {
      setBrandName(preset.name);
      setEnName(preset.enName);
      setInitial(preset.initial);
      setLogo(preset.logo || '');
      setIsPreset(true);
    } else {
      setBrandName(val);
      setLogo('');
      setIsPreset(false);
    }
  };

  const handlePresetSelect = (preset: any) => {
    setBrandName(preset.name);
    setEnName(preset.enName);
    setInitial(preset.initial);
    setLogo(preset.logo || '');
    setIsPreset(true);
    setActiveBrandDropdown(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-900">{isView ? '品牌详情' : initialData ? '编辑品牌' : '品牌申请'}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {rejectReason && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
               <div className="font-semibold shrink-0 mt-0.5">驳回原因：</div>
               <div>{rejectReason}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex items-center gap-4 relative">
              <div className="w-24 shrink-0 flex items-center justify-end gap-1">
                <label className="text-sm font-medium text-slate-700">
                  <span className="text-red-500 mr-1">*</span>品牌名称
                </label>
                <div className="relative group/tooltip">
                  <HelpCircle size={14} className="text-slate-400 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-slate-800 text-slate-100 text-xs rounded-lg p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[999] pointer-events-none after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-slate-800 shadow-lg leading-relaxed text-left">
                    <div className="font-semibold text-blue-300 mb-1">【逻辑说明】</div>
                    <ul className="list-decimal pl-4 space-y-1">
                      <li>支持模糊搜索匹配系统品牌库。</li>
                      <li>若选择品牌库中已有品牌，将自动带出「英文名称」和「英文首字母」且不可编辑。</li>
                      <li>若输入自定义的新品牌（未被系统收录），则需手动补充「英文名称」和「英文首字母」。</li>
                      <li>入驻资质认证审核通过后，提交的自定义品牌将自动同步至「品牌提交记录」列表，并在该列表中直接显示为「审核通过」状态。</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder={isView ? "" : "请输入品牌名称或下拉选择"}
                  value={brandName}
                  onChange={(e) => handleBrandNameChange(e.target.value)}
                  onFocus={() => setActiveBrandDropdown(true)}
                  onBlur={() => setTimeout(() => setActiveBrandDropdown(false), 200)}
                  disabled={isView}
                  className="w-full pl-3 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
                {!isView && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                
                {activeBrandDropdown && !isView && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {PRESET_BRANDS.filter(b => b.name.toLowerCase().includes(brandName.toLowerCase())).length > 0 ? (
                      PRESET_BRANDS.filter(b => b.name.toLowerCase().includes(brandName.toLowerCase())).map(preset => (
                        <div 
                          key={preset.name} 
                          className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                          onMouseDown={(e) => { e.preventDefault(); handlePresetSelect(preset); }}
                        >
                          {preset.name}
                        </div>
                      ))
                    ) : brandName.trim() ? (
                      <div className="px-3 py-2 hover:bg-slate-50 text-sm text-slate-600 cursor-pointer" onMouseDown={(e) => { e.preventDefault(); setActiveBrandDropdown(false); }}>
                        使用自定义品牌: "<span className="font-medium text-slate-800">{brandName}</span>"
                      </div>
                    ) : (
                      <div className="px-3 py-2 text-sm text-slate-400">
                        暂无匹配品牌
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <label className="w-24 text-right text-sm font-medium text-slate-700 shrink-0">
                英文名称
              </label>
              <input 
                type="text" 
                placeholder={isView ? "" : "请输入英文名称"} 
                value={enName}
                onChange={(e) => setEnName(e.target.value)}
                disabled={isView || isPreset}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <label className="w-24 text-right text-sm font-medium text-slate-700 shrink-0">
                英文首字母
              </label>
              <input 
                type="text" 
                placeholder={isView ? "" : "例如: A"} 
                value={initial}
                onChange={(e) => setInitial(e.target.value.toUpperCase())}
                maxLength={1}
                disabled={isView || isPreset}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 uppercase"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <label className="w-24 text-right text-sm font-medium text-slate-700 shrink-0">
                品牌性质
              </label>
              <select 
                value={nature}
                onChange={(e) => setNature(e.target.value)}
                disabled={isView}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="">请选择品牌性质</option>
                <option value="原厂品牌">原厂品牌</option>
                <option value="一级代理商">一级代理商</option>
                <option value="二级代理商">二级代理商</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-24 text-right text-sm font-medium text-slate-700 shrink-0">
                服务区域
              </label>
              <input 
                type="text" 
                placeholder={isView ? "" : "省份、城市 (例如：浙江省 杭州市)"} 
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                disabled={isView}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:col-span-1">
              <label className="w-auto sm:w-24 text-left sm:text-right text-sm font-medium text-slate-700 shrink-0 mt-2 sm:mt-0">
                有效期
              </label>
              <div className="flex-1 flex items-center gap-1 sm:gap-2 border border-slate-200 rounded-lg px-2 sm:px-3 py-2 min-w-0">
                <Calendar size={16} className="text-slate-400 shrink-0" />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isView} placeholder={isView ? "" : "开始日期"} className="w-full text-sm outline-none bg-transparent min-w-0 disabled:text-slate-500 disabled:bg-transparent" />
                <span className="text-slate-400 text-sm shrink-0">至</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isView} placeholder={isView ? "" : "结束日期"} className="w-full text-sm outline-none bg-transparent min-w-0 disabled:text-slate-500 disabled:bg-transparent" />
              </div>
            </div>

            <div className="flex gap-4 col-span-2">
              <label className="w-24 text-right text-sm font-medium text-slate-700 shrink-0 mt-2">
                品牌Logo
              </label>
              <div className="flex items-end gap-3">
                {logo ? (
                  <div className="relative w-28 h-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
                    <img src={logo} alt="Brand Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {!isView && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setLogo('')}
                          className="text-white hover:text-red-400 p-1.5 bg-black/50 rounded-full transition-colors font-semibold"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    type="button"
                    disabled={isView}
                    onClick={() => {
                      // 模拟Logo上传
                      setLogo(`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80&sig=${Math.floor(Math.random() * 1000)}`);
                    }}
                    className={`w-28 h-28 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 ${isView ? 'bg-slate-50 cursor-not-allowed' : 'hover:text-blue-500 hover:border-blue-500 cursor-pointer'} transition-colors bg-slate-50 gap-2`}
                  >
                    <Plus size={24} className="opacity-50" />
                    <span className="text-xs">{isView ? '未上传' : '上传Logo'}</span>
                  </button>
                )}
                <div className="text-xs text-slate-400 pb-2">
                  支持jpg/png格式，建议尺寸为200x200像素<br/>
                  文件大小不超过2MB
                </div>
              </div>
            </div>

            <div className="flex gap-4 col-span-2">
              <label className="w-24 text-right text-sm font-medium text-slate-700 shrink-0 mt-2">
                {nature === '原厂品牌' ? '商标注册证' : '品牌授权书'}
              </label>
              <div className="flex items-end gap-3">
                <div className={`w-28 h-28 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 ${isView ? 'bg-slate-50 cursor-not-allowed' : 'hover:text-blue-500 hover:border-blue-500 cursor-pointer'} transition-colors bg-slate-50 gap-2`}>
                  <Plus size={24} className="opacity-50" />
                  <span className="text-xs">{isView ? '已上传' : '上传证件'}</span>
                </div>
                <div className="text-xs text-slate-400 pb-2">
                  支持jpg/png/pdf格式，要求清晰可见<br/>
                  文件大小不超过5MB
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            {isView ? '关闭' : '取消'}
          </button>
          {!isView && (
            <button 
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-all shadow-sm"
            >
              提交申请
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
