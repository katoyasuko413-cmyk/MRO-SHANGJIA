import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, X, Check, ChevronDown, HelpCircle } from 'lucide-react';
import { UploadBox } from './UploadBox';
import { RegionSelect } from '../../components/common/RegionSelect';

// Mock category data
const CATEGORIES = [
  { id: '1', name: '个人防护', subCategories: [{ id: '1-1', name: '头部防护' }, { id: '1-2', name: '眼面部防护' }, { id: '1-3', name: '听力防护' }, { id: '1-4', name: '呼吸防护' }] },
  { id: '2', name: '手动工具', subCategories: [{ id: '2-1', name: '扳手' }, { id: '2-2', name: '螺丝批' }, { id: '2-3', name: '钳子' }, { id: '2-4', name: '锤子' }] },
  { id: '3', name: '电动工具', subCategories: [{ id: '3-1', name: '电钻' }, { id: '3-2', name: '角磨机' }, { id: '3-3', name: '电锯' }, { id: '3-4', name: '电锤' }] },
  { id: '4', name: '气动工具', subCategories: [{ id: '4-1', name: '气动扳手' }, { id: '4-2', name: '气动螺丝批' }, { id: '4-3', name: '除锈机' }] },
  { id: '5', name: '物料搬运', subCategories: [{ id: '5-1', name: '叉车' }, { id: '5-2', name: '推车' }, { id: '5-3', name: '吊装设备' }, { id: '5-4', name: '起重葫芦' }] },
];

const PRESET_BRANDS = [
  { name: '华为', enName: 'HUAWEI', initial: 'H' },
  { name: '小米', enName: 'XIAOMI', initial: 'X' },
  { name: '苹果', enName: 'Apple', initial: 'A' },
  { name: '联想', enName: 'Lenovo', initial: 'L' },
  { name: '戴尔', enName: 'DELL', initial: 'D' },
  { name: '霍尼韦尔', enName: 'Honeywell', initial: 'H' },
  { name: '3M', enName: '3M', initial: 'M' },
];

const CHINA_REGIONS = [
  {
    province: '江苏省',
    cities: [
      {
        name: '苏州市',
        districts: ['虎丘区', '吴中区', '相城区', '姑苏区', '吴江区', '常熟市', '张家港市', '昆山市', '太仓市']
      },
      {
        name: '南京市',
        districts: ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区']
      },
      {
        name: '无锡市',
        districts: ['梁溪区', '锡山区', '惠山区', '滨湖区', '新吴区', '江阴市', '宜兴市']
      },
      {
        name: '常州市',
        districts: ['天宁区', '钟楼区', '新北区', '武进区', '金坛区', '溧阳市']
      },
      {
        name: '南通市',
        districts: ['崇川区', '港闸区', '通州区', '海安市', '如东县', '启东市', '如皋市', '海门市']
      }
    ]
  },
  {
    province: '浙江省',
    cities: [
      {
        name: '杭州市',
        districts: ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市']
      },
      {
        name: '宁波市',
        districts: ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市']
      },
      {
        name: '温州市',
        districts: ['鹿城区', '龙湾区', '瓯海区', '洞头区', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '瑞安市', '乐清市', '龙港市']
      },
      {
        name: '嘉兴市',
        districts: ['南湖区', '秀洲区', '嘉善县', '海盐县', '海宁市', '平湖市', '桐乡市']
      },
      {
        name: '绍兴市',
        districts: ['越城区', '柯桥区', '上虞区', '新昌县', '诸暨市', '嵊州市']
      }
    ]
  },
  {
    province: '广东省',
    cities: [
      {
        name: '广州市',
        districts: ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区']
      },
      {
        name: '深圳市',
        districts: ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区']
      },
      {
        name: '东莞市',
        districts: ['莞城区', '南城区', '东城区', '万江城区', '长安镇', '东坑镇', '厚街镇', '塘厦镇', '常平镇']
      },
      {
        name: '佛山市',
        districts: ['禅城区', '南海区', '顺德区', '三水区', '高明区']
      }
    ]
  },
  {
    province: '北京市',
    cities: [
      {
        name: '北京市',
        districts: ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
      }
    ]
  },
  {
    province: '上海市',
    cities: [
      {
        name: '上海市',
        districts: ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
      }
    ]
  }
];

export default function Step3BusinessInfo({ mockData }: { mockData?: boolean }) {
  const [brands, setBrands] = useState<any[]>(
    mockData 
      ? [{ id: 1, name: '小米', enName: 'XIAOMI', initial: 'X', isPreset: true, nature: '一级代理商', serviceAreas: [] }] 
      : [{ id: 1, name: '', enName: '', initial: '', isPreset: false, nature: '', serviceAreas: [] }]
  );
  const [activeBrandDropdown, setActiveBrandDropdown] = useState<number | null>(null);
  const [qualifications, setQualifications] = useState([{ id: 1 }]);
  
  // 仓储运营相关状态
  const [engineerCount, setEngineerCount] = useState<string>(mockData ? '15' : '');
  const [vehicleCount, setVehicleCount] = useState<string>(mockData ? '8' : '');
  const [warehouses, setWarehouses] = useState<any[]>(
    mockData 
      ? [{ id: 1, province: '江苏省', city: '苏州市', district: '虎丘区', detail: '高新开发区白榆路102号仓' }] 
      : [{ id: 1, province: '', city: '', district: '', detail: '' }]
  );

  const addWarehouse = () => setWarehouses([...warehouses, { id: Date.now(), province: '', city: '', district: '', detail: '' }]);
  const removeWarehouse = (id: number) => setWarehouses(warehouses.filter(w => w.id !== id));
  
  const updateWarehouse = (id: number, field: string | Record<string, string>, value?: string) => {
    setWarehouses(prev => prev.map(w => {
      if (w.id === id) {
        if (typeof field === 'object') {
          return { ...w, ...field };
        } else {
          return { ...w, [field]: value };
        }
      }
      return w;
    }));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<{id: string, name: string, parentName: string}[]>(
    mockData 
      ? [{id: '1-1', name: '头部防护', parentName: '个人防护'}, {id: '2-1', name: '扳手', parentName: '手动工具'}]
      : []
  );
  const [activeParentId, setActiveParentId] = useState<string>(CATEGORIES[0]?.id || '');

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const selectedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const container = selectedContainerRef.current;
      if (!container) return;
      // Single line height with py-2 (16px) and 34px tags is around 50px.
      // If scrollHeight is greater than 52px, there are multiple lines.
      setHasOverflow(container.scrollHeight > 52);
    };

    // Run measurement on next tick to ensure DOM is fully rendered
    const timer = setTimeout(checkOverflow, 0);

    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [selectedCategories]);

  const addBrand = () => setBrands([...brands, { id: Date.now(), name: '', enName: '', initial: '', isPreset: false, nature: '', serviceAreas: [] }]);
  const removeBrand = (id: number) => setBrands(brands.filter(b => b.id !== id));

  const updateBrand = (id: number, field: string, value: any) => {
    setBrands(brands.map(b => {
      if (b.id !== id) return b;
      
      if (field === 'name') {
        const preset = PRESET_BRANDS.find(p => p.name === value);
        if (preset) {
           return { ...b, name: preset.name, enName: preset.enName, initial: preset.initial, isPreset: true };
        } else {
           return { ...b, name: value, isPreset: false };
        }
      }
      return { ...b, [field]: value };
    }));
  };

  const handlePresetSelect = (brandId: number, preset: any) => {
    setBrands(brands.map(b => 
      b.id === brandId ? { ...b, name: preset.name, enName: preset.enName, initial: preset.initial, isPreset: true } : b
    ));
    setActiveBrandDropdown(null);
  }

  const addQual = () => setQualifications([...qualifications, { id: Date.now() }]);
  const removeQual = (id: number) => setQualifications(qualifications.filter(q => q.id !== id));

  const toggleCategory = (parentName: string, cat: {id: string, name: string}) => {
    const isSelected = selectedCategories.some(c => c.id === cat.id);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== cat.id));
    } else {
      setSelectedCategories([...selectedCategories, { ...cat, parentName }]);
    }
  };

  const removeSelectedCategory = (id: string) => {
    setSelectedCategories(selectedCategories.filter(c => c.id !== id));
  };

  const toggleParentCategory = (parent: typeof CATEGORIES[0], isChecked: boolean) => {
    if (isChecked) {
      const newSelected = [...selectedCategories];
      parent.subCategories.forEach(sub => {
        if (!newSelected.some(c => c.id === sub.id)) {
          newSelected.push({ ...sub, parentName: parent.name });
        }
      });
      setSelectedCategories(newSelected);
    } else {
      const subIds = parent.subCategories.map(sub => sub.id);
      setSelectedCategories(selectedCategories.filter(c => !subIds.includes(c.id)));
    }
  };

  // 过滤类目
  const filteredCategories = CATEGORIES.map(parent => ({
    ...parent,
    subCategories: parent.subCategories.filter(sub => 
      parent.name.includes(searchQuery) || sub.name.includes(searchQuery)
    )
  })).filter(parent => parent.subCategories.length > 0);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* 品牌信息 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">品牌信息</h3>
          <button onClick={addBrand} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={16} /> 添加品牌
          </button>
        </div>
        
        <div className="space-y-4">
          {brands.map((brand, index) => (
            <div key={brand.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
              {brands.length > 1 && (
                <button onClick={() => removeBrand(brand.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1" title="删除品牌">
                  <Trash2 size={18} />
                </button>
              )}
              <h4 className="font-bold text-slate-700 mb-3 text-sm">品牌 {index + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1.5 relative">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>品牌名称</label>
                    <div className="relative group/tooltip">
                      <HelpCircle size={14} className="text-slate-400 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-slate-800 text-slate-100 text-xs rounded-lg p-3 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[999] pointer-events-none after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-slate-800 shadow-lg leading-relaxed">
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
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      placeholder="请输入品牌名称或下拉选择" 
                      value={brand.name}
                      onChange={(e) => updateBrand(brand.id, 'name', e.target.value)}
                      onFocus={() => setActiveBrandDropdown(brand.id)}
                      onBlur={() => setTimeout(() => setActiveBrandDropdown(null), 200)}
                    />
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {activeBrandDropdown === brand.id && (
                     <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                       {PRESET_BRANDS.filter(b => b.name.toLowerCase().includes(brand.name.toLowerCase())).length > 0 ? (
                         PRESET_BRANDS.filter(b => b.name.toLowerCase().includes(brand.name.toLowerCase())).map(preset => (
                           <div 
                             key={preset.name} 
                             className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                             onMouseDown={(e) => { e.preventDefault(); handlePresetSelect(brand.id, preset); }}
                           >
                             {preset.name}
                           </div>
                         ))
                       ) : brand.name.trim() ? (
                         <div className="px-3 py-2 hover:bg-slate-50 text-sm text-slate-600 cursor-pointer" onMouseDown={(e) => { e.preventDefault(); setActiveBrandDropdown(null); }}>
                           使用自定义品牌: "<span className="font-medium text-slate-800">{brand.name}</span>"
                         </div>
                       ) : (
                         <div className="px-3 py-2 text-sm text-slate-400">
                           暂无匹配品牌
                         </div>
                       )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800">英文名称</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500" 
                    placeholder="请输入英文名称" 
                    value={brand.enName}
                    onChange={(e) => updateBrand(brand.id, 'enName', e.target.value)}
                    disabled={brand.isPreset}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800">英文首字母</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 uppercase" 
                    placeholder="例如: A" 
                    value={brand.initial}
                    onChange={(e) => updateBrand(brand.id, 'initial', e.target.value.toUpperCase())}
                    disabled={brand.isPreset}
                    maxLength={1}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>品牌性质</label>
                  <select 
                    value={brand.nature}
                    onChange={(e) => updateBrand(brand.id, 'nature', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">请选择品牌性质</option>
                    <option value="原厂品牌">原厂品牌</option>
                    <option value="一级代理商">一级代理商</option>
                    <option value="二级代理商">二级代理商</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>服务区域</label>
                  <RegionSelect 
                    value={brand.serviceAreas || []} 
                    onChange={(val) => updateBrand(brand.id, 'serviceAreas', val)}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-800">
                    <span className="text-red-500 mr-1">*</span>
                    {brand.nature === '一级代理商' || brand.nature === '二级代理商' ? '品牌授权书' : '商标注册证'}
                  </label>
                  <div className="text-xs text-slate-500 mt-1 mb-2">支持 PNG, JPG, PDF，大小不超过 10M。</div>
                  <div className="w-auto inline-block">
                    <UploadBox title={brand.nature === '一级代理商' || brand.nature === '二级代理商' ? '上传品牌授权书' : '上传商标注册证'} />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-800">有效期</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="YYYY-MM-DD" />
                    <span className="text-slate-400">-</span>
                    <input type="text" className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="YYYY-MM-DD 或长期" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 资质信息 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">资质信息</h3>
          <button onClick={addQual} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={16} /> 添加资质
          </button>
        </div>
        
        <div className="space-y-4">
          {qualifications.map((qual, index) => (
            <div key={qual.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
              {qualifications.length > 1 && (
                <button onClick={() => removeQual(qual.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1" title="删除资质">
                  <Trash2 size={18} />
                </button>
              )}
              <h4 className="font-bold text-slate-700 mb-3 text-sm">资质 {index + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-800">资质类型</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                    <option value="">请选择资质类型</option>
                    <option value="质检报告">质检报告</option>
                    <option value="工业品生产许可证">工业品生产许可证</option>
                    <option value="3C认证证书">3C认证证书</option>
                    <option value="危险化学品经营许可证">危险化学品经营许可证</option>
                    <option value="危险化学品安全生产许可证">危险化学品安全生产许可证</option>
                    <option value="ISO9001证书">ISO9001证书</option>
                    <option value="其他证明文件">其他证明文件</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-800">资质文件上传</label>
                   <div className="text-xs text-slate-500 mt-1 mb-2">支持图片或 PDF 格式，大小不超过 10M。</div>
                  <div className="w-auto inline-block">
                    <UploadBox title="上传资质文件" />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-800">资质有效期</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="YYYY-MM-DD" />
                    <span className="text-slate-400">-</span>
                    <input type="text" className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="YYYY-MM-DD 或长期" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 仓储运营 */}
      <div className="mb-8">
        <div className="flex items-center mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">仓储运营</h3>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 flex items-center">
                <span className="text-red-500 mr-1">*</span>工程师数量
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  required
                  className={`w-full border rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none transition-colors bg-white disabled:bg-slate-50 ${
                    !engineerCount 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`} 
                  placeholder="请输入工程师数量（必填）" 
                  value={engineerCount}
                  onChange={(e) => setEngineerCount(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">人</span>
              </div>
              {!engineerCount && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium select-none anim-fade-in">请填写工程师数量，如无请填 0</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 flex items-center">
                <span className="text-red-500 mr-1">*</span>车辆数量
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  required
                  className={`w-full border rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none transition-colors bg-white disabled:bg-slate-50 ${
                    !vehicleCount 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`} 
                  placeholder="请输入车辆数量（必填）" 
                  value={vehicleCount}
                  onChange={(e) => setVehicleCount(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">辆</span>
              </div>
              {!vehicleCount && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium select-none anim-fade-in">请填写车辆数量，如无请填 0</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-800 block">仓库地址</label>
            
            <div className="space-y-3">
              {warehouses.map((warehouse, index) => (
                <div key={warehouse.id} className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  {warehouses.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeWarehouse(warehouse.id)} 
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1" 
                      title="删除此仓库"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  <div className="text-xs font-bold text-slate-500 mb-2">仓库地址 #{index + 1}</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block"><span className="text-red-500 mr-0.5">*</span>省份</label>
                      <select 
                        className={`w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white ${
                          !warehouse.province ? 'border-red-300' : 'border-slate-200'
                        }`}
                        value={warehouse.province}
                        onChange={(e) => updateWarehouse(warehouse.id, { province: e.target.value, city: '', district: '' })}
                      >
                        <option value="">请选择省份</option>
                        {CHINA_REGIONS.map(p => (
                          <option key={p.province} value={p.province}>{p.province}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block"><span className="text-red-500 mr-0.5">*</span>城市</label>
                      {(() => {
                        const provinceData = CHINA_REGIONS.find(p => p.province === warehouse.province);
                        const cities = provinceData ? provinceData.cities : [];
                        return (
                          <select 
                            className={`w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 ${
                              !warehouse.city && warehouse.province ? 'border-red-300' : 'border-slate-200'
                            }`}
                            value={warehouse.city}
                            disabled={!warehouse.province}
                            onChange={(e) => updateWarehouse(warehouse.id, { city: e.target.value, district: '' })}
                          >
                            <option value="">请选择城市</option>
                            {cities.map(c => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        );
                      })()}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block"><span className="text-red-500 mr-0.5">*</span>区/县</label>
                      {(() => {
                        const provinceData = CHINA_REGIONS.find(p => p.province === warehouse.province);
                        const cityData = provinceData?.cities.find(c => c.name === warehouse.city);
                        const districts = cityData ? cityData.districts : [];
                        return (
                          <select 
                            className={`w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 ${
                              !warehouse.district && warehouse.city ? 'border-red-300' : 'border-slate-200'
                            }`}
                            value={warehouse.district}
                            disabled={!warehouse.city}
                            onChange={(e) => updateWarehouse(warehouse.id, 'district', e.target.value)}
                          >
                            <option value="">请选择区/县</option>
                            {districts.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        );
                      })()}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block"><span className="text-red-500 mr-0.5">*</span>详细地址</label>
                      <input 
                        type="text" 
                        required
                        className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 ${
                          !warehouse.detail ? 'border-red-300' : 'border-slate-200'
                        }`}
                        placeholder="街道、楼牌号或详细位置" 
                        value={warehouse.detail}
                        onChange={(e) => updateWarehouse(warehouse.id, 'detail', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={addWarehouse} 
              className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 rounded-xl text-sm font-bold transition-all bg-white hover:bg-blue-50/20 flex items-center justify-center gap-1"
            >
              <Plus size={16} /> 点击添加仓库地址
            </button>
          </div>
        </div>
      </div>

       {/* 类目信息 */}
       <div className="mb-0">
         <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">主营类目</h3>
         
         <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-700 mb-3 hidden">已选类目 ({selectedCategories.length})</h4>
            <div className="hidden">
               {selectedCategories.length === 0 ? (
                 <span className="text-sm text-slate-400 ml-2">请选择主营类目</span>
               ) : (
                 selectedCategories.map(cat => (
                   <span key={cat.id} className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm border border-blue-200">
                     <span>{cat.parentName}</span>
                     <span className="text-blue-400 text-xs">/</span>
                     <span className="font-bold">{cat.name}</span>
                     <button onClick={() => removeSelectedCategory(cat.id)} className="ml-1 hover:text-blue-900 rounded-full hover:bg-blue-200 p-0.5 transition-colors">
                       <X size={14} />
                     </button>
                   </span>
                 ))
               )}
            </div>
         </div>

         <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索类目名称..." 
                  className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="bg-white flex h-[320px]">
               {searchQuery.trim() !== '' ? (
                 <div className="w-full p-4 overflow-y-auto">
                   {filteredCategories.length > 0 ? (
                     filteredCategories.map(parent => (
                       <div key={parent.id} className="mb-4 last:mb-0">
                         <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1">
                           <div className="px-1 text-sm font-bold text-slate-700">
                             {parent.name}
                           </div>
                           <label className="flex items-center gap-2 cursor-pointer group text-sm text-slate-600 hover:text-blue-600 px-1">
                             <input 
                               type="checkbox"
                               checked={parent.subCategories.length > 0 && parent.subCategories.every(sub => selectedCategories.some(c => c.id === sub.id))}
                               onChange={(e) => toggleParentCategory(parent, e.target.checked)}
                               className="w-4 h-4 text-blue-500 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                             />
                             <span>全选</span>
                           </label>
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                           {parent.subCategories.map(sub => {
                             const isSelected = selectedCategories.some(c => c.id === sub.id);
                             return (
                               <label 
                                 key={sub.id} 
                                 className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-all ${
                                   isSelected 
                                   ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                   : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-600'
                                 }`}
                               >
                                 <input 
                                   type="checkbox" 
                                   checked={isSelected}
                                   onChange={() => toggleCategory(parent.name, sub)}
                                   className="hidden"
                                 />
                                 <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                 </div>
                                 <span className="text-sm truncate" title={sub.name}>{sub.name}</span>
                               </label>
                             );
                           })}
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="py-12 text-center text-slate-400 text-sm">
                       没有找到相关的类目
                     </div>
                   )}
                 </div>
               ) : (
                 <>
                   {/* Left Pane - Parent Categories */}
                   <div className="w-1/3 md:w-1/4 border-r border-slate-100 bg-slate-50/50 overflow-y-auto">
                     {CATEGORIES.map(parent => (
                       <div 
                         key={parent.id} 
                         onClick={() => setActiveParentId(parent.id)}
                         className={`px-4 py-3 text-sm cursor-pointer border-l-2 transition-all ${
                           activeParentId === parent.id 
                           ? 'border-blue-500 bg-white text-blue-600 font-bold shadow-[inset_0_-1px_0_0_#f1f5f9,inset_0_1px_0_0_#f1f5f9]' 
                           : 'border-transparent text-slate-600 hover:bg-slate-100'
                         }`}
                       >
                         {parent.name}
                       </div>
                     ))}
                   </div>
                   
                   {/* Right Pane - Sub Categories */}
                   <div className="flex-1 p-4 overflow-y-auto bg-white">
                     {(() => {
                       const activeParent = CATEGORIES.find(c => c.id === activeParentId);
                       if (!activeParent) return null;
                       return (
                         <div>
                           <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                             <div className="text-sm font-bold text-slate-800">{activeParent.name}</div>
                             <label className="flex items-center gap-2 cursor-pointer group text-sm text-slate-600 hover:text-blue-600">
                               <input 
                                 type="checkbox"
                                 checked={activeParent.subCategories.length > 0 && activeParent.subCategories.every(sub => selectedCategories.some(c => c.id === sub.id))}
                                 onChange={(e) => toggleParentCategory(activeParent, e.target.checked)}
                                 className="w-4 h-4 text-blue-500 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                               />
                               <span>全选</span>
                             </label>
                           </div>
                           <div className="grid grid-cols-3 gap-2">
                             {activeParent.subCategories.map(sub => {
                               const isSelected = selectedCategories.some(c => c.id === sub.id);
                               return (
                                 <label 
                                   key={sub.id} 
                                   className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                                     isSelected 
                                     ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                     : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-600'
                                   }`}
                                 >
                                   <input 
                                     type="checkbox" 
                                     checked={isSelected}
                                     onChange={() => toggleCategory(activeParent.name, sub)}
                                     className="hidden"
                                   />
                                   <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                                      {isSelected && <Check size={12} className="text-white" />}
                                   </div>
                                   <span className="text-sm truncate" title={sub.name}>{sub.name}</span>
                                 </label>
                               );
                             })}
                           </div>
                         </div>
                       );
                     })()}
                   </div>
                 </>
               )}
            </div>
         </div>

          <div className="mt-4">
             <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-700">已选类目 ({selectedCategories.length})</h4>
                {hasOverflow && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    type="button"
                  >
                    <span>{isExpanded ? '收起' : '展开'}</span>
                    <ChevronDown size={14} className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
             </div>
             <div 
                ref={selectedContainerRef}
                className={`border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 flex gap-2 flex-wrap items-center transition-all duration-300 ${
                  isExpanded ? 'max-h-[500px]' : 'max-h-[50px] overflow-hidden'
                }`}
             >
                {selectedCategories.length === 0 ? (
                  <span className="text-sm text-slate-400 ml-2">请选择主营类目</span>
                ) : (
                  selectedCategories.map(cat => (
                    <span key={cat.id} className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm border border-blue-200 animate-in zoom-in-95 duration-100">
                      <span>{cat.parentName}</span>
                      <span className="text-blue-400 text-xs">/</span>
                      <span className="font-bold">{cat.name}</span>
                      <button onClick={() => removeSelectedCategory(cat.id)} className="ml-1 hover:text-blue-900 rounded-full hover:bg-blue-200 p-0.5 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
             </div>
          </div>
       </div>

    </div>
  );
}
