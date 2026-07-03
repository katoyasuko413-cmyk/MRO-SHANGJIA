import React, { useState, useEffect } from 'react';
import { Upload, X, Store, Phone, MapPin, Clock, FileText } from 'lucide-react';

interface StoreData {
  name: string;
  logo: string;
  phone: string;
  address: string;
  hours: string;
  description: string;
}

const INITIAL_DATA: StoreData = {
  name: '优品商城旗舰店',
  logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
  phone: '400-888-8888',
  address: '北京市朝阳区建国路88号SOHO现代城B座',
  hours: '周一至周日 09:00-19:00',
  description: '优品商城旗舰店，主营电子产品、服装鞋帽、家居用品等。我们承诺正品保障，七天无理由退换货。'
};

export default function StoreMgmt() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StoreData>(INITIAL_DATA);
  const [tempData, setTempData] = useState<StoreData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof StoreData, string>>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditing]);

  const validate = () => {
    const newErrors: Partial<Record<keyof StoreData, string>> = {};
    if (!tempData.name.trim()) newErrors.name = '请输入店铺名称';
    if (!tempData.logo) newErrors.logo = '请上传店铺Logo';
    if (!tempData.phone.trim()) newErrors.phone = '请输入联系电话';
    if (!tempData.address.trim()) newErrors.address = '请输入店铺地址';
    if (!tempData.hours.trim()) newErrors.hours = '请输入营业时间';
    if (!tempData.description.trim()) newErrors.description = '请输入店铺简介';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = () => {
    setTempData(formData);
    setErrors({});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (validate()) {
      setFormData(tempData);
      setIsEditing(false);
      displayToast('保存成功');
    } else {
      displayToast('请填写完整的必填信息');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempData({ ...tempData, logo: url });
      if (errors.logo) {
        setErrors((prev) => ({ ...prev, logo: undefined }));
      }
    }
  };

  const InputFieldWrapper = ({ label, field, children, required = true }: { label: string, field: keyof StoreData, children: React.ReactNode, required?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-start py-3">
      <div className="sm:w-28 py-2 text-slate-600 font-medium flex items-center">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </div>
      <div className="flex-1 flex flex-col">
        {children}
        {errors[field] && (
          <span className="text-red-500 text-sm mt-1">{errors[field]}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">店铺信息</h1>
          <p className="text-sm text-slate-500 mt-1">管理店铺基本信息、联系方式与营业状态</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleEditClick}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-200"
          >
            编辑店铺信息
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
        <div className="p-6 md:p-10 flex-1 flex flex-col lg:flex-row justify-between gap-12">
          {/* Left Side: Information */}
          <div className="flex-1 space-y-8 max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{formData.name}</h2>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                营业中
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500 shrink-0">
                  <Store size={20} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">店铺名称</div>
                  <div className="text-slate-900 font-medium">{formData.name}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">联系电话</div>
                  <div className="text-slate-900 font-medium">{formData.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">店铺地址</div>
                  <div className="text-slate-900 font-medium">{formData.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">营业时间</div>
                  <div className="text-slate-900 font-medium">{formData.hours}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-400 mb-1">店铺简介</div>
                  <div className="text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {formData.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Logo & Actions */}
          <div className="w-full lg:w-64 flex flex-col items-center lg:items-end shrink-0 gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="text-sm font-medium text-slate-400 self-center lg:self-end">店铺 Logo</div>
              {formData.logo ? (
                <div className="w-40 h-40 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                  <img src={formData.logo} alt="Store Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm">
                  暂无图片
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-slate-800">编辑店铺信息</h3>
              <button 
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-1">
                <InputFieldWrapper label="店铺名称" field="name">
                  <input
                    type="text"
                    value={tempData.name}
                    onChange={(e) => {
                      setTempData({ ...tempData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
                      errors.name ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="请输入店铺名称"
                  />
                </InputFieldWrapper>

                <InputFieldWrapper label="店铺Logo" field="logo">
                  <div className="flex items-start gap-4">
                    {tempData.logo ? (
                      <div className="relative w-32 h-32 rounded-lg border border-slate-200 group overflow-hidden bg-slate-50">
                        <img src={tempData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setTempData({ ...tempData, logo: '' })}
                            className="text-white hover:text-red-400 p-2 bg-black/20 rounded-full"
                            title="删除图片"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className={`w-32 h-32 rounded-lg flex flex-col items-center justify-center border border-dashed transition-colors cursor-pointer bg-slate-50 ${
                        errors.logo ? 'border-red-400 text-red-500 hover:bg-red-50' : 'border-slate-300 text-slate-400 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500'
                      }`}>
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm">上传图片</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </InputFieldWrapper>

                <InputFieldWrapper label="联系电话" field="phone">
                  <input
                    type="text"
                    value={tempData.phone}
                    onChange={(e) => {
                      setTempData({ ...tempData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
                      errors.phone ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="请输入联系电话"
                  />
                </InputFieldWrapper>

                <InputFieldWrapper label="店铺地址" field="address">
                  <input
                    type="text"
                    value={tempData.address}
                    onChange={(e) => {
                      setTempData({ ...tempData, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: undefined });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
                      errors.address ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="请输入店铺地址"
                  />
                </InputFieldWrapper>

                <InputFieldWrapper label="营业时间" field="hours">
                  <input
                    type="text"
                    value={tempData.hours}
                    onChange={(e) => {
                      setTempData({ ...tempData, hours: e.target.value });
                      if (errors.hours) setErrors({ ...errors, hours: undefined });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
                      errors.hours ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="例：周一至周日 09:00-19:00"
                  />
                </InputFieldWrapper>

                <InputFieldWrapper label="店铺简介" field="description">
                  <textarea
                    value={tempData.description}
                    onChange={(e) => {
                      setTempData({ ...tempData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: undefined });
                    }}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors resize-none ${
                      errors.description ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="请输入店铺简介"
                  />
                </InputFieldWrapper>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/50 rounded-b-2xl">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

