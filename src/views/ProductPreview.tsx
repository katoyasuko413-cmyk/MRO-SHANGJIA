import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Heart, Copy, MapPin, Minus, Plus, ShoppingCart, ArrowLeft, 
  Check, Share2, Star, ShieldCheck, ChevronRight, Coins, CreditCard, Building
} from 'lucide-react';
import { useProductPreviewViewModel } from '../hooks/useProductPreviewViewModel';

// Dynamic high-fidelity SVG illustration renderer for MRO products
function ProductIllustration({ brand, model, name, className = "w-full h-full" }: { brand: string, model: string, name: string, className?: string }) {
  const lowercaseName = name.toLowerCase() + " " + model.toLowerCase();
  
  if (lowercaseName.includes('眼镜') || lowercaseName.includes('goggle') || lowercaseName.includes('glass')) {
    return (
      <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background grid */}
        <rect width="400" height="300" rx="12" fill="#F8FAFC"/>
        <path d="M0 50H400M0 100H400M0 150H400M0 200H400M0 250H400" stroke="#F1F5F9" strokeWidth="1"/>
        <path d="M50 0V300M100 0V300M150 0V300M200 0V300M250 0V300M300 0V300M350 0V300" stroke="#F1F5F9" strokeWidth="1"/>
        
        {/* Frame / Temples (Left and Right Arms) */}
        <path d="M70 120 C50 125, 45 150, 40 180" stroke="#334155" strokeWidth="6" strokeLinecap="round" opacity="0.3"/>
        <path d="M330 120 C350 125, 355 150, 360 180" stroke="#334155" strokeWidth="6" strokeLinecap="round" opacity="0.3"/>
        
        {/* Main Goggle Strap/Band background */}
        <path d="M50 140 C100 135, 300 135, 350 140" stroke="#475569" strokeWidth="12" strokeLinecap="round" opacity="0.4"/>
        
        {/* Outer Frame (Rugged protective black rubber) */}
        <path d="M100 120 C120 110, 280 110, 300 120 C320 130, 325 180, 290 195 C260 210, 220 200, 200 200 C180 200, 140 210, 110 195 C75 180, 80 130, 100 120 Z" fill="#1E293B" stroke="#334155" strokeWidth="4"/>
        
        {/* Soft Silicon Gasket Face Seal (translucent green/teal) */}
        <path d="M108 126 C124 118, 276 118, 292 126 C308 134, 312 172, 284 186 C258 198, 218 190, 200 190 C182 190, 142 198, 116 186 C88 172, 92 134, 108 126 Z" fill="#0EA5E9" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.5"/>
        
        {/* Panoramic Lenses (Polycarbonate blue transparent) */}
        <path d="M115 132 C128 125, 272 125, 285 132 C298 138, 302 168, 278 178 C254 188, 216 182, 200 182 C184 182, 146 188, 122 178 C98 168, 102 138, 115 132 Z" fill="url(#lensGrad)" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round"/>
        
        {/* Highlights / Reflections on Lens */}
        <path d="M125 140 Q150 135, 180 142" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
        <path d="M130 148 Q145 145, 160 149" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <path d="M255 140 Q270 145, 285 141" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        
        {/* Nose bridge ventilation detail */}
        <path d="M190 188 L194 182 H206 L210 188" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Brand Text on Frame */}
        <text x="200" y="118" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">{brand}</text>
        <text x="200" y="235" fill="#64748B" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">MRO PROFESSIONAL SAFETY</text>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="lensGrad" x1="200" y1="120" x2="200" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.5"/>
          </linearGradient>
        </defs>
      </svg>
    );
  } else if (lowercaseName.includes('口罩') || lowercaseName.includes('mask')) {
    return (
      <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" rx="12" fill="#F8FAFC"/>
        <path d="M0 50H400M0 100H400M0 150H400M0 200H400M0 250H400" stroke="#F1F5F9" strokeWidth="1"/>
        <path d="M50 0V300M100 0V300M150 0V300M200 0V300M250 0V300M300 0V300M350 0V300" stroke="#F1F5F9" strokeWidth="1"/>
        
        {/* Straps */}
        <path d="M110 140 Q80 100, 150 70" stroke="#CBD5E1" strokeWidth="3" fill="none"/>
        <path d="M110 180 Q80 220, 150 240" stroke="#CBD5E1" strokeWidth="3" fill="none"/>
        <path d="M290 140 Q320 100, 250 70" stroke="#CBD5E1" strokeWidth="3" fill="none"/>
        <path d="M290 180 Q320 220, 250 240" stroke="#CBD5E1" strokeWidth="3" fill="none"/>

        {/* Mask Body */}
        <path d="M200 70 C240 70, 300 120, 290 170 C280 210, 220 230, 200 235 C180 230, 120 210, 110 170 C100 120, 160 70, 200 70 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3"/>
        {/* Center Stitch Fold */}
        <path d="M200 70 V235" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3"/>
        
        {/* Metal Nose Clip */}
        <path d="M175 85 Q200 80, 225 85" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round"/>
        
        {/* CoolFlow Valve */}
        <rect x="160" y="130" width="36" height="42" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2"/>
        <rect x="165" y="135" width="26" height="15" rx="2" fill="#E2E8F0"/>
        <path d="M168 158 H188M168 164 H188" stroke="#64748B" strokeWidth="2"/>
        {/* Valve Accent Color (often red or blue or gray) */}
        <circle cx="178" cy="142" r="3" fill="#FF5252"/>

        <text x="200" y="260" fill="#64748B" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">KN95 COLLAPSIBLE RESPIRATOR</text>
        <text x="200" y="105" fill="#94A3B8" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">{brand}</text>
      </svg>
    );
  } else if (lowercaseName.includes('工具') || lowercaseName.includes('扳手') || lowercaseName.includes('wrench')) {
    return (
      <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" rx="12" fill="#F8FAFC"/>
        <path d="M0 50H400M0 100H400M0 150H400M0 200H400M0 250H400" stroke="#F1F5F9" strokeWidth="1"/>
        <path d="M50 0V300M100 0V300M150 0V300M200 0V300M250 0V300M300 0V300M350 0V300" stroke="#F1F5F9" strokeWidth="1"/>

        {/* Wrench Handle */}
        <rect x="100" y="135" width="200" height="30" rx="6" fill="url(#metalGrad)" stroke="#64748B" strokeWidth="2" transform="rotate(-15 200 150)"/>
        {/* Open End Left */}
        <circle cx="95" cy="177" r="28" fill="url(#metalGrad)" stroke="#64748B" strokeWidth="2"/>
        <path d="M65 177 L95 160 L105 177 L95 194 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2"/>
        {/* Ring End Right */}
        <circle cx="305" cy="122" r="26" fill="url(#metalGrad)" stroke="#64748B" strokeWidth="2"/>
        <circle cx="305" cy="122" r="15" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" strokeDasharray="4 2"/>

        {/* Brand engraving */}
        <text x="200" y="152" fill="#334155" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" transform="rotate(-15 200 150)">{brand} CHROME VANADIUM</text>
        <text x="200" y="245" fill="#64748B" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">PROFESSIONAL GRADE HAND TOOLS</text>

        <defs>
          <linearGradient id="metalGrad" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E2E8F0"/>
            <stop offset="50%" stopColor="#94A3B8"/>
            <stop offset="100%" stopColor="#475569"/>
          </linearGradient>
        </defs>
      </svg>
    );
  } else if (lowercaseName.includes('扫描') || lowercaseName.includes('scan') || lowercaseName.includes('scanner')) {
    return (
      <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" rx="12" fill="#F8FAFC"/>
        <path d="M0 50H400M0 100H400M0 150H400M0 200H400M0 250H400" stroke="#F1F5F9" strokeWidth="1"/>
        <path d="M50 0V300M100 0V300M150 0V300M200 0V300M250 0V300M300 0V300M350 0V300" stroke="#F1F5F9" strokeWidth="1"/>

        {/* Scanner Body */}
        {/* Handle */}
        <rect x="180" y="140" width="40" height="100" rx="10" fill="#334155" stroke="#1E293B" strokeWidth="2" transform="rotate(15 200 190)"/>
        <rect x="183" y="160" width="10" height="50" rx="2" fill="#E2E8F0" opacity="0.3" transform="rotate(15 200 190)"/>
        {/* Trigger */}
        <path d="M170 160 C160 165, 160 180, 172 185" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" fill="none"/>
        
        {/* Head */}
        <path d="M140 100 H230 L250 140 H160 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2"/>
        {/* Protective Rubber cap */}
        <rect x="130" y="95" width="20" height="50" rx="4" fill="#EF4444" transform="rotate(10 140 120)"/>
        {/* Laser Window */}
        <path d="M135 100 L140 140" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round"/>

        {/* Wireless base or details */}
        <circle cx="210" cy="80" r="4" fill="#10B981"/>

        {/* Laser Line Effect */}
        <path d="M50 115 L120 118" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3"/>
        <path d="M50 115 L120 118" stroke="#EF4444" strokeWidth="4" opacity="0.4"/>

        <text x="200" y="270" fill="#64748B" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">INDUSTRIAL WIRELESS SCANNER</text>
        <text x="205" y="120" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{brand}</text>
      </svg>
    );
  } else {
    // Default Multimeter / High precision instrument
    return (
      <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" rx="12" fill="#F8FAFC"/>
        <path d="M0 50H400M0 100H400M0 150H400M0 200H400M0 250H400" stroke="#F1F5F9" strokeWidth="1"/>
        <path d="M50 0V300M100 0V300M150 0V300M200 0V300M250 0V300M300 0V300M350 0V300" stroke="#F1F5F9" strokeWidth="1"/>

        {/* Instrument Outer Case */}
        <rect x="140" y="60" width="120" height="180" rx="12" fill="#EF4444" stroke="#B91C1C" strokeWidth="4"/>
        <rect x="146" y="66" width="108" height="168" rx="8" fill="#334155"/>

        {/* Screen */}
        <rect x="156" y="78" width="88" height="42" rx="4" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
        <text x="200" y="108" fill="#065F46" fontSize="24" fontWeight="bold" fontFamily="monospace" textAnchor="middle">198.0</text>
        <text x="232" y="92" fill="#065F46" fontSize="8" fontFamily="monospace">VAC</text>

        {/* Rotary Dial */}
        <circle cx="200" cy="165" r="24" fill="#1E293B" stroke="#64748B" strokeWidth="2"/>
        <line x1="200" y1="165" x2="200" y2="145" stroke="#EF4444" strokeWidth="4" strokeLinecap="round"/>

        {/* Test Leads sockets */}
        <circle cx="175" cy="215" r="8" fill="#111827"/>
        <circle cx="175" cy="215" r="4" fill="#EF4444"/>
        <circle cx="200" cy="215" r="8" fill="#111827"/>
        <circle cx="200" cy="215" r="4" fill="#9CA3AF"/>
        <circle cx="225" cy="215" r="8" fill="#111827"/>
        <circle cx="225" cy="215" r="4" fill="#111827"/>

        <text x="200" y="270" fill="#64748B" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">DIGITAL MULTIMETER</text>
        <text x="200" y="132" fill="#94A3B8" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">{brand}</text>
      </svg>
    );
  }
}

export default function ProductPreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('id');

  const { state, actions } = useProductPreviewViewModel();
  const [isFavorite, setIsFavorite] = useState(false);
  const [deliveryProvince, setDeliveryProvince] = useState('北京市');
  const [deliveryDistrict, setDeliveryDistrict] = useState('东城区');
  const [showLocationSelect, setShowLocationSelect] = useState(false);

  useEffect(() => {
    actions.loadProduct(productId);
  }, [productId, actions.loadProduct]);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin mb-4" />
        <span className="text-slate-600 font-bold text-lg">正在加载商品预览...</span>
      </div>
    );
  }

  if (!state.product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2 font-sans">商品不存在</h2>
          <p className="text-slate-500 mb-6 text-sm">未能找到对应的商品记录，它可能已被删除或ID不正确。</p>
          <button 
            onClick={() => navigate('/product')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            返回商品管理
          </button>
        </div>
      </div>
    );
  }

  const p = state.product;

  // Custom Full Product name format shown in design header
  const fullName = p.brand + p.model + p.name;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Dynamic Global Toast */}
      {state.toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-xl shadow-xl border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-2">
          <Check size={16} className="text-green-400" />
          <span>{state.toastMessage}</span>
        </div>
      )}

      {/* Top Header / MRO Marketplace Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.close()} 
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <ArrowLeft size={14} />
              关闭预览
            </button>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-sm font-bold text-blue-600 font-mono tracking-wider">天创 MRO 商城 · 消费者视图预览</span>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-blue-500" /> 100% 正品保障</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-blue-500" /> 专业售后支持</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-blue-500" /> 支持账期支付</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* SPU Spec Detail Section - Card wrapper */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Product Gallery / Images */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative border border-slate-200/80 rounded-xl overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-4 aspect-square">
              {/* Product Gallery Header Title like in screenshot */}
              <div className="absolute top-4 left-4 text-slate-900 font-bold text-sm tracking-tight bg-white/90 backdrop-blur px-3 py-1.5 rounded-md border border-slate-100 shadow-sm">
                {fullName}
              </div>
              <ProductIllustration brand={p.brand} model={p.model} name={p.name} className="w-full h-full max-h-[300px]" />
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => actions.setActiveThumbnailIndex(0)}
                className={`w-20 h-20 border-2 rounded-lg p-1 bg-white flex items-center justify-center transition-all ${state.activeThumbnailIndex === 0 ? 'border-blue-500 shadow-sm shadow-blue-100' : 'border-slate-200/80 hover:border-slate-300'}`}
              >
                <div className="w-full h-full opacity-90 hover:opacity-100">
                  <ProductIllustration brand={p.brand} model={p.model} name={p.name} className="w-full h-full" />
                </div>
              </button>
              <button 
                onClick={() => actions.setActiveThumbnailIndex(1)}
                className={`w-20 h-20 border-2 rounded-lg p-1 bg-white flex items-center justify-center transition-all ${state.activeThumbnailIndex === 1 ? 'border-blue-500 shadow-sm shadow-blue-100' : 'border-slate-200/80 hover:border-slate-300'}`}
              >
                <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded text-[10px] text-slate-400 font-mono text-center leading-tight">
                  <ProductIllustration brand={p.brand} model={p.model} name={p.name} className="w-full h-full opacity-40 scale-75" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Buying controls & specifications */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Title Block */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  {fullName}
                </h1>
                <button 
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    actions.setToastMessage(!isFavorite ? "已加入收藏夹" : "已取消收藏");
                  }}
                  className={`flex flex-col items-center gap-0.5 min-w-[40px] text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-slate-50`}
                >
                  <Heart size={20} fill={isFavorite ? "#EF4444" : "none"} className={isFavorite ? "text-red-500 animate-pulse" : ""} />
                  <span className="text-[10px] font-bold text-slate-500">收藏</span>
                </button>
              </div>

              {/* Price Area */}
              <div className="bg-[#FAF9F6]/80 border border-[#E9E4D9]/40 rounded-xl p-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-500 font-medium">官 网 价 ：</span>
                  <span className="text-2xl lg:text-3xl font-extrabold text-red-500">
                    ¥{p.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold font-mono">/ {p.moq > 1 ? '件' : '副'}</span>
                </div>
                <div className="mt-2 flex items-center gap-6 text-xs text-slate-500">
                  <span>未税价格 ：<span className="font-semibold text-slate-700">¥{(p.price / (1 + p.taxRate/100)).toFixed(2)}</span></span>
                  <span>(税率: {p.taxRate}%)</span>
                </div>
              </div>

              {/* Specifications grid (bordered list) */}
              <div className="border-t border-dashed border-slate-200 pt-4 space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-20 flex-shrink-0">品牌名称：</span>
                    <span className="font-semibold text-slate-900">{p.brand}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-20 flex-shrink-0">商品型号：</span>
                    <span className="font-semibold text-slate-900">{p.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-20 flex-shrink-0">订货编码：</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-900 font-semibold">
                      <span>{p.supplierSku}</span>
                      <button 
                        onClick={() => actions.copyToClipboard(p.supplierSku, '订货编码')}
                        className="text-slate-400 hover:text-blue-500 p-1 hover:bg-slate-100 rounded transition-colors"
                        title="复制编码"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-20 flex-shrink-0">起 订 量：</span>
                    <span className="font-semibold text-slate-900">{p.moq} {p.moq > 1 ? '件' : '副'}套</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="text-slate-400 w-20 flex-shrink-0">销售单位：</span>
                    <span className="font-semibold text-slate-900">{p.moq > 1 ? '件' : '副'}</span>
                  </div>
                </div>
              </div>

              {/* Delivery and Inventory Selection */}
              <div className="border-t border-dashed border-slate-200 pt-4 pb-4 space-y-3 mb-6 relative">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">配 送 至：</span>
                  <div className="relative">
                    <button 
                      onClick={() => setShowLocationSelect(!showLocationSelect)}
                      className="flex items-center gap-1 text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold transition-colors"
                    >
                      <MapPin size={14} className="text-red-500" />
                      <span>{deliveryProvince} {deliveryDistrict}</span>
                    </button>
                    
                    {showLocationSelect && (
                      <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95">
                        <div className="text-xs font-bold text-slate-500 mb-2">选择配送区域</div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <select 
                            value={deliveryProvince} 
                            onChange={(e) => {
                              setDeliveryProvince(e.target.value);
                              if (e.target.value === '上海市') setDeliveryDistrict('黄浦区');
                              else if (e.target.value === '江苏省') setDeliveryDistrict('南京市');
                              else if (e.target.value === '浙江省') setDeliveryDistrict('杭州市');
                              else setDeliveryDistrict('东城区');
                            }}
                            className="text-xs bg-slate-50 border border-slate-200 rounded p-1"
                          >
                            <option value="北京市">北京市</option>
                            <option value="上海市">上海市</option>
                            <option value="江苏省">江苏省</option>
                            <option value="浙江省">浙江省</option>
                          </select>
                          <select 
                            value={deliveryDistrict} 
                            onChange={(e) => {
                              setDeliveryDistrict(e.target.value);
                              setShowLocationSelect(false);
                            }}
                            className="text-xs bg-slate-50 border border-slate-200 rounded p-1"
                          >
                            {deliveryProvince === '北京市' && (
                              <>
                                <option value="东城区">东城区</option>
                                <option value="西城区">西城区</option>
                                <option value="朝阳区">朝阳区</option>
                              </>
                            )}
                            {deliveryProvince === '上海市' && (
                              <>
                                <option value="黄浦区">黄浦区</option>
                                <option value="徐汇区">徐汇区</option>
                                <option value="浦东新区">浦东新区</option>
                              </>
                            )}
                            {deliveryProvince === '江苏省' && (
                              <>
                                <option value="南京市">南京市</option>
                                <option value="苏州市">苏州市</option>
                              </>
                            )}
                            {deliveryProvince === '浙江省' && (
                              <>
                                <option value="杭州市">杭州市</option>
                                <option value="宁波市">宁波市</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">库　　存：</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-extrabold px-1.5 py-0.5">现货</span>
                    <span className="font-semibold text-slate-700">{p.stock} 件</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm border-t border-dashed border-slate-200/80 pt-4">
                  <span className="text-slate-400 w-20 flex-shrink-0">支付方式：</span>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1"><Coins size={14} className="text-amber-500" /> 线上支付</span>
                    <span className="flex items-center gap-1"><CreditCard size={14} className="text-red-500" /> 账期支付</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Buying Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 pt-6">
              {/* Quantity input counter */}
              <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden h-[42px] shrink-0">
                <button 
                  onClick={() => actions.setQuantity(state.quantity - 1)}
                  className="px-3 hover:bg-slate-200 h-full text-slate-500 transition-colors border-r border-slate-200"
                >
                  <Minus size={14} />
                </button>
                <input 
                  type="number" 
                  value={state.quantity}
                  onChange={(e) => actions.setQuantity(parseInt(e.target.value) || p.moq)}
                  className="w-16 text-center bg-white h-full outline-none font-bold text-sm focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  onClick={() => actions.setQuantity(state.quantity + 1)}
                  className="px-3 hover:bg-slate-200 h-full text-slate-500 transition-colors border-l border-slate-200"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add To Cart & Purchase buttons */}
              <button 
                onClick={() => actions.setToastMessage("成功加入购物车！")}
                className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 h-[42px] text-sm"
              >
                <ShoppingCart size={16} />
                加入购物车
              </button>
              
              <button 
                onClick={() => actions.setToastMessage("立即购买订单创建中...")}
                className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 bg-white border border-blue-500 hover:bg-blue-50 text-blue-600 font-extrabold px-6 py-2.5 rounded-xl transition-all h-[42px] text-sm"
              >
                <span className="inline-block border-[6px] border-transparent border-l-blue-600 ml-1.5" />
                立即购买
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Bottom Left: Similar items sidebar */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 space-y-4">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-200 pb-3 text-sm tracking-tight flex items-center justify-between">
              <span>相似商品</span>
              <ChevronRight size={16} className="text-slate-400" />
            </h3>
            <div className="space-y-4">
              {state.similarProducts.map((item) => {
                const simFullName = item.brand + item.model + item.name;
                return (
                  <div key={item.id} className="group border-b border-slate-100 last:border-b-0 pb-4 last:pb-0 flex gap-3 cursor-pointer" onClick={() => actions.loadProduct(item.id)}>
                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <ProductIllustration brand={item.brand} model={item.model} name={item.name} className="w-full h-full scale-90 group-hover:scale-100 transition-transform" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 hover:text-blue-600 transition-colors mb-1" title={simFullName}>
                        {simFullName}
                      </h4>
                      <div className="space-y-0.5 text-[10px] text-slate-500 font-medium">
                        <div>品牌：{item.brand}</div>
                        <div>型号：{item.model}</div>
                        <div className="flex items-center justify-between">
                          <span>订货号：{item.supplierSku}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              actions.copyToClipboard(item.supplierSku, '订货号');
                            }}
                            className="text-slate-400 hover:text-blue-500 p-0.5"
                          >
                            <Copy size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Right: Product Tabs & Tech Specifications */}
          <div className="lg:col-span-9 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-slate-200/80 bg-slate-50/50 flex text-sm">
              <button 
                onClick={() => actions.setActiveTab('intro')}
                className={`px-6 py-4 font-bold border-b-2 transition-all ${state.activeTab === 'intro' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                商品介绍
              </button>
              <button 
                onClick={() => actions.setActiveTab('parameters')}
                className={`px-6 py-4 font-bold border-b-2 transition-all ${state.activeTab === 'parameters' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                规格参数
              </button>
              <button 
                onClick={() => actions.setActiveTab('others')}
                className={`px-6 py-4 font-bold border-b-2 transition-all ${state.activeTab === 'others' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                保障及服务
              </button>
            </div>

            {/* Tab content */}
            <div className="p-6 lg:p-8 space-y-8">
              
              {state.activeTab === 'intro' && (
                <>
                  {/* Detailed Spec Grid Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left border-collapse">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">品　　牌：</span><span className="text-slate-800 font-bold">{p.brand}</span></td>
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">产品名称：</span><span className="text-slate-800 font-bold">{fullName}</span></td>
                        </tr>
                        <tr className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">销售单位：</span><span className="text-slate-800 font-bold">{p.moq > 1 ? '件' : '副'}</span></td>
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">制造商型号：</span><span className="text-slate-800 font-bold">{p.model}</span></td>
                        </tr>
                        <tr className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">材　　质：</span><span className="text-slate-800 font-bold">{p.name.includes('眼镜') ? '防护树脂' : p.name.includes('口罩') ? '高效静电滤棉' : '合金钢'}</span></td>
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">材料直径：</span><span className="text-slate-800 font-bold">-</span></td>
                        </tr>
                        <tr className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">抗拉强度：</span><span className="text-slate-800 font-bold">-</span></td>
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">重　　量：</span><span className="text-slate-800 font-bold">约 0.1kg</span></td>
                        </tr>
                        <tr className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">条 形 码：</span><span className="text-slate-800 font-bold">-</span></td>
                          <td className="p-3.5 flex"><span className="text-slate-400 w-24 shrink-0 font-medium">主 品 类：</span><span className="text-slate-800 font-bold">{p.mainCategory}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Product Key highlights */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-950 text-sm">产品特点：</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-blue-50/40 p-4 rounded-xl border border-blue-100/30">
                      采用优质防护材料与专业工程力学结构精心打磨，具备极其优异的防护、耐冲击和耐候性能。设计充分考虑人体工学，视野极佳、贴合紧密、佩戴极度舒适，广泛适用于各种喷漆、制造加工、实验室研究及多种现代工业作业环境。
                    </p>
                  </div>

                  {/* Technical Blueprints Placeholder illustrations */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="font-extrabold text-slate-950 text-sm mb-4">详情展示：</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center text-center space-y-2 group hover:border-blue-400 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-blue-100/60 flex items-center justify-center text-blue-600 mb-2 font-mono font-bold">1</div>
                        <span className="text-xs font-bold text-slate-800">1. 精密设计标准</span>
                        <p className="text-[10px] text-slate-500 leading-normal max-w-[200px]">严格通过天创专业MRO质量体系统一审验，确保在极限恶劣条件下的极致安全保障性能。</p>
                        <div className="text-[9px] font-mono text-slate-400 italic">@Product detail · Front View</div>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center text-center space-y-2 group hover:border-blue-400 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-blue-100/60 flex items-center justify-center text-blue-600 mb-2 font-mono font-bold">2</div>
                        <span className="text-xs font-bold text-slate-800">2. 人体工学科技</span>
                        <p className="text-[10px] text-slate-500 leading-normal max-w-[200px]">契合面部轮廓及动态运动模式设计，结合呼吸排气阀，长时间高效作业无憋闷及压迫感。</p>
                        <div className="text-[9px] font-mono text-slate-400 italic">@Product detail · Side Spec</div>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center text-center space-y-2 group hover:border-blue-400 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-blue-100/60 flex items-center justify-center text-blue-600 mb-2 font-mono font-bold">3</div>
                        <span className="text-xs font-bold text-slate-800">3. 环保耐久材质</span>
                        <p className="text-[10px] text-slate-500 leading-normal max-w-[200px]">全部采用无毒环保高级阻燃耐划聚碳酸酯或硅橡胶，防滑耐老化、更适于循环重复使用。</p>
                        <div className="text-[9px] font-mono text-slate-400 italic">@Product detail · Packing Layout</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {state.activeTab === 'parameters' && (
                <div className="space-y-6">
                  <h4 className="font-extrabold text-slate-900 text-sm">详细技术参数 (Specification Sheets)</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-slate-700">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-3 font-bold w-1/3">技术指标</th>
                          <th className="p-3 font-bold">测定数值 / 标准规范</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr><td className="p-3 font-medium bg-slate-50/40">执行标准</td><td className="p-3">GB 2626-2019 / ANSI Z87.1+</td></tr>
                        <tr><td className="p-3 font-medium bg-slate-50/40">透光率 / 过滤效率</td><td className="p-3">≥ 95.0% (防雾防划涂层)</td></tr>
                        <tr><td className="p-3 font-medium bg-slate-50/40">抗冲击防护等效</td><td className="p-3">符合 45m/s 高速微粒冲击承阻标准</td></tr>
                        <tr><td className="p-3 font-medium bg-slate-50/40">防雾等级</td><td className="p-3">N级(双侧防雾防冷凝)</td></tr>
                        <tr><td className="p-3 font-medium bg-slate-50/40">适用温度区间</td><td className="p-3">-15℃ 至 +65℃ 工况</td></tr>
                        <tr><td className="p-3 font-medium bg-slate-50/40">包装容量</td><td className="p-3">1个独立封装/盒</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {state.activeTab === 'others' && (
                <div className="space-y-6">
                  <h4 className="font-extrabold text-slate-900 text-sm">天创保障与尊享服务承诺</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5"><ShieldCheck size={14} className="text-blue-600" /> 正品防伪及质保体系</h5>
                      <p className="text-slate-500">商城所有商品均来自于品牌直采或授权经销商，100%原装正品。商品享受国家三包规定及品牌标准售后质保承诺。</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5"><ShieldCheck size={14} className="text-blue-600" /> 配送时效及退换货细则</h5>
                      <p className="text-slate-500">现货订单在24小时内闪电派发，支持主流物流查询。未开封且不影响二次销售的商品支持7天无理由退换服务。</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>

      {/* Footer Area Matching Screenshot */}
      <footer className="bg-[#1E293B] text-slate-400 text-xs mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-base tracking-wider">天创 MRO</span>
              <span className="bg-blue-600 text-white font-mono font-extrabold text-[9px] px-1.5 py-0.5 rounded">STORE</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              中国领先的工业品MRO一站式采购服务平台。致力于为企业和工厂提供安全防护、五金工具、仪器仪表等数万种高质量设备，提质增效。
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-slate-100 font-extrabold text-xs">关于我们</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">平台介绍</a></li>
              <li><a href="#" className="hover:text-white transition-colors">合作伙伴</a></li>
              <li><a href="#" className="hover:text-white transition-colors">品质申明</a></li>
              <li><a href="#" className="hover:text-white transition-colors">加入我们</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-100 font-extrabold text-xs">购物指南</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">采购流程</a></li>
              <li><a href="#" className="hover:text-white transition-colors">支付及账期开通</a></li>
              <li><a href="#" className="hover:text-white transition-colors">发票及报销</a></li>
              <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-100 font-extrabold text-xs">售后服务</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">退换货政策</a></li>
              <li><a href="#" className="hover:text-white transition-colors">物流寄送说明</a></li>
              <li><a href="#" className="hover:text-white transition-colors">纠纷及争议仲裁</a></li>
              <li><a href="#" className="hover:text-white transition-colors">联系技术客服</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 py-6 text-center text-slate-500 text-[10px]">
          © 2026 天创MRO商城 (TC-MRO). 版权所有. 工业自动化与安全防护一站式首选平台.
        </div>
      </footer>

    </div>
  );
}
