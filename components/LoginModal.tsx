
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Eye, EyeOff, Mail, Lock, User as UserIcon, CheckCircle2, Loader2, 
  Hexagon, AlertCircle, Smartphone, MessageSquare, ArrowLeft, 
  Palette, Briefcase, Zap, Globe, ShieldCheck, Layout, Sparkles, ArrowRight, Compass 
} from 'lucide-react';
import { UserRole, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/AuthService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { login, register } = useAuth();
  
  // State for Flow Control
  const [step, setStep] = useState<'roles' | 'auth'>('roles');
  const [selectedRole, setSelectedRole] = useState<UserRole>('creator');

  // State for Auth Form
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regMethod, setRegMethod] = useState<'email' | 'phone'>('email');
  
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
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Reset everything on open
      setStep('roles');
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

  // --- Actions ---

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('auth');
    setGeneralError(null);
  };

  const handleSendCode = async () => {
    if (!formData.phone) {
      setErrors(prev => ({...prev, phone: '请输入手机号'}));
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      setErrors(prev => ({...prev, phone: '手机号格式不正确'}));
      return;
    }
    setErrors(prev => {
      const newErrors = {...prev};
      delete newErrors.phone;
      return newErrors;
    });

    try {
      await AuthService.sendSmsCode(formData.phone);
      setCountdown(60);
      setFormData(prev => ({ ...prev, verifyCode: '123456' }));
    } catch (err: any) {
      setGeneralError(err.message || '验证码发送失败');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'login') {
       if (!formData.email) newErrors.email = '请输入账号（邮箱/手机）';
       if (!formData.password) newErrors.password = '请输入密码';
    } else {
       if (!formData.username) newErrors.username = '请输入用户名';
       if (regMethod === 'email') {
          if (!formData.email) newErrors.email = '请输入电子邮箱';
          else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '邮箱格式不正确';
       } else {
          if (!formData.phone) newErrors.phone = '请输入手机号';
          else if (!/^1[3-9]\d{9}$/.test(formData.phone)) newErrors.phone = '手机号格式不正确';
          if (!formData.verifyCode) newErrors.verifyCode = '请输入验证码';
       }
       if (!formData.password) newErrors.password = '请输入密码';
       else if (formData.password.length < 6) newErrors.password = '密码长度至少需6位';
       if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '两次输入的密码不一致';
       if (!formData.agreeTerms) newErrors.terms = '请同意服务条款与隐私政策';
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
        // Logic to allow admin override even if role selected was different, purely for demo convenience
        let targetRole = selectedRole;
        if (formData.email.includes('admin')) targetRole = 'root_admin';
        
        await login(formData.email, targetRole);
        onLogin({} as User); // Trigger callback to close modal
      } else {
        const contact = regMethod === 'email' ? formData.email : formData.phone;
        await register(formData.username, contact, regMethod, selectedRole);
        
        setSubmitSuccess(true);
        setTimeout(async () => {
           onLogin({} as User);
        }, 1500);
      }
    } catch (error: any) {
      setGeneralError(error.message || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (roleOverride?: UserRole) => {
    setIsLoading(true);
    try {
      const finalRole = roleOverride || selectedRole;
      const demoEmail = `${finalRole}_demo@xinhuashe.com`;
      await login(demoEmail, finalRole);
      onLogin({} as User);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Helpers ---

  const isWide = step === 'roles';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col transition-all duration-500 ease-in-out max-h-[90vh] ${
          isWide ? 'w-full max-w-5xl h-auto md:h-[600px]' : 'w-full max-w-md h-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 bg-white/50 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- STEP 1: ROLE SELECTION --- */}
        {step === 'roles' && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-8 text-center pb-4">
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2">选择您的身份</h2>
               <p className="text-slate-500">为您定制专属的工作台与功能体验</p>
            </div>

            <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-slate-50/50">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  
                  {/* Creator Card */}
                  <div 
                      onClick={() => handleRoleSelect('creator')}
                      className="group relative bg-white rounded-2xl p-8 cursor-pointer border-2 border-slate-100 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                      <div className="relative z-10 flex flex-col h-full">
                          <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                              <Palette className="w-7 h-7" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">我是个人创作者</h3>
                          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                              建立专业作品集，接取全球商业订单，享受极速结算。
                          </p>
                          <ul className="space-y-3 mb-8 flex-1">
                              <li className="flex items-center gap-2 text-sm text-slate-600">
                                  <Zap className="w-4 h-4 text-pink-500" /> 0手续费提现，T+1 到账
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-600">
                                  <Globe className="w-4 h-4 text-pink-500" /> 专属个人主页与作品集
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-600">
                                  <ShieldCheck className="w-4 h-4 text-pink-500" /> 交易全额担保与合同支持
                              </li>
                          </ul>
                          <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                              <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-600 transition-all flex items-center justify-center gap-2">
                                  进入创作者登录 <ArrowRight className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Enterprise Card */}
                  <div 
                      onClick={() => handleRoleSelect('enterprise')}
                      className="group relative bg-slate-900 rounded-2xl p-8 cursor-pointer border-2 border-slate-800 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-900/20 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                      <div className="relative z-10 flex flex-col h-full text-white">
                          <div className="w-14 h-14 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                              <Briefcase className="w-7 h-7" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">我是企业/团队</h3>
                          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                              一站式解决创意采购、人才管理与数字资产沉淀 (DAM)。
                          </p>
                          <ul className="space-y-3 mb-8 flex-1">
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                  <Layout className="w-4 h-4 text-indigo-400" /> 企业级数字资产库 (DAM)
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> 合规发票与对公结算
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI 辅助需求梳理与匹配
                              </li>
                          </ul>
                          <div className="mt-auto pt-4 border-t border-white/10 w-full">
                              <button className="w-full py-3 bg-white/10 border border-white/10 text-white font-bold rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all flex items-center justify-center gap-2">
                                  进入企业登录 <ArrowRight className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>

               </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 text-center bg-slate-50">
               <button onClick={onClose} className="text-slate-500 hover:text-indigo-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto">
                  <Compass className="w-4 h-4" /> 我是游客，先逛逛社区
               </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: AUTH FORM --- */}
        {step === 'auth' && (
          <div className="flex flex-col h-full animate-slide-in-right">
             <div className="px-8 pt-8 pb-6">
                <button 
                  onClick={() => setStep('roles')}
                  className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> 返回
                </button>

                <div className="text-center mt-4">
                  <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-4 shadow-lg ${
                     selectedRole === 'enterprise' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-pink-500 shadow-pink-200'
                  }`}>
                    {selectedRole === 'enterprise' ? <Briefcase className="w-6 h-6 text-white" /> : <Palette className="w-6 h-6 text-white" />}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {submitSuccess ? '注册成功' : (mode === 'login' ? (selectedRole === 'enterprise' ? '企业账号登录' : '创作者登录') : '创建账号')}
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
                    {submitSuccess ? '正在自动登录...' : (mode === 'login' ? '欢迎回来，请输入您的账号信息' : '加入薪画社，开启您的创意之旅')}
                  </p>
                </div>
             </div>

             <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
                {submitSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 h-full">
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
                      className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                        selectedRole === 'enterprise' 
                          ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                          : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200'
                      }`}
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {mode === 'login' ? (isLoading ? '登录中...' : '登录') : (isLoading ? '注册中...' : '立即注册')}
                    </button>

                  </form>
                )}

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

                {/* Quick Login - Only visible in Login Mode and for Demo */}
                {!submitSuccess && mode === 'login' && !isLoading && (
                   <div className="mt-8 pt-6 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-3">原型演示 · 快速通道</p>
                      <div className="flex gap-2 justify-center">
                         <button 
                          onClick={() => handleQuickLogin(selectedRole)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
                             selectedRole === 'enterprise' 
                                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                          }`}
                         >
                           {selectedRole === 'enterprise' ? '企业演示号' : '画师演示号'}
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
        )}

      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
