
import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Crown, HelpCircle, Star, Zap, Shield, Sparkles, X
} from 'lucide-react';
import { User, MembershipLevel } from '../types';
import { MEMBERSHIP_PLANS_CREATOR, MEMBERSHIP_PLANS_ENTERPRISE } from '../constants';

interface MembershipPageProps {
  onBack: () => void;
  user: User | null;
  onUpgrade: (level: MembershipLevel) => void;
  onTriggerLogin: () => void;
  isEmbedded?: boolean; // New prop to control layout
}

// Comparison Data
const COMPARISON_FEATURES = [
  { name: '接单服务费率', none: '5%', pro: '3%', max: '0%' },
  { name: '作品展示位', none: '标准', pro: '优先排序', max: '首页推荐' },
  { name: '提现手续费', none: '1%', pro: '0.5%', max: '0元' },
  { name: 'AI 辅助创作', none: '每日 5 次', pro: '无限次', max: '无限次 + 高级模型' },
  { name: '专属客服', none: '工单支持', pro: '优先响应', max: '1对1 经理' },
  { name: '法律合同审核', none: <X className="w-4 h-4 text-slate-300 mx-auto"/>, pro: <X className="w-4 h-4 text-slate-300 mx-auto"/>, max: <Check className="w-4 h-4 text-green-500 mx-auto"/> },
  { name: '数据分析报告', none: '基础', pro: '进阶', max: '全维度' },
];

const MembershipPage: React.FC<MembershipPageProps> = ({ onBack, user, onUpgrade, onTriggerLogin, isEmbedded = false }) => {
  const [activeTab, setActiveTab] = useState<'creator' | 'enterprise'>(
    user?.role === 'enterprise' ? 'enterprise' : 'creator'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const plans = activeTab === 'creator' ? MEMBERSHIP_PLANS_CREATOR : MEMBERSHIP_PLANS_ENTERPRISE;
  
  const currentLevel = user ? (user.membershipLevel || 'none') : 'none';

  const handleSubscribe = (planId: MembershipLevel) => {
    if (!user) {
      onTriggerLogin();
      return;
    }
    
    setProcessingId(planId);
    
    // Simulate Payment API
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

  return (
    <div className={`bg-slate-50 font-sans pb-20 relative ${isEmbedded ? 'min-h-full' : 'min-h-screen pt-20'}`}>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-amber-600"></div>
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 ring-8 ring-yellow-50/50">
                 <Crown className="w-10 h-10 fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">升级成功！</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                尊贵的 <span className="font-bold text-slate-800">{activeTab === 'creator' ? '创作者' : '企业'}会员</span><br/>
                您已解锁全部专属权益。
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
              >
                立即体验权益
              </button>
           </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-slate-900 text-white relative overflow-hidden ${isEmbedded ? 'rounded-b-3xl pt-10 pb-24' : 'pt-16 pb-32'}`}>
         {/* Background Effects */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse" style={{animationDuration: '4s'}}></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none animate-pulse" style={{animationDuration: '6s'}}></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {!isEmbedded && (
              <button 
                onClick={onBack}
                className="absolute top-0 left-4 md:left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> 返回
              </button>
            )}
            
            <div className="text-center max-w-3xl mx-auto mt-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold mb-6 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 fill-current" /> 薪画社 Pro 会员
               </div>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                  升级您的<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-400">
                    创意生产力
                  </span>
               </h1>
               <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  {activeTab === 'creator' 
                    ? '更低的服务费率，更多的曝光机会，助您收入倍增。' 
                    : '企业级资产管理与合规保障，降本增效的最佳选择。'}
               </p>
            </div>

            {/* Role Toggle */}
            <div className="flex justify-center mt-10">
               <div className="bg-slate-800/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex relative">
                  <button
                    onClick={() => setActiveTab('creator')}
                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      activeTab === 'creator' 
                        ? 'text-slate-900 bg-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    创作者版
                  </button>
                  <button
                    onClick={() => setActiveTab('enterprise')}
                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      activeTab === 'enterprise' 
                        ? 'text-slate-900 bg-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    企业版
                  </button>
               </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mt-6 items-center gap-3">
               <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>按月付费</span>
               <button 
                 onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                 className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${billingCycle === 'yearly' ? 'bg-indigo-500' : 'bg-slate-600'}`}
               >
                 <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`}></div>
               </button>
               <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                 按年付费
                 <span className="bg-amber-500 text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                   省 20%
                 </span>
               </span>
            </div>
         </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => {
               const isCurrent = currentLevel === plan.id;
               const isRecommended = plan.recommended;
               const price = calculatePrice(plan.price);
               
               return (
                 <div 
                   key={plan.id}
                   className={`relative bg-white rounded-2xl flex flex-col transition-all duration-300 group ${
                     isRecommended 
                       ? 'border-2 border-indigo-500 shadow-2xl scale-105 z-10 ring-4 ring-indigo-500/10' 
                       : 'border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1'
                   }`}
                 >
                    {isRecommended && (
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> 最受欢迎
                       </div>
                    )}
                    
                    <div className={`p-8 border-b border-slate-100 ${isRecommended ? 'bg-indigo-50/30' : ''} rounded-t-2xl`}>
                       <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                          plan.id === 'max' ? 'text-amber-600' : 
                          plan.id === 'pro' ? 'text-indigo-600' : 'text-slate-800'
                       }`}>
                          {plan.id === 'max' && <Crown className="w-5 h-5 fill-current" />}
                          {plan.id === 'pro' && <Zap className="w-5 h-5 fill-current" />}
                          {plan.name}
                       </h3>
                       <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-4xl font-extrabold text-slate-900 tracking-tight">¥{price}</span>
                          <span className="text-slate-500 text-sm font-medium">/ {billingCycle === 'yearly' ? '年' : '月'}</span>
                       </div>
                       {billingCycle === 'yearly' && plan.price > 0 && (
                          <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded inline-block mb-4">
                             已节省 ¥{Math.floor(plan.price * 12 - price)}
                          </div>
                       )}
                       <p className="text-sm text-slate-500 leading-relaxed h-10">
                          {plan.id === 'none' ? '基础功能，适合初学者体验社区氛围。' : 
                           plan.id === 'pro' ? '提升接单效率与收益的最佳性价比选择。' : 
                           '全方位尊享服务，适合专业团队与高频交易。'}
                       </p>
                    </div>

                    <div className="p-8 flex-1">
                       <ul className="space-y-4">
                          {plan.features.map((feature, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${plan.id === 'none' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'}`}>
                                   <Check className="w-3 h-3" />
                                </div>
                                <span className="flex-1 leading-snug">{feature}</span>
                             </li>
                          ))}
                       </ul>
                    </div>

                    <div className="p-8 pt-0 mt-auto">
                       <button
                         onClick={() => handleSubscribe(plan.id)}
                         disabled={isCurrent || processingId !== null}
                         className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                            isCurrent 
                              ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200' 
                              : isRecommended
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5'
                                : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 shadow-md'
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

      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
         <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">权益详细对比</h2>
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4 w-1/4">功能权益</th>
                        <th className="px-6 py-4 w-1/4 text-center text-slate-500">基础版</th>
                        <th className="px-6 py-4 w-1/4 text-center text-indigo-600">专业版 Pro</th>
                        <th className="px-6 py-4 w-1/4 text-center text-amber-600">旗舰版 Max</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {COMPARISON_FEATURES.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4 font-medium text-slate-700">{item.name}</td>
                           <td className="px-6 py-4 text-center text-slate-500">{item.none}</td>
                           <td className="px-6 py-4 text-center font-bold text-indigo-900 bg-indigo-50/10">{item.pro}</td>
                           <td className="px-6 py-4 text-center font-bold text-amber-900 bg-amber-50/10">{item.max}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 mt-20">
         <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">常见问题</h2>
         <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  可以随时取消订阅吗？
               </h4>
               <p className="text-slate-600 text-sm leading-relaxed">
                  是的，您可以随时在“账户设置”中取消自动续费。取消后，您当前的权益将保留至本计费周期结束，次一周期不再扣费。
               </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  升级或降级如何计算费用？
               </h4>
               <p className="text-slate-600 text-sm leading-relaxed">
                  <strong>升级：</strong>立即生效，系统将计算您当前周期剩余金额并抵扣新套餐费用，您只需支付差价。<br/>
                  <strong>降级：</strong>将在当前付费周期结束后生效，新周期开始时按新套餐扣费。
               </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  企业版发票如何开具？
               </h4>
               <p className="text-slate-600 text-sm leading-relaxed">
                  支持开具增值税专用发票或普通电子发票。支付成功后，请前往“财务中心 - 发票管理”提交开票信息，电子发票通常在 1-3 个工作日内发送至您的邮箱。
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default MembershipPage;
