
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, MapPin, Link as LinkIcon, Save, Loader2, Plus } from 'lucide-react';
import { UserProfile } from '../types';
import { useToast } from '../contexts/ToastContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: UserProfile;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    skills: [] as string[]
  });
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when opening
  useEffect(() => {
    if (isOpen) {
      setFormData({
        displayName: initialData.displayName || '',
        bio: initialData.bio || '',
        location: initialData.location || '',
        website: initialData.website || '',
        skills: initialData.skills ? [...initialData.skills] : []
      });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const skill = newSkill.trim();
    if (!skill) return;
    
    if (formData.skills.includes(skill)) {
      showToast('该技能标签已存在', 'warning');
      return;
    }
    
    if (formData.skills.length >= 10) {
      showToast('最多添加 10 个技能标签', 'warning');
      return;
    }

    setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(s => s !== skillToRemove) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      showToast('昵称不能为空', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      showToast('保存失败，请重试', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-lg">编辑个人资料</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">昵称</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.displayName}
                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="您的显示名称"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">个人简介</label>
              <textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none h-32 leading-relaxed"
                placeholder="介绍一下自己，包括擅长的风格、接单意向等..."
                maxLength={200}
              />
              <div className="text-right text-xs text-slate-400 mt-1">{formData.bio.length}/200</div>
            </div>

            {/* Location & Website Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">所在地</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="城市，国家"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">个人网站 / 作品集</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.website}
                    onChange={e => setFormData({...formData, website: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">技能标签</label>
              <div className="flex flex-wrap gap-2 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-200 min-h-[50px]">
                {formData.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-indigo-600 border border-indigo-100 shadow-sm animate-scale-in">
                    {skill}
                    <button 
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1.5 hover:text-red-500 focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input 
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => {
                    if(e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="bg-transparent text-sm min-w-[100px] flex-1 outline-none placeholder:text-slate-400"
                  placeholder={formData.skills.length === 0 ? "输入技能后按回车添加" : "+ 添加"}
                />
              </div>
              <p className="text-xs text-slate-400 ml-1">例如：插画、3D建模、UI设计、Photoshop</p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2.5 text-slate-600 text-sm font-bold hover:bg-slate-200 rounded-xl transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            form="edit-profile-form"
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存修改
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default EditProfileModal;
