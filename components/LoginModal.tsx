import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff, Mail, Lock, User as UserIcon, CheckCircle2, Loader2, Hexagon, AlertCircle, Smartphone, MessageSquare } from 'lucide-react';
import { UserRole, User } from '../types';
import { AuthService } from '../services/AuthService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regMethod, setRegMethod] = useState<'email' | 'phone'>('email'); // New state for registration method
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    verifyCode: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Timer for verification code
  const [countdown, setCountdown] = useState(0);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setRegMethod('email');
      setFormData({ email: '', phone: '', verifyCode: '', username: '', password: '', confirmPassword: '', agreeTerms: false });
      setErrors({});
      setGeneralError(null);
      setSubmitSuccess(false);
      setCountdown(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle Timer
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendCode = async () => {
    // Validate Phone first
    if (!formData.phone) {
      setErrors(prev => ({...prev, phone: '请输入手机号'}));
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      setErrors(prev => ({...prev, phone: '手机号格式不正确'}));
      return;
    }
    
    // Clear phone error if any
    setErrors(prev => {
      const newErrors = {...prev};
      delete newErrors.phone;
      return newErrors;
    });

    try {
      await AuthService.sendSmsCode(formData.phone);
      setCountdown(60);
      setFormData(prev => ({ ...prev, verifyCode: '123456' })); // Demo auto-fill
    } catch (err: any) {
      setGeneralError(err.message || '验证码发送失败');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (mode === 'login') {
       // Login validation (simplified)
       if (!formData.email) newErrors.email = '请输入账号（邮箱/手机）';
       if (!formData.password) newErrors.password = '请输入密码';
    } else {
       // Register Validation
       if (!formData.username) newErrors.username = '请输入用户名';
       
       if (regMethod === 'email') {
          if (!formData.email) {
            newErrors.email = '请输入电子邮箱';
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '邮箱格式不正确';
          }
       } else {
          if (!formData.phone) {
            newErrors.phone = '请输入手机号';
          } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = '手机号格式不正确';
          }
          
          if (!formData.verifyCode) {
            newErrors.verifyCode = '请输入验证码';
          }
       }

       if (!formData.password) {
         newErrors.password = '请输入密码';
       } else if (formData.password.length < 6) {
         newErrors.password = '密码长度至少需6位';
       }

       if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = '两次输入的密码不一致';
       }

       if (!formData.agreeTerms) {
         newErrors.terms = '请同意服务条款与隐私政策';
       }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Login Logic
        let role: UserRole = 'creator';
        if (formData.email.includes('admin')) role = 'root_admin';
        else if (formData.email.includes('enter') || formData.email.includes('corp')) role = 'enterprise';
        
        // Use email field as generic identifier input for login
        const user = await AuthService.login(formData.email, role);
        onLogin(user);
      } else {
        // Register Logic
        const contact = regMethod === 'email' ? formData.email : formData.phone;
        await AuthService.register(formData.username, contact, regMethod, 'creator');
        
        // Register Success UI Flow
        setSubmitSuccess(true);
        setTimeout(async () => {
           // Auto login after register
           const user = await AuthService.login(contact);
           onLogin(user);
        }, 1500);
      }
    } catch (error: any) {
      setGeneralError(error.message || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      // 快速生成一个演示账号
      const demoEmail = `${role}_demo@xinhuashe.com`;
      const user = await AuthService.login(demoEmail, role);
      onLogin(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
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
            {submitSuccess ? '正在自动登录...' : (mode === 'login' ? '登录以管理您的创意资产与项目' : '加入薪画社，连接无限创意可能')}
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
              
              {generalError && (
                 <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   {generalError}
                 </div>
              )}

              {/* Registration Method Tabs */}
              {mode === 'register' && (
                <div className="flex p-1 bg-slate-100 rounded-lg mb-2">
                   <button
                     type="button"
                     onClick={() => { setRegMethod('email'); setErrors({}); }}
                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
                       regMethod === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                   >
                     <Mail className="w-3.5 h-3.5" /> 邮箱注册
                   </button>
                   <button
                     type="button"
                     onClick={() => { setRegMethod('phone'); setErrors({}); }}
                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
                       regMethod === 'phone' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                   >
                     <Smartphone className="w-3.5 h-3.5" /> 手机注册
                   </button>
                </div>
              )}

              {/* Username Field (Register Only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">用户名</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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

              {/* Account Input (Email or Phone or Generic for Login) */}
              {(mode === 'login' || regMethod === 'email') && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {mode === 'login' ? '账号 (邮箱/手机)' : '电子邮箱'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'}`}
                      placeholder={mode === 'login' ? "请输入账号" : "name@example.com"}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>
              )}

              {/* Phone Registration Fields */}
              {mode === 'register' && regMethod === 'phone' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">手机号码</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'}`}
                        placeholder="请输入11位手机号"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">验证码</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.verifyCode ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'}`}
                          placeholder="6位数字"
                          value={formData.verifyCode}
                          onChange={e => setFormData({...formData, verifyCode: e.target.value})}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                        className={`w-24 px-0 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                          countdown > 0 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                      >
                        {countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </button>
                    </div>
                    {errors.verifyCode && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.verifyCode}</p>}
                  </div>
                </>
              )}

              {/* Password Fields */}
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

              {/* Login Options */}
              {mode === 'login' && (
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
                    记住我 (30天内免登录)
                  </label>
                </div>
              )}

              {/* Register Terms */}
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? (isLoading ? '登录中...' : '登录') : (isLoading ? '注册中...' : '立即注册')}
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
          {!submitSuccess && mode === 'login' && !isLoading && (
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
    </div>,
    document.body
  );
};

export default LoginModal;