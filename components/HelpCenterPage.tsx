import React, { useState } from 'react';
import { 
  Search, ArrowLeft, HelpCircle, User, CreditCard, Shield, 
  FileText, MessageCircle, ChevronRight, ChevronDown, Mail, Phone 
} from 'lucide-react';

interface HelpCenterPageProps {
  onBack: () => void;
}

type CategoryKey = 'account' | 'transaction' | 'copyright' | 'community';

const CATEGORIES: { id: CategoryKey; title: string; icon: any; color: string; desc: string }[] = [
  { id: 'account', title: '账号与认证', icon: User, color: 'bg-blue-100 text-blue-600', desc: '注册登录、实名认证、资料修改' },
  { id: 'transaction', title: '交易与资金', icon: CreditCard, color: 'bg-green-100 text-green-600', desc: '充值提现、服务费、发票申请' },
  { id: 'copyright', title: '版权与争议', icon: Shield, color: 'bg-rose-100 text-rose-600', desc: '版权归属、侵权投诉、交易仲裁' },
  { id: 'community', title: '社区规则', icon: MessageCircle, color: 'bg-purple-100 text-purple-600', desc: '发帖规范、信用评分、违规处理' },
];

const FAQ_DATA: Record<CategoryKey, { q: string; a: string }[]> = {
  account: [
    { q: '如何申请成为认证画师？', a: '登录后，进入“个人空间” -> “编辑资料”，点击“申请认证”按钮。您需要完成实名认证，并上传至少 3 张高质量的原创代表作。审核通常在 1-3 个工作日内完成，审核通过后您的主页将获得“认证画师”标识。' },
    { q: '忘记登录密码怎么办？', a: '在登录页面点击“忘记密码”，输入您的注册邮箱或手机号，系统将发送验证码或重置链接。验证通过后即可设置新密码。' },
    { q: '如何注销账号？', a: '请联系人工客服进行注销申请。注销前请确保账户内无未完成订单及剩余余额。' },
  ],
  transaction: [
    { q: '平台收取多少服务费？', a: '对于普通创作者，平台收取交易金额的 5% 作为技术服务费，用于维护平台运营、服务器成本及提供资金担保服务。企业签约客户或高级会员可享受更低费率优惠（最低可至 2%）。' },
    { q: '提现多久到账？', a: '工作日发起的提现，支付宝/微信通常在 24 小时内到账，银行卡可能需要 1-3 个工作日。平台每月提供 3 次免费提现机会。' },
    { q: '如何申请开具发票？', a: '企划方可在“财务中心” -> “发票管理”中，勾选已完成的订单申请开票。支持电子普票（3工作日内）和纸质专票（7工作日内）。' },
  ],
  copyright: [
    { q: '作品被抄袭或盗图怎么办？', a: '请立即通过底部的“版权投诉指引”提交侵权举报，附上您的原图、发布时间证明。法务团队会在 24 小时内介入。' },
    { q: '交易稿件的版权归谁？', a: '默认情况下，定制交易为“买断制”，版权归企划方所有。若双方约定为“授权制”，则画师保留著作权，仅授权特定使用范围。' },
    { q: '雇主拒付怎么办？', a: '在订单页面点击“申请仲裁”。平台仲裁委员会将介入，依据双方的聊天记录、阶段性交付物进行裁决。' },
  ],
  community: [
    { q: '什么内容会被判定为违规？', a: '涉及色情、暴力、政治敏感、恶意广告或人身攻击的内容将被判定为违规。严重违规将导致封号。' },
    { q: '信用分有什么用？', a: '信用分影响您的接单权限和搜索排名。按时交付、获得好评可提升信用分；拖稿、违规将扣分。' },
  ],
};

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('account');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Hero Search Section */}
      <div className="bg-[#0B0F19] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600 rounded-full opacity-20 blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          <button 
            onClick={onBack}
            className="absolute left-0 top-0 md:-top-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </button>
          
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">你好，我们能帮到你什么？</h1>
          <p className="text-slate-400 mb-8 text-lg max-w-2xl mx-auto">搜索常见问题，或浏览下方分类指南</p>
          
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="搜索关键词，例如：'提现'、'发票'、'版权'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl text-slate-900 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-xl transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        
        {/* 2. Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setExpandedFaq(null); }}
              className={`bg-white p-6 rounded-2xl shadow-sm border transition-all text-left group hover:shadow-xl hover:-translate-y-1 ${
                activeCategory === cat.id 
                  ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors ${activeCategory === cat.id ? 'text-indigo-600' : 'text-slate-800'}`}>
                {cat.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {cat.desc}
              </p>
            </button>
          ))}
        </div>

        {/* 3. FAQ Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main FAQ List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-600" />
              常见问题：{CATEGORIES.find(c => c.id === activeCategory)?.title}
            </h2>
            
            <div className="space-y-4">
              {FAQ_DATA[activeCategory].map((faq, index) => (
                <div 
                  key={index} 
                  className={`border rounded-xl transition-all duration-300 overflow-hidden bg-white ${
                    expandedFaq === index ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex-1 pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div 
                    className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                      expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-indigo-50 bg-indigo-50/10">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">相关文档</h3>
              <div className="flex gap-6">
                <a href="#" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium">
                  <FileText className="w-4 h-4" /> 用户协议条款
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium">
                  <Shield className="w-4 h-4" /> 隐私政策声明
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Contact */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">仍需帮助？</h3>
              <p className="text-sm text-slate-500 mb-6">
                如果上方未能解决您的问题，请随时联系我们的支持团队。
              </p>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                  <MessageCircle className="w-4 h-4" /> 在线咨询
                </button>
                <button className="w-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> 发送邮件
                </button>
              </div>
            </div>

            <div className="bg-slate-100 p-6 rounded-2xl">
              <h3 className="font-bold text-slate-800 mb-3">服务时间</h3>
              <div className="text-sm text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>在线客服：</span>
                  <span className="font-medium">9:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>电话支持：</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>邮件回复：</span>
                  <span className="font-medium">24小时内</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Phone className="w-3 h-3" />
                客服热线：400-888-6666
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;