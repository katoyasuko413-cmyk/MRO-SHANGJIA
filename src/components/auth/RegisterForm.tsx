import React, { useState } from 'react';
import { Eye, EyeOff, User, MessageSquare, Key, ShieldCheck, Building2, UserCircle, Mail } from 'lucide-react';

export default function RegisterForm({ onBack }: { onBack: () => void }) {
  // @State formData
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    smsCode: '',
    password: '',
    confirmPassword: '',
    email: '',
    agreePolicy: false,
  });
  
  // @State uiState
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // @Action
  const handleGetSmsCode = () => {
    if (!formData.phone) return alert('请输入手机号');
    if (countdown > 0) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // @Action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreePolicy) return alert('请先阅读并同意《商家平台隐私政策》');
    if (formData.password !== formData.confirmPassword) return alert('两次输入的密码不一致');
    console.log('Register attempt:', formData);
    // TODO: Connect to backend API
    onBack();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Company Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="请输入公司全称"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>

        {/* Contact Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircle className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="请输入姓名"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            required
          />
        </div>

        {/* Phone Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="请输入正确手机号"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        {/* SMS Code Input */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MessageSquare className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
              placeholder="请输入短信验证码"
              value={formData.smsCode}
              onChange={(e) => setFormData({ ...formData, smsCode: e.target.value })}
              required
            />
          </div>
          <button
            type="button"
            onClick={handleGetSmsCode}
            disabled={countdown > 0}
            className={`w-32 rounded-xl border-2 text-sm font-bold transition-all ${
              countdown > 0 
                ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </button>
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            className="block w-full pl-10 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="密码 (8-20位，大小写字母+数字+特殊符号组合)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ShieldCheck className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="block w-full pl-10 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="确认密码 (8-20位，大小写字母+数字+特殊符号组合)"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="请输入企业邮箱"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

      </div>

      {/* Options */}
      <div className="flex items-center text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={formData.agreePolicy}
            onChange={(e) => setFormData({ ...formData, agreePolicy: e.target.checked })}
          />
          <span className="text-slate-600">
            我已经阅读并同意《<a href="#policy" className="text-blue-600 font-bold hover:underline">商家平台隐私政策</a>》
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
      >
        注册
      </button>

      {/* Back to login */}
       <div className="text-center mt-6">
         <button type="button" onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
            返回登录
         </button>
       </div>
    </form>
  );
}
