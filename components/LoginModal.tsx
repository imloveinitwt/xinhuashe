
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, CheckCircle2, Loader2, ArrowRight, Hexagon, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setFormData({ email: '', username: '', password: '', confirmPassword: '', agreeTerms: false });
      setErrors({});
      setSubmitSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email Validation
    if (!formData.email) {
      newErrors.email = '请输入电子邮箱';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少需6位';
    }

    if (mode === 'register') {
      // Username
      if (!formData.username) newErrors.username = '请输入用户名';
      
      // Confirm Password
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次输入的密码不一致';
      }

      // Terms
      if (!formData.agreeTerms) {
        newErrors.terms = '请同意服务条款与隐私政策';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      
      if (mode === 'login') {
        // Mock Login Logic based on email content for demo purposes
        let role: UserRole = 'creator'; // default
        if (formData.email.includes('admin')) role = 'root_admin';
        else if (formData.email.includes('enter')) role = 'enterprise';
        else if (formData.email.includes('corp')) role = 'enterprise';
        
        onLogin(role);
      } else {
        // Register Success
        setSubmitSuccess(true);
        // Auto switch to login after 1.5s
        setTimeout(() => {
          setSubmitSuccess(false);
          setMode('login');
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        }, 1500);
      }
    }, 1500);
  };

  const handleQuickLogin = (role: UserRole) => {
    onLogin(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-2 rounded-xl mb-4 shadow-lg shadow-indigo-200">
            <Hexagon className="w-8 h-8 text-white fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {submitSuccess ? '注册成功' : (mode === 'login' ? '欢迎回来' : '创建账号')}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {submitSuccess ? '正在跳转至登录页面...' : (mode === 'login' ? '登录以管理您的创意资产与项目' : '加入薪画社，连接无限创意可能')}
          </p>
        </div>

        {/* Form Content */}
        <div className="px-8 pb-8 overflow-y-auto custom-scrollbar">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-scale-in" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">用户名</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.username ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'}`}
                      placeholder="设置您的昵称"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.username}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">电子邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">密码</label>
                  {mode === 'login' && (
                    <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline">忘记密码?</a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>}
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">确认密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'}`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword}</p>}
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
                    记住我 (30天内免登录)
                  </label>
                </div>
              )}

              {mode === 'register' && (
                <div className="flex items-start">
                  <input 
                    id="agree-terms" 
                    type="checkbox" 
                    className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                    checked={formData.agreeTerms}
                    onChange={e => setFormData({...formData, agreeTerms: e.target.checked})}
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-600 leading-snug">
                    我已阅读并同意 <a href="#" className="text-indigo-600 hover:underline">《服务条款》</a> 和 <a href="#" className="text-indigo-600 hover:underline">《隐私政策》</a>
                  </label>
                </div>
              )}
              {errors.terms && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.terms}</p>}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? '登录' : '立即注册'}
              </button>

            </form>
          )}

          {/* Mode Switcher */}
          {!submitSuccess && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                {mode === 'login' ? '还没有账号？' : '已有账号？'}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="ml-1 font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  {mode === 'login' ? '去注册' : '直接登录'}
                </button>
              </p>
            </div>
          )}

          {/* Quick Login Demo (Prototype Only) */}
          {!submitSuccess && mode === 'login' && (
             <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-3">原型演示 · 快速通道</p>
                <div className="flex gap-2 justify-center">
                   <button 
                    onClick={() => handleQuickLogin('creator')}
                    className="text-xs px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium"
                   >
                     画师账号
                   </button>
                   <button 
                    onClick={() => handleQuickLogin('enterprise')}
                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                   >
                     企业账号
                   </button>
                   <button 
                    onClick={() => handleQuickLogin('root_admin')}
                    className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                   >
                     管理员
                   </button>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginModal;
