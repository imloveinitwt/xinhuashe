
import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Crown, HelpCircle
} from 'lucide-react';
import { User, MembershipLevel } from '../types';
import { MEMBERSHIP_PLANS_CREATOR, MEMBERSHIP_PLANS_ENTERPRISE } from '../constants';

interface MembershipPageProps {
  onBack: () => void;
  user: User | null;
  onUpgrade: (level: MembershipLevel) => void;
  onTriggerLogin: () => void;
}

const MembershipPage: React.FC<MembershipPageProps> = ({ onBack, user, onUpgrade, onTriggerLogin }) => {
  const [activeTab, setActiveTab] = useState<'creator' | 'enterprise'>(
    user?.role === 'enterprise' ? 'enterprise' : 'creator'
  );
  
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-20 pb-20 relative">
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-amber-600"></div>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                 <Crown className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">升级成功！</h3>
              <p className="text-slate-600 mb-6">您已成功升级至尊贵会员，即刻享受专属特权。</p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                立即体验
              </button>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 text-white pt-16 pb-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <button 
              onClick={onBack}
              className="absolute top-0 left-4 md:left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回
            </button>
            
            <div className="text-center max-w-3xl mx-auto mt-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-yellow-400 text-xs font-bold mb-6 backdrop-blur-md">
                  <Crown className="w-3 h-3 fill-current" /> 薪画社会员中心
               </div>
               <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                  解锁专业能力，<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                    让创意价值最大化
                  </span>
               </h1>
               <p className="text-lg text-slate-300">
                  为创作者提供更低的费率与更多的曝光，为企业提供更高效的管理工具与合规保障。
               </p>
            </div>

            {/* Toggle */}
            <div className="flex justify-center mt-10">
               <div className="bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10 flex">
                  <button
                    onClick={() => setActiveTab('creator')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      activeTab === 'creator' 
                        ? 'bg-white text-slate-900 shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    我是创作者
                  </button>
                  <button
                    onClick={() => setActiveTab('enterprise')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      activeTab === 'enterprise' 
                        ? 'bg-white text-slate-900 shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    我是企业主
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => {
               const isCurrent = currentLevel === plan.id;
               const isRecommended = plan.recommended;
               
               return (
                 <div 
                   key={plan.id}
                   className={`relative bg-white rounded-2xl flex flex-col transition-all duration-300 ${
                     isRecommended 
                       ? 'border-2 border-indigo-500 shadow-2xl scale-105 z-10' 
                       : 'border border-slate-200 shadow-lg hover:shadow-xl'
                   }`}
                 >
                    {isRecommended && (
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
                          最受欢迎
                       </div>
                    )}
                    
                    <div className="p-8 border-b border-slate-100">
                       <h3 className={`text-lg font-bold mb-2 ${
                          plan.id === 'max' ? 'text-amber-600' : 
                          plan.id === 'pro' ? 'text-indigo-600' : 'text-slate-800'
                       }`}>
                          {plan.name}
                       </h3>
                       <div className="flex items-end gap-1 mb-4">
                          <span className="text-4xl font-extrabold text-slate-900">¥{plan.price}</span>
                          <span className="text-slate-500 text-sm font-medium mb-1">/ 月</span>
                       </div>
                       <p className="text-sm text-slate-500 h-10">
                          {plan.id === 'none' ? '基础功能，适合初学者体验。' : 
                           plan.id === 'pro' ? '提升效率与收益的最佳选择。' : 
                           '全方位尊享服务，适合专业团队。'}
                       </p>
                    </div>

                    <div className="p-8 flex-1">
                       <ul className="space-y-4">
                          {plan.features.map((feature, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                <div className={`mt-0.5 rounded-full p-0.5 ${plan.id === 'none' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'}`}>
                                   <Check className="w-3 h-3" />
                                </div>
                                <span className="flex-1">{feature}</span>
                             </li>
                          ))}
                       </ul>
                    </div>

                    <div className="p-8 pt-0 mt-auto">
                       <button
                         onClick={() => handleSubscribe(plan.id)}
                         disabled={isCurrent || processingId !== null}
                         className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                            isCurrent 
                              ? 'bg-slate-100 text-slate-400 cursor-default' 
                              : isRecommended
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                         }`}
                       >
                          {processingId === plan.id ? (
                             <span className="animate-pulse">处理中...</span>
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

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 mt-24">
         <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">常见问题</h2>
         <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  可以随时取消订阅吗？
               </h4>
               <p className="text-slate-600 text-sm">
                  是的，您可以随时在账户设置中取消自动续费。当前权益将保留至本计费周期结束。
               </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  不同等级之间可以切换吗？
               </h4>
               <p className="text-slate-600 text-sm">
                  支持随时升级。升级时需补足差价，新权益立即生效。降级将在当前周期结束后生效。
               </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  企业版发票如何开具？
               </h4>
               <p className="text-slate-600 text-sm">
                  企业版订阅费用支持开具增值税专用发票。支付成功后，请在“财务中心-发票管理”中提交开票信息。
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default MembershipPage;
