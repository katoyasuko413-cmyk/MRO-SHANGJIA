import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product } from '../../models/product';
import { BrandApplicationModal } from './BrandApplicationModal';
import { NumberInput } from './NumberInput';
import { TagsInput } from './TagsInput';
import { ImageUploader } from './ImageUploader';
import { CategorySelect } from './CategorySelect';
import { MultiSelect } from './MultiSelect';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // null/undefined for create, Product for copy/edit
  mode?: 'create' | 'copy' | 'edit';
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
    <span className="text-red-500">*</span>{children}
  </label>
);

const OptionalLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
    {children}
  </label>
);

const sceneOptions = [
  { value: 'office', label: '办公' },
  { value: 'factory', label: '工厂' },
  { value: 'outdoor', label: '户外' }
];

const provinceOptions = [
  { value: '北京市', label: '北京市' },
  { value: '上海市', label: '上海市' },
  { value: '天津市', label: '天津市' },
  { value: '重庆市', label: '重庆市' },
  { value: '广东省', label: '广东省' },
  { value: '江苏省', label: '江苏省' },
  { value: '浙江省', label: '浙江省' },
  { value: '福建省', label: '福建省' },
  { value: '山东省', label: '山东省' },
  { value: '湖北省', label: '湖北省' },
  { value: '湖南省', label: '湖南省' },
  { value: '四川省', label: '四川省' },
  { value: '陕西省', label: '陕西省' },
  { value: '河北省', label: '河北省' },
  { value: '河南省', label: '河南省' },
  { value: '山西省', label: '山西省' },
  { value: '辽宁省', label: '辽宁省' },
  { value: '吉林省', label: '吉林省' },
  { value: '黑龙江省', label: '黑龙江省' },
  { value: '安徽省', label: '安徽省' },
  { value: '江西省', label: '江西省' },
  { value: '海南省', label: '海南省' },
  { value: '贵州省', label: '贵州省' },
  { value: '云南省', label: '云南省' },
  { value: '甘肃省', label: '甘肃省' },
  { value: '青海省', label: '青海省' },
  { value: '台湾省', label: '台湾省' },
  { value: '内蒙古自治区', label: '内蒙古自治区' },
  { value: '广西壮族自治区', label: '广西壮族自治区' },
  { value: '西藏自治区', label: '西藏自治区' },
  { value: '宁夏回族自治区', label: '宁夏回族自治区' },
  { value: '新疆维吾尔自治区', label: '新疆维吾尔自治区' },
  { value: '香港特别行政区', label: '香港特别行政区' },
  { value: '澳门特别行政区', label: '澳门特别行政区' }
];

export function ProductFormModal({ isOpen, onClose, product, mode = 'create' }: ProductFormModalProps) {
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(13);
  const [taxCode, setTaxCode] = useState<string>('');
  const [purchasePriceExclTax, setPurchasePriceExclTax] = useState<string>('');
  const [purchasePriceInclTax, setPurchasePriceInclTax] = useState<string>('');
  
  // Dynamic Attributes
  const [dynamicAttrs, setDynamicAttrs] = useState<{name: string, value: string}[]>([
    { name: '颜色', value: '' },
    { name: 'CPU', value: '' }
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  
  const [scenes, setScenes] = useState<string[]>([]);
  const [mainCategory, setMainCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [enjoyedAreas, setEnjoyedAreas] = useState<string[]>([]);
  const [salesAreas, setSalesAreas] = useState<string[]>([]);

  // Supply info
  const [leadTime, setLeadTime] = useState(3);
  const [minOrderQty, setMinOrderQty] = useState(1);
  const [incQty, setIncQty] = useState(1);
  const [maxOrderQty, setMaxOrderQty] = useState(9999);

  const title = mode === 'copy' ? '复制商品' : mode === 'edit' ? '编辑商品' : '新增商品';

  useEffect(() => {
    if (product && isOpen) {
      setTaxRate(Number(product.taxRate) || 13);
      setTaxCode(product.taxCode || '');
      setPurchasePriceExclTax(product.purchasePriceExclTax?.toString() || '');
      setPurchasePriceInclTax(product.purchasePriceInclTax?.toString() || '');
      // Copy defaults
      setLeadTime(product.leadTimeDays || 3);
      if (product.image) setImages([product.image]);
      if (product.enjoyedAreas) setEnjoyedAreas(product.enjoyedAreas);
      if (product.salesAreas) setSalesAreas(product.salesAreas);
    }
  }, [product, isOpen]);

  // Auto calc tax inclusion
  useEffect(() => {
    if (purchasePriceExclTax) {
      const excl = parseFloat(purchasePriceExclTax);
      if (!isNaN(excl)) {
        const incl = excl * (1 + taxRate / 100);
        setPurchasePriceInclTax(incl.toFixed(2));
      } else {
        setPurchasePriceInclTax('');
      }
    } else {
      setPurchasePriceInclTax('');
    }
  }, [purchasePriceExclTax, taxRate]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white z-10">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
            
            {/* 驳回原因提示 */}
            {mode === 'edit' && product && (product.auditStatus === 'AUDIT_REJECTED' || product.auditStatus === 'APPROVAL_REJECTED') && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                <div className="text-red-500 mt-0.5">
                  <X size={18} className="bg-red-100 rounded-full p-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900 mb-1">
                    {product.auditStatus === 'AUDIT_REJECTED' ? '审核被驳回' : '审批被驳回'}
                  </h4>
                  <p className="text-sm text-red-700">
                    驳回原因：{product.rejectReason || '信息有误，请修改后重新提交。'}
                  </p>
                </div>
              </div>
            )}

            {/* 基础信息 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-5 leading-none">基础信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div>
                  <RequiredLabel>供应商SKU</RequiredLabel>
                  <input type="text" defaultValue={product?.supplierSku} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <RequiredLabel>商品名称</RequiredLabel>
                  <input type="text" defaultValue={product?.name} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500" />
                </div>
                <div>
                  <RequiredLabel>税收分类编码</RequiredLabel>
                  <input 
                    type="text" 
                    value={taxCode}
                    onChange={e => setTaxCode(e.target.value)}
                    placeholder="请输入税收分类编码"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <OptionalLabel>商品合同名称</OptionalLabel>
                  <input type="text" defaultValue={product?.contractName} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <RequiredLabel>商品品牌</RequiredLabel>
                    <button onClick={() => setShowBrandModal(true)} className="text-xs text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 px-1.5 py-0.5 rounded">没找到品牌？</button>
                  </div>
                  <select defaultValue={product?.brand} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500">
                    <option value="">请选择品牌</option>
                    <option value="Huawei">华为 (Huawei)</option>
                    <option value="Xiaomi">小米 (Xiaomi)</option>
                    <option value="Apple">苹果 (Apple)</option>
                  </select>
                </div>
                <div>
                  <RequiredLabel>规格</RequiredLabel>
                  <input type="text" defaultValue={product?.specification} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500" />
                </div>
                <div>
                  <RequiredLabel>型号</RequiredLabel>
                  <input type="text" defaultValue={product?.model} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500" />
                </div>
                <div>
                  <RequiredLabel>单位</RequiredLabel>
                  <input type="text" defaultValue="件" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500" />
                </div>
                <div className="col-span-full">
                  <OptionalLabel>应用场景</OptionalLabel>
                  <MultiSelect options={sceneOptions} value={scenes} onChange={setScenes} placeholder="请选择场景" />
                </div>
                <div className="col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
                  <RequiredLabel>主品类</RequiredLabel>
                  <CategorySelect value={mainCategory} onChange={setMainCategory} placeholder="请选择主品类" />
                </div>
                <div className="col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
                  <OptionalLabel>副品类</OptionalLabel>
                  <CategorySelect value={subCategory} onChange={setSubCategory} placeholder="请选择副品类" />
                </div>
              </div>
            </div>

            {/* 供货信息 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-5 leading-none">供货信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <RequiredLabel>货期 (天)</RequiredLabel>
                  <NumberInput value={leadTime} onChange={setLeadTime} min={0} max={365} />
                </div>
                <div>
                  <OptionalLabel>最小起售量</OptionalLabel>
                  <NumberInput value={minOrderQty} onChange={setMinOrderQty} min={1} max={99999} />
                </div>
                <div>
                  <OptionalLabel>递增量</OptionalLabel>
                  <NumberInput value={incQty} onChange={setIncQty} min={1} max={99999} />
                </div>
                <div>
                  <OptionalLabel>限购数量</OptionalLabel>
                  <NumberInput value={maxOrderQty} onChange={setMaxOrderQty} min={1} max={99999} />
                </div>
              </div>
            </div>

            {/* 价格信息 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-5 leading-none">价格信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <RequiredLabel>税点</RequiredLabel>
                  <select 
                    value={taxRate} 
                    onChange={e => setTaxRate(Number(e.target.value))} 
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500"
                  >
                    <option value="1">1%</option>
                    <option value="9">9%</option>
                    <option value="13">13%</option>
                  </select>
                </div>
                <div>
                  <RequiredLabel>未税含运采购价</RequiredLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 text-sm">¥</span>
                    <input 
                      type="number" 
                      value={purchasePriceExclTax}
                      onChange={e => setPurchasePriceExclTax(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 ring-blue-500" 
                    />
                  </div>
                </div>
                <div>
                  <OptionalLabel>含税含运采购价</OptionalLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 text-sm">¥</span>
                    <input 
                      type="number" 
                      value={purchasePriceInclTax}
                      disabled
                      className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 text-slate-500 border border-slate-200 rounded-lg outline-none" 
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1.5">* 含税价 = 未税价 × (1+税点%)，自动联动计算</div>
                </div>
              </div>
            </div>

            {/* 销售区域规则 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-5 leading-none">销售区域规则</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <OptionalLabel>销售地区</OptionalLabel>
                  <MultiSelect 
                    options={provinceOptions} 
                    value={enjoyedAreas} 
                    onChange={setEnjoyedAreas} 
                    placeholder="请选择销售地区" 
                  />
                </div>
                <div>
                  <OptionalLabel>限售地区</OptionalLabel>
                  <MultiSelect 
                    options={provinceOptions} 
                    value={salesAreas} 
                    onChange={setSalesAreas} 
                    placeholder="请选择限售地区" 
                  />
                </div>
              </div>
            </div>

            {/* 品类动态属性 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 leading-none">品类动态属性</h3>
              </div>
              
              <div className="space-y-3">
                {dynamicAttrs.map((attr, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input 
                      type="text" 
                      placeholder="属性名称，如颜色"
                      value={attr.name}
                      onChange={(e) => {
                        const newAttrs = [...dynamicAttrs];
                        newAttrs[index].name = e.target.value;
                        setDynamicAttrs(newAttrs);
                      }}
                      className="w-1/3 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                    <input 
                      type="text" 
                      placeholder="属性值，如红色"
                      value={attr.value}
                      onChange={(e) => {
                        const newAttrs = [...dynamicAttrs];
                        newAttrs[index].value = e.target.value;
                        setDynamicAttrs(newAttrs);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
                {dynamicAttrs.length === 0 && (
                  <div className="text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                    暂无动态属性
                  </div>
                )}
              </div>
            </div>

            {/* 商品标签 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-5 leading-none">商品标签</h3>
              <TagsInput tags={tags} onChange={setTags} placeholder="输入标签内容后回车添加" />
            </div>

            {/* 商品图片 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-5 leading-none">商品图片</h3>
              <ImageUploader images={images} onChange={setImages} max={5} />
            </div>

            {/* 商品详情 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-5 leading-none">商品详情</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col h-64">
                <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-2 text-slate-400">
                  {/* Fake toolbar */}
                  <div className="w-4 h-4 bg-slate-200 rounded-sm"></div>
                  <div className="w-4 h-4 bg-slate-200 rounded-sm"></div>
                  <div className="w-4 h-4 bg-slate-200 rounded-sm"></div>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                  <div className="w-4 h-4 bg-slate-200 rounded-sm"></div>
                </div>
                <textarea 
                  className="flex-1 w-full p-4 text-sm outline-none resize-none"
                  placeholder="在此输入商品详情信息..."
                ></textarea>
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              取消
            </button>
            <button 
              onClick={() => {
                // save draft logi
                onClose();
              }}
              className="px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all shadow-sm"
            >
              保存草稿
            </button>
            <button 
              onClick={() => {
                if (!taxCode.trim()) {
                  alert('请输入税收分类编码');
                  return;
                }
                // submit logic
                onClose();
              }}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-xl hover:bg-blue-600 transition-all shadow-sm shadow-blue-200"
            >
              提交审批
            </button>
          </div>
        </div>
      </div>

      <BrandApplicationModal 
        isOpen={showBrandModal} 
        onClose={() => setShowBrandModal(false)}
        onSave={(name) => {
          console.log('Saved brand:', name);
          setShowBrandModal(false);
          // Auto select the new brand in a real implementation
        }}
      />
    </>
  );
}
