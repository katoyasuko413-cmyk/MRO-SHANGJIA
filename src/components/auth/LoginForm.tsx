import React, { useState } from 'react';
import { User, Key, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onForgotPassword, onRegister }: { onForgotPassword: () => void, onRegister: () => void }) {
  const navigate = useNavigate();

  // @State formData: phone(手机号) | password(密码) | verifyCode(图形验证码) | remember(记住密码)
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    verifyCode: '',
    remember: false,
  });

  // @Rule 基础校验: IF phone为空 OR password为空 THEN 拦截提交
  // @Action 提交登录: 校验必输项 -> 调用登录API -> 缓存凭据 -> 跳转平台首页
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // TODO: Connect to actual DaaS/Backend API
    localStorage.setItem('isQualified', formData.remember ? 'false' : 'true');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Phone Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="请输入手机号"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="password"
            className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="请输入密码"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        {/* Verify Code Input */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheck className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
              placeholder="请输入验证码"
              value={formData.verifyCode}
              onChange={(e) => setFormData({ ...formData, verifyCode: e.target.value })}
              required
            />
          </div>
          <div className="w-32 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-slate-100 text-slate-400 text-sm font-bold cursor-pointer hover:border-blue-500 transition-all">
            {/* Placeholder for actual captcha image */}
            <span>图形验证码</span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={formData.remember}
            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
          />
          <span className="text-sm text-slate-600">记住密码</span>
        </label>
        <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-blue-600 hover:underline">
          忘记密码
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
      >
        立即登录
      </button>

      {/* Register Link */}
      <div className="mt-12 pt-8 border-t border-slate-100">
        <div className="flex items-center justify-start gap-1">
          <span className="text-sm text-slate-500">还没有账号，</span>
          <button 
            type="button" 
            onClick={onRegister} 
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
          >
            去注册！
          </button>
        </div>
      </div>
    </form>
  );
}
