
import React from 'react';
import { ArrowLeft, Shield, Zap, TrendingUp, AlertCircle, CheckCircle, HelpCircle, Activity, Award, Check } from 'lucide-react';
import { User } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CreditScorePageProps {
  onBack: () => void;
  user: User | null;
}

const CREDIT_DIMENSIONS = [
  { subject: '身份特质', A: 85, fullMark: 100 },
  { subject: '履约能力', A: 92, fullMark: 100 },
  { subject: '行为积累', A: 78, fullMark: 100 },
  { subject: '资产证明', A: 65, fullMark: 100 },
  { subject: '合规历史', A: 98, fullMark: 100 },
];

const CREDIT_LEVELS = [
  { level: 'AAA', min: 800, title: '极好', privileges: ['0% 提现手续费', '极速审核通道', '首页优先推荐', '专属客服经理'] },
  { level: 'AA', min: 700, title: '优秀', privileges: ['提现手续费 5折', '优先审核通道', '加V认证标识'] },
  { level: 'A', min: 600, title: '良好', privileges: ['正常接单/发布', '基础额度提现', '标准客服支持'] },
  { level: 'B', min: 500, title: '中等', privileges: ['每日接单限制', '提现T+3到账'] },
  { level: 'C', min: 350, title: '一般', privileges: ['需缴纳保证金', '提现人工审核'] },
];

const CreditScorePage: React.FC<CreditScorePageProps> = ({ onBack, user }) => {
  const currentScore = user?.creditScore || 700; // Default or User Score
  
  // Calculate level based on score
  const currentLevelInfo = CREDIT_LEVELS.find(l => currentScore >= l.min) || CREDIT_LEVELS[CREDIT_LEVELS.length - 1];
  
  // Helper to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-500';
    if (score >= 700) return 'text-indigo-500';
    if (score >= 600) return 'text-blue-500';
    return 'text-amber-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 800) return 'bg-green-500';
    if (score >= 700) return 'bg-indigo-500';
    if (score >= 600) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-20">
      
      {/* Header Background */}
      <div className="bg-slate-900 absolute top-0 left-0 w-full h-[400px] z-0 overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl -mr-40 -mt-40"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 返回工作台
        </button>

        {/* Hero Section: Score & Radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           
           {/* Left: Score Card */}
           <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              <h2 className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-6">薪画社信用分</h2>
              
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                 {/* Decorative Rings */}
                 <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                 <div className="absolute inset-2 rounded-full border-4 border-dashed border-white/20 animate-spin-slow" style={{ animationDuration: '20s' }}></div>
                 
                 {/* Score Value */}
                 <div className="text-center z-10">
                    <div className={`text-6xl font-extrabold text-white mb-1 drop-shadow-lg`}>
                       {currentScore}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getScoreBg(currentScore)} text-white`}>
                       {currentLevelInfo.title}等级
                    </div>
                 </div>
              </div>

              <p className="text-indigo-100 text-sm max-w-xs mx-auto mb-6">
                 评估时间：{new Date().toLocaleDateString()}
                 <br/>
                 您的信用状况优于 85% 的用户
              </p>

              <button className="bg-white text-indigo-900 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                 查看详细报告
              </button>
           </div>

           {/* Right: Radar Chart & Explanation */}
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" /> 五维信用模型
                 </h3>
                 <button className="text-slate-400 hover:text-indigo-600"><HelpCircle className="w-5 h-5" /></button>
              </div>
              
              <div className="flex-1 flex items-center justify-center -ml-4">
                 <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={CREDIT_DIMENSIONS}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                          <Radar
                             name="MyScore"
                             dataKey="A"
                             stroke="#6366f1"
                             strokeWidth={2}
                             fill="#6366f1"
                             fillOpacity={0.2}
                          />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>履约能力：优秀</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>合规历史：无违规</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Privilege Levels */}
        <div className="mb-12">
           <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" /> 等级权益一览
           </h3>
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                          <th className="p-4 w-24">等级</th>
                          <th className="p-4 w-32">分值区间</th>
                          <th className="p-4">核心特权</th>
                          <th className="p-4 w-24 text-center">当前状态</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {CREDIT_LEVELS.map((lvl) => {
                          const isActive = currentLevelInfo.level === lvl.level;
                          return (
                             <tr key={lvl.level} className={`transition-colors ${isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                                <td className="p-4">
                                   <span className={`font-bold text-lg ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
                                      {lvl.level}
                                   </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                   {lvl.min}+
                                </td>
                                <td className="p-4">
                                   <div className="flex flex-wrap gap-2">
                                      {lvl.privileges.map((p, i) => (
                                         <span key={i} className={`text-xs px-2 py-1 rounded border ${
                                            isActive 
                                               ? 'bg-white border-indigo-200 text-indigo-700' 
                                               : 'bg-slate-50 border-slate-200 text-slate-600'
                                         }`}>
                                            {p}
                                         </span>
                                      ))}
                                   </div>
                                </td>
                                <td className="p-4 text-center">
                                   {isActive && (
                                      <div className="inline-flex items-center gap-1 text-indigo-600 font-bold text-sm bg-indigo-100 px-3 py-1 rounded-full">
                                         <Check className="w-4 h-4" /> 当前
                                      </div>
                                   )}
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Improvement Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                 <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">完善实名认证</h4>
              <p className="text-sm text-slate-500 mb-4">
                 上传企业营业执照或个人高级身份认证，可大幅提升“身份特质”分数。
              </p>
              <button className="text-sm font-bold text-blue-600 hover:underline">去认证 &rarr;</button>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                 <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">保持良好履约</h4>
              <p className="text-sm text-slate-500 mb-4">
                 按时交付项目，避免退款与纠纷。连续10单无纠纷将触发额外加分。
              </p>
              <button className="text-sm font-bold text-green-600 hover:underline">查看订单 &rarr;</button>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                 <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">增加资产沉淀</h4>
              <p className="text-sm text-slate-500 mb-4">
                 在 DAM 中上传更多优质资产，或增加账户余额流水，提升“资产证明”维度。
              </p>
              <button className="text-sm font-bold text-purple-600 hover:underline">上传资产 &rarr;</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CreditScorePage;
