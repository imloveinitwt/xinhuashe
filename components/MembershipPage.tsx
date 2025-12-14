
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Check, Crown, HelpCircle, Star, Zap, Shield, X, 
  Minus, Rocket, ChevronDown, CheckCircle2, Layout, Briefcase,
  Building, ArrowRight, Sparkles, Gem
} from 'lucide-react';
import { User, MembershipLevel } from '../types';
import { MEMBERSHIP_PLANS_CREATOR, MEMBERSHIP_PLANS_ENTERPRISE } from '../constants';

interface MembershipPageProps {
  onBack: () => void;
  user: User | null;
  onUpgrade: (level: MembershipLevel) => void;
  onTriggerLogin: () => void;
  isEmbedded?: boolean;
}

// --- DATA: CREATOR ---
const COMPARISON_GROUPS_CREATOR = [
  {
    title: '核心权益',
    features: [
      { name: '接单服务费率', none: '5%', pro: '3%', max: '0%' },
      { name: '提现手续费', none: '1%', pro: '0.5%', max: '0元' },
      { name: '提现额度/月', none: '¥10,000', pro: '¥50,000', max: '无限' },
    ]
  },
  {
    title: '流量与曝光',
    features: [
      { name: '作品展示权重', none: '标准', pro: '优先排序', max: '首页推荐' },
      { name: '搜索结果加权', none: false, pro: true, max: true },
      { name: '专属身份标识', none: false, pro: true, max: true },
    ]
  },
  {
    title: '增值工具',
    features: [
      { name: 'AI 辅助创作', none: '每日 5 次', pro: '无限次', max: '无限次 + 高级模型' },
      { name: '法律合同审核', none: false, pro: false, max: true },
      { name: '数据分析报告', none: '基础版', pro: '进阶版', max: '全维度' },
    ]
  }
];

const FAQ_CREATOR = [
  { q: '可以随时取消订阅吗？', a: '是的，您可以随时在“账户设置”中取消自动续费。取消后，您当前的权益将保留至本计费周期结束，次一周期不再扣费。' },
  { q: '升级套餐如何计算费用？', a: '升级套餐立即生效，系统将自动计算您当前周期剩余金额并抵扣新套餐费用，您只需支付差价。' },
  { q: 'AI 辅助创作次数如何计算？', a: '每日额度在凌晨 00:00 重置。未使用完的次数不会累积到下一天。Max 版用户的无限次使用受公平使用原则限制。' }
];

// --- DATA: ENTERPRISE ---
const COMPARISON_GROUPS_ENTERPRISE = [
  {
    title: '招聘与协作',
    features: [
      { name: '发布需求审核', none: '标准', pro: '优先加速', max: '免审通道' },
      { name: '人才推荐', none: '算法推荐', pro: '顾问精选', max: '定制猎头' },
      { name: '多账号协作', none: '1人', pro: '3人', max: '无限' },
    ]
  },
  {
    title: '财务与合规',
    features: [
      { name: '发票类型', none: '电子普票', pro: '增值税专票', max: '专票 + 结算单' },
      { name: '合同服务', none: '标准模板', pro: '电子签章', max: '法务审核' },
      { name: '账期支持', none: '无', pro: '申请制', max: '30天' },
    ]
  },
  {
    title: '资产管理 (DAM)',
    features: [
      { name: '存储空间', none: '5GB', pro: '50GB', max: '1TB' },
      { name: 'AI 自动打标', none: '基础', pro: '高级', max: '定制模型' },
      { name: 'API 接口', none: false, pro: false, max: true },
    ]
  }
];

const FAQ_ENTERPRISE = [
  { q: '企业版发票如何开具？', a: '支持开具增值税专用发票或普通电子发票。支付成功后，请前往“财务中心 - 发票管理”提交开票信息，电子发票通常在 1-3 个工作日内发送。' },
  { q: '是否支持对公转账？', a: '支持。在支付页面选择“企业转账”，系统将生成专属收款账号。转账通常在 1 小时内自动核销入账。' },
  { q: '集团客户是否有定制方案？', a: '对于大型集团客户，我们提供私有化部署、SSO 单点登录集成及年度框架协议服务。请联系销售团队获取定制方案。' }
];

const MembershipPage: React.FC<MembershipPageProps> = ({ onBack, user, onUpgrade, onTriggerLogin, isEmbedded = false }) => {
  const [activeRole, setActiveRole] = useState<'creator' | 'enterprise'>(
    user?.role === 'enterprise' ? 'enterprise' : 'creator'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const plans = activeRole === 'creator' ? MEMBERSHIP_PLANS_CREATOR : MEMBERSHIP_PLANS_ENTERPRISE;
  const comparisonData = activeRole === 'creator' ? COMPARISON_GROUPS_CREATOR : COMPARISON_GROUPS_ENTERPRISE;
  const faqList = activeRole === 'creator' ? FAQ_CREATOR : FAQ_ENTERPRISE;
  
  const currentLevel = user ? (user.membershipLevel || 'none') : 'none';
  
  // Visual Theme Config
  const isCreatorView = activeRole === 'creator';
  
  // Theme Variables
  const theme = isCreatorView ? {
    bg: 'bg-slate-50',
    headerBg: 'bg-gradient-to-b from-indigo-50 to-white',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-600',
    accentLight: 'bg-indigo-50',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-100',
    checkColor: 'text-indigo-500',
    buttonPrimary: 'bg-slate-900 text-white hover:bg-slate-800',
    highlightBorder: 'border-indigo-500',
    badge: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  } : {
    bg: 'bg-slate-900',
    headerBg: 'bg-slate-900',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    accent: 'text-blue-400',
    accentBg: 'bg-blue-600',
    accentLight: 'bg-slate-800',
    cardBg: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    checkColor: 'text-blue-400',
    buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-500',
    highlightBorder: 'border-blue-500',
    badge: 'bg-gradient-to-r from-blue-600 to-cyan-500',
  };

  const calculatePrice = (monthlyPrice: number) => {
    return billingCycle === 'yearly' ? Math.floor(monthlyPrice * 12 * 0.8) : monthlyPrice;
  };

  const handleSubscribe = (planId: MembershipLevel) => {
    if (!user) {
      onTriggerLogin();
      return;
    }
    setProcessingId(planId);
    setTimeout(() => {
      onUpgrade(planId);
      setProcessingId(null);
      setShowSuccessModal(true);
    }, 1500);
  };

  const switchRole = () => {
    const newRole = activeRole === 'creator' ? 'enterprise' : 'creator';
    setActiveRole(newRole);
    setExpandedFaq(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`font-sans min-h-screen relative overflow-x-hidden transition-colors duration-500 ${theme.bg} ${isEmbedded ? '' : 'pt-16'}`}>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in shadow-2xl relative border border-slate-100">
              <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                 <CheckCircle2 className="w-10 h-10 text-green-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">升级成功！</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                您的 <span className="font-bold text-slate-800">{isCreatorView ? '创作者' : '企业'} VIP</span> 权益已即时生效。
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
              >
                立即体验权益
              </button>
           </div>
        </div>
      )}

      {/* --- HERO HEADER --- */}
      <div className={`relative ${theme.headerBg} transition-colors duration-500 pb-20 pt-8 overflow-hidden`}>
         
         {/* Dynamic Background Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {isCreatorView ? (
               <>
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] -mr-20 -mt-20 mix-blend-multiply"></div>
                  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[80px] -ml-20 -mb-20 mix-blend-multiply"></div>
                  <div className="absolute top-20 left-1/3 w-32 h-32 bg-yellow-200/40 rounded-full blur-[60px] mix-blend-multiply"></div>
               </>
            ) : (
               <>
                  <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                  <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-800/50 rounded-full blur-[100px] -ml-20 -mb-20"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
               </>
            )}
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center mb-12">
               {!isEmbedded && (
                  <button 
                    onClick={onBack}
                    className={`flex items-center gap-2 transition-colors font-medium text-sm px-4 py-2 rounded-full hover:bg-white/10 ${theme.textSecondary} hover:${theme.textPrimary}`}
                  >
                    <ArrowLeft className="w-4 h-4" /> 返回
                  </button>
               )}
               
               {/* Role Switcher - Pill Style */}
               <button 
                  onClick={switchRole}
                  className={`flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-full transition-all group backdrop-blur-md border ${
                     isCreatorView 
                        ? 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white shadow-sm' 
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
               >
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">当前视角</span>
                  <span className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}>
                     {isCreatorView ? '个人创作者' : '企业/团队'}
                  </span>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${
                     isCreatorView 
                        ? 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200' 
                        : 'bg-blue-900 text-blue-300 group-hover:bg-blue-800'
                  }`}>
                     切换 <ArrowRight className="w-3 h-3" />
                  </div>
               </button>
            </div>

            <div className="text-center max-w-3xl mx-auto">
               <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 border backdrop-blur-sm shadow-sm ${
                  isCreatorView 
                     ? 'bg-white/80 border-indigo-100 text-indigo-600' 
                     : 'bg-slate-800/80 border-blue-900 text-blue-400'
               }`}>
                  {isCreatorView ? <Sparkles className="w-3 h-3 fill-current" /> : <Briefcase className="w-3 h-3 fill-current" />}
                  {isCreatorView ? 'UNLOCK CREATIVITY' : 'POWER YOUR BUSINESS'}
               </div>
               
               <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight ${theme.textPrimary}`}>
                  {isCreatorView ? '升级您的' : '构建您的'}
                  <span className={`mx-3 text-transparent bg-clip-text ${
                     isCreatorView 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                        : 'bg-gradient-to-r from-blue-400 to-cyan-300'
                  }`}>
                     {isCreatorView ? '创作引擎' : '创意中台'}
                  </span>
               </h1>
               
               <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium ${theme.textSecondary}`}>
                  {isCreatorView 
                    ? '加入数万名 Pro 创作者，享受更低费率、更高流量曝光与专属 AI 工具。' 
                    : '为团队赋能，解锁企业级资产管理、合规发票与专属项目经理支持。'}
               </p>

               {/* Billing Toggle - Interactive Slider */}
               <div className="flex justify-center items-center gap-4">
                  <span className={`text-sm font-bold ${billingCycle === 'monthly' ? theme.textPrimary : theme.textSecondary}`}>按月付费</span>
                  
                  <button 
                     onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                     className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 relative focus:outline-none ${
                        isCreatorView 
                           ? (billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-slate-200') 
                           : (billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-slate-700')
                     }`}
                  >
                     <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
                     }`}></div>
                  </button>
                  
                  <div className="flex items-center gap-2">
                     <span className={`text-sm font-bold ${billingCycle === 'yearly' ? theme.textPrimary : theme.textSecondary}`}>按年付费</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse ${
                        isCreatorView ? 'bg-rose-100 text-rose-600' : 'bg-green-900 text-green-400 border border-green-700'
                     }`}>
                        省 20%
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --- PRICING CARDS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {plans.map((plan) => {
               const isCurrent = currentLevel === plan.id;
               const isRec = plan.recommended;
               const finalPrice = calculatePrice(plan.price);

               return (
                  <div 
                    key={plan.id} 
                    className={`relative flex flex-col rounded-[2rem] transition-all duration-300 group ${theme.cardBg} ${
                       isRec 
                         ? `border-2 ${theme.highlightBorder} shadow-2xl scale-105 z-10` 
                         : `border ${theme.cardBorder} shadow-lg hover:shadow-xl hover:-translate-y-2`
                    }`}
                  >
                     {isRec && (
                        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${theme.badge} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap`}>
                           <Star className="w-3.5 h-3.5 fill-current" /> 最受欢迎方案
                        </div>
                     )}

                     <div className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-4">
                           <div className={`p-3 rounded-2xl ${isCreatorView ? 'bg-slate-100' : 'bg-slate-700/50'}`}>
                              {plan.id === 'max' && <Crown className="w-6 h-6 text-amber-500 fill-current" />}
                              {plan.id === 'pro' && <Zap className={`w-6 h-6 ${theme.accent} fill-current`} />}
                              {plan.id === 'none' && <Shield className={`w-6 h-6 ${theme.textSecondary}`} />}
                           </div>
                           <h3 className={`text-xl font-bold ${theme.textPrimary}`}>{plan.name}</h3>
                        </div>
                        
                        <div className="mb-6 flex items-baseline gap-1">
                           <span className={`text-4xl font-extrabold ${theme.textPrimary}`}>¥{finalPrice}</span>
                           {plan.price > 0 && <span className={`font-medium text-sm ${theme.textSecondary}`}>/{billingCycle === 'yearly' ? '年' : '月'}</span>}
                        </div>

                        <p className={`text-sm leading-relaxed pb-6 min-h-[80px] border-b ${isCreatorView ? 'border-slate-100 text-slate-500' : 'border-slate-700 text-slate-400'}`}>
                           {plan.id === 'none' && (isCreatorView ? '适合刚开始探索的个人创作者，提供基础接单与展示功能。' : '适合小微企业发布基础需求，体验平台流程。')}
                           {plan.id === 'pro' && (isCreatorView ? '适合职业自由画师，提供更低的费率、更多的曝光和 AI 辅助工具。' : '适合成长型企业，解锁合规发票、DAM 资产管理与优先服务。')}
                           {plan.id === 'max' && (isCreatorView ? '适合工作室或高频交易用户，享受零费率、专属服务和顶级流量支持。' : '适合大型集团，提供专属项目经理、API 集成与定制化服务。')}
                        </p>
                     </div>

                     <div className="p-8 pt-2 flex-1">
                        <ul className="space-y-4">
                           {plan.features.map((feat, i) => (
                              <li key={i} className={`flex items-start gap-3 text-sm ${theme.textPrimary}`}>
                                 <div className={`mt-0.5 rounded-full p-0.5 ${plan.id === 'none' ? 'bg-slate-200 text-slate-500' : `${theme.accentBg} text-white`}`}>
                                    <Check className="w-3 h-3" />
                                 </div>
                                 <span>{feat}</span>
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div className="p-8 pt-0 mt-auto">
                        <button
                           onClick={() => handleSubscribe(plan.id)}
                           disabled={isCurrent || processingId !== null}
                           className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                              isCurrent
                                 ? 'bg-slate-200 text-slate-400 cursor-default shadow-none'
                                 : isRec
                                    ? `${theme.badge} text-white hover:opacity-90 hover:scale-[1.02]`
                                    : `${theme.buttonPrimary} hover:scale-[1.02]`
                           }`}
                        >
                           {processingId === plan.id 
                              ? '处理中...' 
                              : isCurrent 
                                 ? '当前方案' 
                                 : (
                                    <>
                                       立即升级 <ArrowRight className="w-4 h-4" />
                                    </>
                                 )
                           }
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* --- COMPARISON TABLE --- */}
      <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${isCreatorView ? 'border-slate-200' : 'border-slate-800'}`}>
         <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${theme.textPrimary}`}>
               {isCreatorView ? '全方位权益对比' : '企业级功能详细对比'}
            </h2>
            <p className={theme.textSecondary}>详细了解每个方案包含的具体服务与特权</p>
         </div>
         
         <div className={`overflow-x-auto rounded-3xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm`}>
            <table className="w-full text-sm min-w-[800px]">
               <thead>
                  <tr className={`${isCreatorView ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'} border-b`}>
                     <th className={`p-6 text-left font-bold pl-8 w-1/3 ${theme.textSecondary}`}>功能权益</th>
                     <th className={`p-6 text-center font-bold w-1/5 ${theme.textPrimary}`}>基础版</th>
                     <th className={`p-6 text-center font-bold w-1/5 ${theme.accent}`}>
                        {isCreatorView ? '专业版 Pro' : '企业版 Pro'}
                        <span className="block text-[10px] font-normal opacity-70 mt-1">推荐选择</span>
                     </th>
                     <th className="p-6 text-center font-bold w-1/5 text-amber-500">
                        {isCreatorView ? '旗舰版 Max' : '集团版 Max'}
                     </th>
                  </tr>
               </thead>
               <tbody className={`divide-y ${isCreatorView ? 'divide-slate-100' : 'divide-slate-700'}`}>
                  {comparisonData.map((group) => (
                     <React.Fragment key={group.title}>
                        <tr className={`${isCreatorView ? 'bg-slate-50/50' : 'bg-slate-800/50'}`}>
                           <td colSpan={4} className={`px-8 py-4 text-xs font-bold uppercase tracking-wider ${theme.textSecondary}`}>
                              {group.title}
                           </td>
                        </tr>
                        {group.features.map((item, idx) => (
                           <tr key={idx} className={`group transition-colors ${isCreatorView ? 'hover:bg-slate-50' : 'hover:bg-slate-700/30'}`}>
                              <td className={`px-8 py-5 font-medium ${theme.textPrimary}`}>{item.name}</td>
                              <td className={`px-4 py-5 text-center ${theme.textSecondary}`}>
                                 {typeof item.none === 'boolean' ? (item.none ? <Check className="w-5 h-5 mx-auto text-slate-400"/> : <Minus className="w-4 h-4 mx-auto opacity-30"/>) : item.none}
                              </td>
                              <td className={`px-4 py-5 text-center font-bold ${theme.accentLight}`}>
                                 <div className={theme.accent}>
                                    {typeof item.pro === 'boolean' ? (item.pro ? <CheckCircle2 className="w-5 h-5 mx-auto fill-current"/> : <Minus className="w-4 h-4 mx-auto opacity-30"/>) : item.pro}
                                 </div>
                              </td>
                              <td className="px-4 py-5 text-center font-bold text-amber-500">
                                 {typeof item.max === 'boolean' ? (item.max ? <Gem className="w-5 h-5 mx-auto fill-current"/> : <Minus className="w-4 h-4 mx-auto opacity-30"/>) : item.max}
                              </td>
                           </tr>
                        ))}
                     </React.Fragment>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- FAQ --- */}
      <div className="max-w-3xl mx-auto px-6 py-20">
         <h2 className={`text-3xl font-bold text-center mb-12 ${theme.textPrimary}`}>常见问题</h2>
         <div className="space-y-4">
            {faqList.map((item, i) => (
               <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedFaq === i ? theme.highlightBorder : theme.cardBorder} ${theme.cardBg}`}>
                  <button 
                     onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                     className={`w-full flex items-center justify-between p-6 text-left font-bold transition-colors ${theme.textPrimary} ${isCreatorView ? 'hover:bg-slate-50' : 'hover:bg-slate-700/50'}`}
                  >
                     <span className="flex items-center gap-4 text-lg">
                        <HelpCircle className={`w-5 h-5 ${expandedFaq === i ? theme.accent : theme.textSecondary}`} />
                        {item.q}
                     </span>
                     <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedFaq === i ? 'rotate-180' : 'text-slate-400'}`} />
                  </button>
                  <div 
                     className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                     }`}
                  >
                     <div className={`px-6 pb-6 pt-0 text-sm leading-relaxed ml-9 ${theme.textSecondary}`}>
                        {item.a}
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="mt-12 text-center">
            <p className={`text-sm ${theme.textSecondary}`}>
               还有其他问题？ <button className={`font-bold hover:underline ${theme.accent}`}>联系客服支持</button>
            </p>
         </div>
      </div>

      {/* --- CTA FOOTER (If not embedded) --- */}
      {!isEmbedded && (
         <div className={`py-24 text-center px-4 relative overflow-hidden ${isCreatorView ? 'bg-slate-900' : 'bg-indigo-900'}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">准备好开启全新旅程了吗？</h2>
               <p className="text-white/60 mb-10 text-lg">
                  {isCreatorView ? '让每一次创作更有价值。' : '构建更高效的创意供应链。'}
               </p>
               <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 mx-auto"
               >
                  <Rocket className="w-5 h-5 text-indigo-600" />
                  立即选择方案
               </button>
            </div>
         </div>
      )}

    </div>
  );
};

export default MembershipPage;
