
import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Crown, HelpCircle, Star, Zap, Shield, Sparkles, X, 
  Minus, Gem, Rocket, ChevronDown, CheckCircle2
} from 'lucide-react';
import { User, MembershipLevel } from '../types';
import { MEMBERSHIP_PLANS_CREATOR, MEMBERSHIP_PLANS_ENTERPRISE } from '../constants';

interface MembershipPageProps {
  onBack: () => void;
  user: User | null;
  onUpgrade: (level: MembershipLevel) => void;
  onTriggerLogin: () => void;
  isEmbedded?: boolean; // Control layout for embedded view (e.g. inside workspace)
}

// Grouped Comparison Data for better readability
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

const MembershipPage: React.FC<MembershipPageProps> = ({ onBack, user, onUpgrade, onTriggerLogin, isEmbedded = false }) => {
  const [activeTab, setActiveTab] = useState<'creator' | 'enterprise'>(
    user?.role === 'enterprise' ? 'enterprise' : 'creator'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const plans = activeTab === 'creator' ? MEMBERSHIP_PLANS_CREATOR : MEMBERSHIP_PLANS_ENTERPRISE;
  
  const currentLevel = user ? (user.membershipLevel || 'none') : 'none';

  const handleSubscribe = (planId: MembershipLevel) => {
    if (!user) {
      onTriggerLogin();
      return;
    }
    
    setProcessingId(planId);
    
    // Simulate Payment API Latency
    setTimeout(() => {
      onUpgrade(planId);
      setProcessingId(null);
      setShowSuccessModal(true);
    }, 1500);
  };

  const calculatePrice = (monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      return Math.floor(monthlyPrice * 12 * 0.8); // 20% off
    }
    return monthlyPrice;
  };

  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />;
    }
    return <span className="text-slate-700 font-medium">{value}</span>;
  };

  return (
    <div className={`bg-slate-50 font-sans pb-20 relative ${isEmbedded ? 'min-h-full rounded-3xl overflow-hidden' : 'min-h-screen pt-20'}`}>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in relative overflow-hidden shadow-2xl">
              {/* Confetti / Decor */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600 ring-8 ring-amber-50 shadow-inner">
                 <Crown className="w-10 h-10 fill-current animate-heart-pop" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">尊贵身份已激活！</h3>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                您已成功升级为 <span className="font-bold text-slate-800">{activeTab === 'creator' ? '创作者' : '企业'} VIP</span><br/>
                所有专属特权即刻生效。
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                立即体验权益
              </button>
           </div>
        </div>
      )}

      {/* Header Section */}
      <div className={`relative overflow-hidden ${isEmbedded ? 'bg-slate-900 pt-12 pb-24' : 'bg-[#0B0F19] pt-20 pb-32'}`}>
         {/* Dynamic Background */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse" style={{animationDuration: '8s'}}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '10s'}}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {!isEmbedded && (
              <button 
                onClick={onBack}
                className="absolute top-0 left-4 md:left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> 返回
              </button>
            )}
            
            <div className="text-center max-w-3xl mx-auto">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-200/10 to-yellow-400/10 border border-amber-200/20 text-amber-200 text-xs font-bold mb-6 backdrop-blur-md shadow-lg shadow-amber-900/20">
                  <Sparkles className="w-3 h-3 fill-current" /> 薪画社 PRO 会员
               </div>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
                  解锁您的<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
                    无限创意潜能
                  </span>
               </h1>
               <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {activeTab === 'creator' 
                    ? '更低费率，更高曝光，专属 AI 创作工具，助您收入倍增。' 
                    : '企业级资产管理，合规发票，专属项目经理，降本增效首选。'}
               </p>
            </div>

            {/* Role Toggle */}
            <div className="flex justify-center mt-12">
               <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex relative shadow-inner">
                  <button
                    onClick={() => setActiveTab('creator')}
                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      activeTab === 'creator' 
                        ? 'text-slate-900 bg-white shadow-lg' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    创作者版
                  </button>
                  <button
                    onClick={() => setActiveTab('enterprise')}
                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      activeTab === 'enterprise' 
                        ? 'text-slate-900 bg-white shadow-lg' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    企业版
                  </button>
               </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mt-8 items-center gap-4">
               <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>按月付费</span>
               <button 
                 onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                 className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center border border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none ${billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-slate-700'}`}
               >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></div>
               </button>
               <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                 按年付费
                 <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold shadow-lg shadow-orange-900/20">
                   省 20%
                 </span>
               </span>
            </div>
         </div>
      </div>

      {/* Plans Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan) => {
               const isCurrent = currentLevel === plan.id;
               const isRecommended = plan.recommended;
               const price = calculatePrice(plan.price);
               
               return (
                 <div 
                   key={plan.id}
                   className={`relative bg-white rounded-3xl flex flex-col transition-all duration-300 group overflow-hidden ${
                     isRecommended 
                       ? 'border-2 border-indigo-500 shadow-2xl scale-100 md:scale-105 z-10 ring-4 ring-indigo-500/10' 
                       : 'border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 opacity-95 hover:opacity-100'
                   }`}
                 >
                    {isRecommended && (
                       <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    )}
                    {isRecommended && (
                       <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                             <Star className="w-3 h-3 fill-current" /> 推荐
                          </span>
                       </div>
                    )}
                    
                    <div className="p-8 pb-0">
                       <h3 className={`text-xl font-extrabold mb-4 flex items-center gap-2 ${
                          plan.id === 'max' ? 'text-amber-600' : 
                          plan.id === 'pro' ? 'text-indigo-600' : 'text-slate-800'
                       }`}>
                          {plan.id === 'max' && <Crown className="w-6 h-6 fill-current" />}
                          {plan.id === 'pro' && <Zap className="w-6 h-6 fill-current" />}
                          {plan.id === 'none' && <Shield className="w-6 h-6 text-slate-400" />}
                          {plan.name}
                       </h3>
                       
                       <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-5xl font-extrabold text-slate-900 tracking-tight">¥{price}</span>
                          {plan.price > 0 && <span className="text-slate-500 font-medium">/ {billingCycle === 'yearly' ? '年' : '月'}</span>}
                       </div>
                       
                       <div className="h-6 mb-6">
                          {billingCycle === 'yearly' && plan.price > 0 && (
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                 已节省 ¥{Math.floor(plan.price * 12 - price)}
                              </span>
                          )}
                       </div>

                       <p className="text-sm text-slate-500 leading-relaxed mb-8 border-b border-slate-100 pb-8 min-h-[80px]">
                          {plan.id === 'none' ? '零成本开启创作之旅，适合新手体验平台基础功能。' : 
                           plan.id === 'pro' ? '解锁高级工具与流量扶持，适合追求成长的专业创作者。' : 
                           '全方位尊享特权与定制服务，适合工作室与高频交易用户。'}
                       </p>
                    </div>

                    <div className="p-8 pt-0 flex-1">
                       <ul className="space-y-4 mb-8">
                          {plan.features.map((feature, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${plan.id === 'none' ? 'bg-slate-100 text-slate-400' : 'bg-green-100 text-green-600'}`}>
                                   <Check className="w-3 h-3" />
                                </div>
                                <span className="font-medium">{feature}</span>
                             </li>
                          ))}
                       </ul>
                    </div>

                    <div className="p-8 pt-0 mt-auto">
                       <button
                         onClick={() => handleSubscribe(plan.id)}
                         disabled={isCurrent || processingId !== null}
                         className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                            isCurrent 
                              ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200' 
                              : isRecommended
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-1'
                                : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-1 shadow-md'
                         }`}
                       >
                          {processingId === plan.id ? (
                             <span className="animate-pulse flex items-center gap-2">
                               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                               处理中...
                             </span>
                          ) : isCurrent ? (
                             <>当前方案</>
                          ) : (
                             <>立即升级</>
                          )}
                       </button>
                    </div>
                 </div>
               );
            })}
         </div>
      </div>

      {/* Enhanced Comparison Table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">全维度权益对比</h2>
            <p className="text-slate-500">详细对比，助您做出明智选择</p>
         </div>
         
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead>
                     <tr className="bg-slate-50/80 backdrop-blur border-b border-slate-200">
                        <th className="p-6 w-1/3 font-bold text-slate-900 text-lg min-w-[200px]">功能权益</th>
                        <th className="p-6 w-1/5 text-center text-slate-600 font-bold min-w-[120px]">基础版</th>
                        <th className="p-6 w-1/5 text-center text-indigo-600 font-bold text-lg min-w-[120px] bg-indigo-50/30">专业版 Pro</th>
                        <th className="p-6 w-1/5 text-center text-amber-600 font-bold text-lg min-w-[120px] bg-amber-50/30">旗舰版 Max</th>
                     </tr>
                  </thead>
                  <tbody>
                     {COMPARISON_GROUPS.map((group, groupIdx) => (
                        <React.Fragment key={group.title}>
                           <tr className="bg-slate-50/50">
                              <td colSpan={4} className="px-6 py-3 font-bold text-xs text-slate-400 uppercase tracking-wider border-y border-slate-100">
                                 {group.title}
                              </td>
                           </tr>
                           {group.features.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                                 <td className="px-6 py-4 font-medium text-slate-700 group-hover:text-slate-900">
                                    {item.name}
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    {renderFeatureValue(item.none)}
                                 </td>
                                 <td className="px-6 py-4 text-center bg-indigo-50/10 group-hover:bg-indigo-50/20">
                                    {renderFeatureValue(item.pro)}
                                 </td>
                                 <td className="px-6 py-4 text-center bg-amber-50/10 group-hover:bg-amber-50/20">
                                    {renderFeatureValue(item.max)}
                                 </td>
                              </tr>
                           ))}
                        </React.Fragment>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-6 mt-24">
         <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">常见问题解答</h2>
         <div className="space-y-4">
            {[
               { q: '可以随时取消订阅吗？', a: '是的，您可以随时在“账户设置”中取消自动续费。取消后，您当前的权益将保留至本计费周期结束，次一周期不再扣费。' },
               { q: '升级或降级如何计算费用？', a: '升级套餐立即生效，系统将自动计算您当前周期剩余金额并抵扣新套餐费用，您只需支付差价。降级将在当前付费周期结束后生效。' },
               { q: '企业版发票如何开具？', a: '支持开具增值税专用发票或普通电子发票。支付成功后，请前往“财务中心 - 发票管理”提交开票信息，电子发票通常在 1-3 个工作日内发送。' },
               { q: 'AI 辅助创作次数如何计算？', a: '每日额度在凌晨 00:00 重置。未使用完的次数不会累积到下一天。Max 版用户的无限次使用受公平使用原则限制。' }
            ].map((faq, index) => (
               <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-indigo-200 hover:shadow-sm">
                  <button 
                     onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                     className="w-full flex items-center justify-between p-6 text-left"
                  >
                     <h4 className="font-bold text-slate-800 flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-indigo-500" />
                        {faq.q}
                     </h4>
                     <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaqIndex === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 pb-6 pt-0 text-slate-600 text-sm leading-relaxed ml-8 border-l-2 border-indigo-100 pl-4">
                        {faq.a}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* CTA Footer (only if not embedded) */}
      {!isEmbedded && (
         <div className="mt-24 bg-slate-900 py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="max-w-4xl mx-auto px-6 relative z-10">
               <h2 className="text-3xl font-bold text-white mb-6">准备好提升您的创作事业了吗？</h2>
               <p className="text-slate-400 mb-8 max-w-xl mx-auto">加入数万名 Pro 会员，享受更高效的工具与更丰厚的回报。</p>
               <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg inline-flex items-center gap-2"
               >
                  <Rocket className="w-5 h-5 text-indigo-600" />
                  立即开启 Pro 之旅
               </button>
            </div>
         </div>
      )}

    </div>
  );
};

export default MembershipPage;
