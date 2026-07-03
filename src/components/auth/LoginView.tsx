import React, { useState } from 'react';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import RegisterForm from './RegisterForm';

export default function LoginView() {
  const [currentView, setCurrentView] = useState<'login' | 'forgot_password' | 'register'>('login');

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      
      {/* Left Area - Branding (Based on wireframe placeholder) */}
      <div className="hidden lg:flex w-1/2 h-full bg-[#0F172A] p-16 flex-col justify-center text-white relative overflow-hidden">
        <div className="w-full max-w-lg mx-auto space-y-12 z-10">
          {/* Logo Placeholder */}
          <div className="w-full h-48 border-2 border-transparent bg-slate-800/20 flex items-center justify-center relative shadow-sm rounded-xl overflow-hidden p-6">
            <img src="/logo2.png" alt="Logo" className="w-auto h-full object-contain drop-shadow-md" />
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-extrabold leading-[0.9] tracking-tighter text-white">欢迎登录</h1>
            <div className="h-px w-full bg-slate-800 my-4" /> {/* Separator from wireframe */}
            <div className="inline-block bg-blue-500/10 text-blue-500 text-2xl font-bold tracking-tight px-3 py-1 rounded">
              天创MRO商城-商家端
            </div>
          </div>
        </div>
      </div>

      {/* Right Area - Form */}
      <div className="w-full lg:w-1/2 h-full bg-white overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8 sm:p-12 lg:p-20">
          <div className="w-full max-w-md space-y-10 py-8">
            {currentView === 'login' && (
            <>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">登录</h2>
              </div>
              <LoginForm onForgotPassword={() => setCurrentView('forgot_password')} onRegister={() => setCurrentView('register')} />
            </>
          )}

          {currentView === 'forgot_password' && (
             <>
               <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">找回密码</h2>
              </div>
              <ForgotPasswordForm onBack={() => setCurrentView('login')} />
             </>
          )}

          {currentView === 'register' && (
             <>
               <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">商家注册</h2>
              </div>
              <RegisterForm onBack={() => setCurrentView('login')} />
             </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
