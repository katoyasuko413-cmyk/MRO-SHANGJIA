import React, { useState } from 'react';
import { Eye, EyeOff, User, MessageSquare, Key, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  // @State formData: phone(手机号) | smsCode(短信验证码) | newPassword(新密码) | confirmPassword(确认密码) | agreePolicy(同意隐私政策)
  const [formData, setFormData] = useState({
    phone: '',
    smsCode: '',
    newPassword: '',
    confirmPassword: '',
    agreePolicy: false,
  });
  
  // @State uiState: showPassword(显示密码) | showConfirmPassword(显示确认密码) | countdown(验证码倒计时)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // @Action 获取验证码: 校验手机号 -> 触发防刷 -> 开启60s倒计时 -> 调用短信API
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

  // @Action 提交重置: 校验输入完整性 -> 校验密码一致性 -> 校验政策勾选 -> 提交修改API -> 提示成功并返回登录
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreePolicy) return alert('请先阅读并同意《商家平台隐私政策》');
    if (formData.newPassword !== formData.confirmPassword) return alert('两次输入的密码不一致');
    console.log('Reset password attempt:', formData);
    // TODO: Connect to backend API
    onBack();
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
            placeholder="请输入登录手机号"
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

        {/* New Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            className="block w-full pl-10 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="新密码 (8-20位，字母+数字组合)"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
            placeholder="确认新密码"
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
        确认修改
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
