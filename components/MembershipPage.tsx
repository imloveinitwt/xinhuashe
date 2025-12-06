
import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Crown, HelpCircle, Star, Zap, Shield, X, 
  Minus, Rocket, ChevronDown, CheckCircle2, Layout, Briefcase
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

// Comparison Data
const COMPARISON_GROUPS = [
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
      { name: '专属客户经理', none: false, pro: '优先响应', max: '1对1 专人' },
    ]
  }
];

const FAQ_LIST = [
  { q: '可以随时取消订阅吗？', a: '是的，您可以随时在“账户设置”中取消自动续费。取消后，您当前的权益将保留至本计费周期结束，次一周期不再扣费。' },
  { q: '升级或降级如何计算费用？', a: '升级套餐立即生效，系统将自动计算您当前周期剩余金额并抵扣新套餐费用，您只需支付差价。降级将在当前付费周期结束后生效。' },
  { q: '企业版发票如何开具？', a: '支持开具增值税专用发票或普通电子发票。支付成功后，请前往“财务中心 - 发票管理”提交开票信息，电子发票通常在 1-3 个工作日内发送。' },
  { q: 'AI 辅助创作次数如何计算？', a: '每日额度在凌晨 00:00 重置。未使用完的次数不会累积到下一天。Max 版用户的无限次使用受公平使用原则限制。' }
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
  const currentLevel = user ? (user.membershipLevel || 'none') : 'none';
  const themeColor = activeRole === 'creator' ? 'indigo' : 'blue';

  // Safe color getter for dynamic Tailwind classes to ensure they exist/purge correctly if using JIT
  const getThemeText = () => activeRole === 'creator' ? 'text-indigo-600' : 'text-blue-600';
  const getThemeBg = () => activeRole === 'creator' ? 'bg-indigo-600' : 'bg-blue-600';
  const getThemeBorder = () => activeRole === 'creator' ? 'border-indigo-500' : 'border-blue-500';

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

  return (
    <div className={`bg-slate-50 font-sans min-h-screen relative overflow-x-hidden ${isEmbedded ? '' : 'pt-20'}`}>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in shadow-2xl relative">
              <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">升级成功！</h3>
              <p className="text-slate-500 mb-8">
                您的 <span className="font-bold text-slate-800">{activeRole === 'creator' ? '创作者' : '企业'} VIP</span> 权益已即时生效。
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                开始使用
              </button>
           </div>
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="relative bg-white border-b border-slate-200">
         {!isEmbedded && (
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 md:left-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors font-medium text-sm z-10"
            >
              <ArrowLeft className="w-4 h-4" /> 返回
            </button>
         )}

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
               升级您的<span className={`${getThemeText()}`}>创作引擎</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
               {activeRole === 'creator' 
                 ? '加入数万名 Pro 创作者，享受更低费率、更高流量曝光与专属 AI 工具。' 
                 : '为团队赋能，解锁企业级资产管理、合规发票与专属项目经理支持。'}
            </p>

            {/* Controls Container */}
            <div className="flex flex-col items-center gap-6">
               
               {/* Role Switcher */}
               <div className="inline-flex p-1.5 bg-slate-100 rounded-full relative">
                  {/* Sliding Background */}
                  <div 
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                       activeRole === 'creator' ? 'left-1.5' : 'left-[calc(50%+3px)]'
                    }`}
                  ></div>
                  
                  <button
                    onClick={() => setActiveRole('creator')}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
                       activeRole === 'creator' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                     <Layout className="w-4 h-4" /> 创作者版
                  </button>
                  <button
                    onClick={() => setActiveRole('enterprise')}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
                       activeRole === 'enterprise' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                     <Briefcase className="w-4 h-4" /> 企业版
                  </button>
               </div>

               {/* Billing Switcher */}
               <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>按月付费</span>
                  <button 
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${billingCycle === 'yearly' ? getThemeBg() : 'bg-slate-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></div>
                  </button>
                  <span className={`text-sm font-bold flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                    按年付费
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-amber-200">
                      省 20%
                    </span>
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* --- PRICING CARDS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => {
               const isCurrent = currentLevel === plan.id;
               const isRec = plan.recommended;
               const finalPrice = calculatePrice(plan.price);

               return (
                  <div 
                    key={plan.id} 
                    className={`relative flex flex-col bg-white rounded-[2rem] transition-all duration-300 ${
                       isRec 
                         ? `border-2 ${getThemeBorder()} shadow-xl scale-105 z-10` 
                         : 'border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                     {isRec && (
                        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${getThemeBg()} text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1`}>
                           <Star className="w-3 h-3 fill-current" /> 最受欢迎
                        </div>
                     )}

                     <div className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                           {plan.id === 'max' && <Crown className="w-6 h-6 text-amber-500 fill-current" />}
                           {plan.id === 'pro' && <Zap className="w-6 h-6 text-indigo-500 fill-current" />}
                           {plan.id === 'none' && <Shield className="w-6 h-6 text-slate-400" />}
                        </div>
                        
                        <div className="mb-6">
                           <span className="text-4xl font-extrabold text-slate-900">¥{finalPrice}</span>
                           {plan.price > 0 && <span className="text-slate-500 font-medium text-sm">/{billingCycle === 'yearly' ? '年' : '月'}</span>}
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed border-b border-slate-100 pb-6 min-h-[80px]">
                           {plan.id === 'none' && '适合刚开始探索的个人创作者，提供基础接单与展示功能。'}
                           {plan.id === 'pro' && '适合职业自由画师，提供更低的费率、更多的曝光和 AI 辅助工具。'}
                           {plan.id === 'max' && '适合工作室或高频交易用户，享受零费率、专属服务和顶级流量支持。'}
                        </p>
                     </div>

                     <div className="p-8 pt-2 flex-1">
                        <ul className="space-y-4">
                           {plan.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                 <Check className={`w-5 h-5 flex-shrink-0 ${plan.id === 'none' ? 'text-slate-400' : getThemeText()}`} />
                                 <span>{feat}</span>
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div className="p-8 pt-0 mt-auto">
                        <button
                           onClick={() => handleSubscribe(plan.id)}
                           disabled={isCurrent || processingId !== null}
                           className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                              isCurrent
                                 ? 'bg-slate-100 text-slate-400 cursor-default'
                                 : isRec
                                    ? `${getThemeBg()} text-white hover:opacity-90 shadow-lg`
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                           }`}
                        >
                           {processingId === plan.id ? '处理中...' : isCurrent ? '当前方案' : '立即升级'}
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* --- COMPARISON TABLE --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
         <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">权益全景对比</h2>
         
         <div className="overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                     <th className="p-5 text-left text-slate-500 font-medium pl-8">功能权益</th>
                     <th className="p-5 text-center text-slate-900 font-bold w-1/5">基础版</th>
                     <th className={`p-5 text-center ${getThemeText()} font-bold w-1/5`}>专业版 Pro</th>
                     <th className="p-5 text-center text-amber-600 font-bold w-1/5">旗舰版 Max</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {COMPARISON_GROUPS.map((group) => (
                     <React.Fragment key={group.title}>
                        <tr className="bg-slate-50/50">
                           <td colSpan={4} className="px-8 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              {group.title}
                           </td>
                        </tr>
                        {group.features.map((item, idx) => (
                           <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-8 py-4 font-medium text-slate-700">{item.name}</td>
                              <td className="px-4 py-4 text-center text-slate-500">
                                 {typeof item.none === 'boolean' ? (item.none ? <Check className="w-5 h-5 mx-auto text-slate-800"/> : <Minus className="w-4 h-4 mx-auto text-slate-300"/>) : item.none}
                              </td>
                              <td className="px-4 py-4 text-center font-bold text-slate-800 bg-indigo-50/20">
                                 {typeof item.pro === 'boolean' ? (item.pro ? <Check className={`w-5 h-5 mx-auto ${getThemeText()}`}/> : <Minus className="w-4 h-4 mx-auto text-slate-300"/>) : item.pro}
                              </td>
                              <td className="px-4 py-4 text-center font-bold text-slate-800 bg-amber-50/20">
                                 {typeof item.max === 'boolean' ? (item.max ? <Check className="w-5 h-5 mx-auto text-amber-500"/> : <Minus className="w-4 h-4 mx-auto text-slate-300"/>) : item.max}
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
      <div className="max-w-3xl mx-auto px-6 py-16">
         <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">常见问题</h2>
         <div className="space-y-4">
            {FAQ_LIST.map((item, i) => (
               <div key={i} className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
                  <button 
                     onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                     className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                     <span className="flex items-center gap-3">
                        <HelpCircle className={`w-5 h-5 ${expandedFaq === i ? getThemeText() : 'text-slate-400'}`} />
                        {item.q}
                     </span>
                     <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                     className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                     }`}
                  >
                     <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed ml-8">
                        {item.a}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* --- CTA FOOTER (If not embedded) --- */}
      {!isEmbedded && (
         <div className="bg-slate-900 py-20 text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-3xl font-bold text-white mb-6">准备好开启全新旅程了吗？</h2>
               <p className="text-slate-400 mb-8 text-lg">加入数万名专业用户的选择，让创意更有价值。</p>
               <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl flex items-center gap-2 mx-auto"
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
