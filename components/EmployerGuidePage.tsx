
import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, FileText, 
  Search, Send, DollarSign, BookOpen, 
  MessageSquare, ShieldCheck, ThumbsUp, ChevronRight, Briefcase
} from 'lucide-react';

interface EmployerGuidePageProps {
  onBack: () => void;
}

const SECTIONS = [
  { id: 'prep', title: '一、需求准备', icon: FileText },
  { id: 'post', title: '二、发布企划', icon: Send },
  { id: 'select', title: '三、选人合作', icon: Search },
  { id: 'fund', title: '四、资金托管', icon: DollarSign },
  { id: 'accept', title: '五、验收评价', icon: ThumbsUp },
];

const EmployerGuidePage: React.FC<EmployerGuidePageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('prep');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </button>
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <Briefcase className="w-8 h-8" /> 企划方全流程发约指南
                </h1>
                <p className="text-indigo-100 max-w-2xl text-lg">
                  从需求梳理到作品验收，为您提供标准化的项目管理建议，助您高效匹配优质创意人才，规避交易风险。
                </p>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Sidebar Navigation (Sticky) */}
          <div className="lg:w-64 flex-shrink-0">
             <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                   <h3 className="font-bold text-slate-800">目录导航</h3>
                </div>
                <div className="p-2 space-y-1">
                   {SECTIONS.map((section) => (
                     <button
                       key={section.id}
                       onClick={() => scrollToSection(section.id)}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                         activeSection === section.id 
                           ? 'bg-indigo-50 text-indigo-600' 
                           : 'text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                       {section.title}
                       {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Right: Content Area */}
          <div className="flex-1 space-y-12">
             
             {/* Section 1: Preparation */}
             <section id="prep" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">01</div>
                   需求准备
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-8">
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">认证与预算</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">
                         在发布企划前，明确的预算规划和身份认证是吸引优质画师的关键。
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                               <ShieldCheck className="w-4 h-4 text-indigo-500" /> 企业/个人认证
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                               建议完成实名认证或企业认证。带有“企业认证”标识的企划通常能多获得 40% 的浏览量，画师会认为该需求更靠谱。
                            </p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                               <DollarSign className="w-4 h-4 text-green-500" /> 预算规划
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                               请根据市场行情设定合理预算。过低的预算可能无人问津。如果是商用稿件（买断版权），通常价格是私用稿件的 2-3 倍。
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 2: Post Project */}
             <section id="post" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">02</div>
                   发布企划
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-8">
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">如何撰写清晰的需求？</h3>
                      <p className="text-slate-600 mb-4">
                         需求描述越清晰，沟通成本越低。一个标准的企划应包含以下要素：
                      </p>
                      <div className="space-y-4">
                         <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 text-sm text-slate-700 space-y-3">
                            <p><strong>1. 项目背景：</strong> 简述项目用途（如：手游立绘、小说封面、品牌吉祥物）。</p>
                            <p><strong>2. 风格参考：</strong> 上传 1-3 张参考图（Mood Board），明确想要的画风（如：日系厚涂、赛博朋克、扁平插画）。</p>
                            <p><strong>3. 规格要求：</strong> 尺寸（像素或分辨率）、格式（PSD/PNG）、色彩模式（RGB/CMYK）。</p>
                            <p><strong>4. 截稿日期：</strong> 明确最终交付时间，以及是否接受分阶段交付。</p>
                            <p><strong>5. 试稿说明：</strong> 是否需要试稿？试稿是否有偿？（平台建议有偿试稿）。</p>
                         </div>
                         <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>注意：请勿在需求描述中留下微信/QQ号，以免被系统判定为引流广告而屏蔽。</p>
                         </div>
                      </div>
                   </div>
                   
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">招募模式选择</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="border p-4 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
                            <h4 className="font-bold text-indigo-700 mb-1">公开招募</h4>
                            <p className="text-sm text-slate-600">所有画师均可看见并应征。适合需求明确、希望对比多种风格的企划。</p>
                         </div>
                         <div className="border p-4 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
                            <h4 className="font-bold text-indigo-700 mb-1">定向邀请</h4>
                            <p className="text-sm text-slate-600">仅向特定画师发送邀请。适合已在浏览作品时相中某位画师的情况。</p>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 3: Select & Cooperate */}
             <section id="select" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">03</div>
                   选人合作
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">筛选应征者</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">
                         发布后，您会陆续收到画师的应征方案。关注以下几点：
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                         <li><strong>作品集匹配度：</strong> 画师过往作品风格是否与您的需求一致？</li>
                         <li><strong>报价合理性：</strong> 报价是否在您的预算范围内？过低的报价可能意味着质量风险。</li>
                         <li><strong>排期确认：</strong> 画师的档期是否能满足您的截稿时间？</li>
                      </ul>
                   </div>
                   
                   <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm">
                      <h4 className="font-bold text-indigo-900 mb-2">💡 沟通小贴士</h4>
                      <p className="text-indigo-800">
                         在点击“确认合作”前，建议通过站内信与 2-3 位意向画师简单沟通。
                         询问对方对需求的理解，这能有效判断画师的沟通能力和配合度。
                      </p>
                   </div>
                </div>
             </section>

             {/* Section 4: Fund Escrow */}
             <section id="fund" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">04</div>
                   资金托管
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
                   <div className="flex items-center gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                      <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
                      <div>
                         <h4 className="font-bold text-green-900">安全保障机制</h4>
                         <p className="text-sm text-green-800 mt-1">
                            确认合作后，您需要将项目资金全额托管至平台。<strong>此时资金并未支付给画师</strong>，而是由平台担保。
                            只有在您确认验收节点后，资金才会分阶段释放。
                         </p>
                      </div>
                   </div>
                   
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">分阶段支付推荐</h3>
                      <div className="overflow-hidden rounded-lg border border-slate-200">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 font-bold text-slate-700">
                               <tr>
                                  <th className="p-3">阶段</th>
                                  <th className="p-3">支付比例</th>
                                  <th className="p-3">交付内容</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-600">
                               <tr>
                                  <td className="p-3">草稿阶段</td>
                                  <td className="p-3">30%</td>
                                  <td className="p-3">构图、动态、大致配色</td>
                               </tr>
                               <tr>
                                  <td className="p-3">线稿/色稿</td>
                                  <td className="p-3">30%</td>
                                  <td className="p-3">精细线稿或色稿铺设</td>
                               </tr>
                               <tr>
                                  <td className="p-3">最终完稿</td>
                                  <td className="p-3">40%</td>
                                  <td className="p-3">高清大图、源文件(PSD)</td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 5: Acceptance */}
             <section id="accept" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">05</div>
                   验收评价
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">如何高效反馈修改意见？</h3>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                         <li>
                            <strong>汇总反馈：</strong> 尽量将修改意见汇总一次性提出，避免“挤牙膏”式修改。
                         </li>
                         <li>
                            <strong>具体明确：</strong> 避免使用“感觉不对”、“再大气点”等模糊词汇。
                            尝试用“把背景调暗一点”、“人物表情再开心一点”等具体指令，或直接在图上圈出修改位置（红字反馈）。
                         </li>
                         <li>
                            <strong>尊重专业：</strong> 在审美问题上可以多听取画师的建议。
                         </li>
                      </ul>
                   </div>

                   <div className="border-t border-slate-100 pt-6">
                      <h3 className="font-bold text-lg text-slate-800 mb-3">收货与评价</h3>
                      <p className="text-sm text-slate-600 mb-4">
                         收到满意的源文件后，请及时点击“确认验收”并支付尾款。
                         最后，为画师写一段真实的评价，这不仅是对画师的认可，也是为您自己积攒良好的甲方信用（好评回馈）。
                      </p>
                      <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors">
                         前往发布需求
                      </button>
                   </div>
                </div>
             </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerGuidePage;
