import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  User, 
  Phone, 
  Plus, 
  Trash2, 
  Pencil, 
  Check, 
  Home, 
  Building,
  AlertCircle,
  X
} from 'lucide-react';
import { AfterSalesAddress } from '../models/afterSales';
import { 
  getAfterSalesAddresses, 
  createAfterSalesAddress, 
  updateAfterSalesAddress, 
  deleteAfterSalesAddress, 
  setDefaultAfterSalesAddress 
} from '../services/afterSalesService';

export default function AfterSalesAddressPage() {
  const [addresses, setAddresses] = useState<AfterSalesAddress[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AfterSalesAddress | null>(null);
  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    warehouseName: '',
    isDefault: false
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const list = await getAfterSalesAddresses();
      setAddresses(list);
    } catch {
      triggerToast('加载地址失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormData({
      contactName: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detailAddress: '',
      warehouseName: '',
      isDefault: false
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEditModal = (address: AfterSalesAddress) => {
    setEditingAddress(address);
    setFormData({
      contactName: address.contactName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detailAddress: address.detailAddress,
      warehouseName: address.warehouseName,
      isDefault: address.isDefault
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.contactName.trim()) errors.contactName = '收件人姓名不能为空';
    
    // Check telephone or mobile phone length
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      errors.phone = '联系电话不能为空';
    } else if (!/^\d[-_ #\d]{4,15}$/.test(phoneTrimmed)) {
      errors.phone = '请输入有效的联系电话（可包含数字与区号分界符）';
    }
    
    if (!formData.province.trim()) errors.province = '省份不能为空';
    if (!formData.city.trim()) errors.city = '城市不能为空';
    if (!formData.district.trim()) errors.district = '区县不能为空';
    if (!formData.detailAddress.trim()) errors.detailAddress = '详细地址不能为空';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const derivedWarehouseName = `${formData.province}${formData.city}${formData.district}售后点`;
      const finalFormData = {
        ...formData,
        warehouseName: derivedWarehouseName
      };

      if (editingAddress) {
        const payload: AfterSalesAddress = {
          ...editingAddress,
          ...finalFormData
        };
        await updateAfterSalesAddress(payload);
        triggerToast('地址修改成功');
      } else {
        await createAfterSalesAddress(finalFormData);
        triggerToast('新建售后地址成功');
      }
      setModalOpen(false);
      loadAddresses();
    } catch {
      triggerToast('保存地址失败');
    }
  };

  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确认删除该售后退货地址吗？')) {
      try {
        await deleteAfterSalesAddress(id);
        triggerToast('删除地址成功');
        loadAddresses();
      } catch {
        triggerToast('删除地址失败');
      }
    }
  };

  const handleSetDefault = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await setDefaultAfterSalesAddress(id);
      triggerToast('已成功设为默认售后地址');
      loadAddresses();
    } catch {
      triggerToast('设置默认地址失败');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Page Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building size={24} className="text-slate-500" />
            售后地址管理
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            配置与维护商品的售后退货、返厂检修接收仓库地址。在此处更新的地址将同步在“售后处理”确认时供选择。
          </p>
        </div>
        <div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
            id="btn-add-address"
          >
            <Plus size={16} />
            新增寄回地址
          </button>
        </div>
      </div>

      {loading && addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500" />
          <span className="text-sm">加载地址中...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <MapPin size={48} className="text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">暂无售后地址</h3>
          <p className="text-sm text-slate-400 mt-1.5 max-w-md text-center">
            您还没有配置过任何商家售后地址。请点击右上角“新增寄回地址”配置首个仓储点。
          </p>
        </div>
      ) : (
        /* Address Cards grid flow */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="addresses-grid">
          {addresses.map((addr) => (
            <div 
              key={addr.id}
              className={`bg-white rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between ${
                addr.isDefault 
                  ? 'border-blue-500 shadow-sm shadow-blue-50/50 hover:shadow' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Recipient name and Default Status badge */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-base leading-snug flex items-center gap-1.5">
                    <User size={16} className="text-slate-400 shrink-0" />
                    {addr.contactName}
                  </h3>
                  {addr.isDefault && (
                    <span className="shrink-0 bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold select-none border border-blue-100 flex items-center gap-1">
                      <Check size={12} strokeWidth={3} />
                      默认
                    </span>
                  )}
                </div>

                {/* Contact and address details */}
                <div className="space-y-2 text-slate-600 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{addr.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-normal">
                      <span className="text-slate-400 mr-1 font-medium">
                        {addr.province} {addr.city} {addr.district}
                      </span>
                      {addr.detailAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address actions bar */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                <div>
                  {!addr.isDefault ? (
                    <button
                      onClick={(e) => handleSetDefault(addr.id, e)}
                      className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      设为默认
                    </button>
                  ) : (
                    <span className="text-xs text-blue-600 font-bold select-none">已设为默认</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditModal(addr)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-slate-50"
                    title="编辑地址"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteAddress(addr.id, e)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                    title="删除地址"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Address Form Drawer/Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingAddress ? '编辑售后地址' : '新增售后地址'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4 font-sans">
              
              {/* Two Column Layout: Contact Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">
                    <span className="text-red-500 mr-1">*</span>收件人
                  </label>
                  <input
                    type="text"
                    placeholder="售后退货接收人"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors outline-none focus:ring-1 ${
                      formErrors.contactName 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                  {formErrors.contactName && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.contactName}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">
                    <span className="text-red-500 mr-1">*</span>联系电话
                  </label>
                  <input
                    type="text"
                    placeholder="手机号码或座机"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors outline-none focus:ring-1 ${
                      formErrors.phone 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Three Column Layout: Province, City, District */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">
                    <span className="text-red-500 mr-1">*</span>省份
                  </label>
                  <input
                    type="text"
                    placeholder="省"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className={`w-full px-2.5 py-2 border rounded-lg text-sm transition-colors outline-none focus:ring-1 ${
                      formErrors.province 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                </div>
                <div className="space-y-1 bg-white">
                  <label className="block text-sm font-bold text-slate-700">
                    <span className="text-red-500 mr-1">*</span>城市
                  </label>
                  <input
                    type="text"
                    placeholder="市"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-2.5 py-2 border rounded-lg text-sm transition-colors outline-none focus:ring-1 ${
                      formErrors.city 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">
                    <span className="text-red-500 mr-1">*</span>区县
                  </label>
                  <input
                    type="text"
                    placeholder="区/县"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className={`w-full px-2.5 py-2 border rounded-lg text-sm transition-colors outline-none focus:ring-1 ${
                      formErrors.district 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                </div>
              </div>
              
              {/* Province, city, district error check */}
              {(formErrors.province || formErrors.city || formErrors.district) && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> 
                  请完整输入省、市、区地域信息
                </p>
              )}

              {/* Detailed address text area */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700">
                  <span className="text-red-500 mr-1">*</span>详细地址
                </label>
                <textarea
                  rows={3}
                  placeholder="街道名称、楼宇、门牌号等"
                  value={formData.detailAddress}
                  onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm resize-none transition-colors outline-none focus:ring-1 ${
                    formErrors.detailAddress 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {formErrors.detailAddress && (
                  <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.detailAddress}</p>
                )}
              </div>

              {/* Set Default Address Switch */}
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-700">设为默认售后寄回地址</div>
                  <div className="text-xs text-slate-400">处理售后退换货同意时，会默认选中此地址</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:shadow transition-all"
                >
                  保存并应用
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
