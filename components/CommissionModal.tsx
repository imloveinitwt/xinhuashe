import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Briefcase, Calendar, DollarSign, FileText, CheckCircle2, 
  Loader2, AlertCircle, User, ShieldCheck, Clock, Send
} from 'lucide-react';
import { User as UserType } from '../types';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: { name: string; avatar: string; id?: string };
  currentUser?: UserType | null;
  onTriggerLogin?: () => void;
}

const CommissionModal: React.FC<CommissionModalProps> = ({ 
  isOpen, onClose, targetUser, currentUser, onTriggerLogin 
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'commercial', // commercial, personal, full-time
    title: '',
    budget: '',
    deadline: '',
    description: '',
    contact: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({
        type: 'commercial',
        title: '',
        budget: '',
        deadline: '',
        description: '',
        contact: currentUser?.email || currentUser?.phone || ''
      });
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入项目标题';
    if (!formData.budget.trim()) newErrors.budget = '请输入预算范围';
    if (!formData.description.trim()) newErrors.description = '请输入需求描述';
    if (!formData.contact.trim()) newErrors.contact = '请输入联系方式';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!currentUser && onTriggerLogin) {
      onTriggerLogin();
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'success' ? (
          <div className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">邀约发送成功！</h3>
            <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
              已将您的合作意向发送给 <span className="font-bold text-slate-800">{targetUser.name}</span>。
              <br/>对方回复后，您将在消息中心收到通知。
            </p>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              完成
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                发起合作邀约
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <span>发送给:</span>
                <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                  <img src={targetUser.avatar} className="w-4 h-4 rounded-full" alt="" />
                  <span className="font-bold text-slate-700">{targetUser.name}</span>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-5">
                
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">合作类型</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'commercial', label: '商用外包' },
                      { id: 'personal', label: '个人私稿' },
                      { id: 'full-time', label: '全职/签约' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`py-2.5 text-sm font-bold rounded-xl border transition-all ${
                          formData.type === type.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">项目标题 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.title ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                    placeholder="例如：2024春节活动主视觉插画"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                {/* Budget & Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">预估预算 <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          errors.budget ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'
                        }`}
                        placeholder="例如：5000-8000"
                      />
                    </div>
                    {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">期望交付</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="date" 
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">需求详情 <span className="text-red-500">*</span></label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all h-32 resize-none leading-relaxed ${
                      errors.description ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                    placeholder="请简要描述您的需求，包括风格参考、尺寸规格、用途等..."
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">联系方式 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.contact ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                    placeholder="微信号 / 手机号 / 邮箱"
                  />
                  {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
                </div>

                {/* Security Tip */}
                <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                   <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                   <p>薪画社提供全额资金托管服务，保障交易安全。请勿轻信私下转账要求。</p>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 text-slate-600 text-sm font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                发送邀约
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CommissionModal;