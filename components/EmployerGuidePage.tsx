
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, Search, Send, DollarSign, 
  ShieldCheck, ThumbsUp, ChevronRight, Briefcase, Check, 
  AlertCircle, UploadCloud, ChevronDown
} from 'lucide-react';

interface EmployerGuidePageProps {
  onBack: () => void;
  onTriggerUpload?: () => void;
}

const SECTIONS = [
  { id: 'prep', title: '需求准备', icon: FileText },
  { id: 'post', title: '发布企划', icon: Send },
  { id: 'select', title: '选人合作', icon: Search },
  { id: 'fund', title: '资金托管', icon: DollarSign },
  { id: 'accept', title: '验收评价', icon: ThumbsUp },
];

const EmployerGuidePage: React.FC<EmployerGuidePageProps> = ({ onBack, onTriggerUpload }) => {
  const [activeSection, setActiveSection] = useState('prep');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pt-20 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Hero */}
        <div className="mb-16 border-b border-slate-100 pb-10">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回首页
            </button>
            
            {onTriggerUpload && (
              <button 
                onClick={onTriggerUpload}
                className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
              >
                <UploadCloud className="w-4 h-4" /> 立即发布需求
              </button>
            )}
          </div>

          <div className="max-w-4xl">
             <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
               企划方<span className="text-indigo-600">发约指南</span>
             </h1>
             <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
               标准化您的外包工作流。从需求梳理到作品验收，掌握这5个关键步骤，助您高效匹配优质创意人才，规避交易风险。
             </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Sticky Sidebar Navigation */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
             <div className="sticky top-24">
                <nav className="space-y-1 relative border-l border-slate-200 ml-4">
                   {SECTIONS.map((section, idx) => (
                     <button
                       key={section.id}
                       onClick={() => scrollToSection(section.id)}
                       className={`group flex items-center justify-between w-full pl-6 py-3 text-sm font-bold transition-all relative ${
                         activeSection === section.id 
                           ? 'text-indigo-600' 
                           : 'text-slate-400 hover:text-slate-600'
                       }`}
                     >
                       {/* Active Indicator */}
                       {activeSection === section.id && (
                         <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-indigo-600"></div>
                       )}
                       
                       <span className="flex items-center gap-3">
                         <span className="font-mono text-xs opacity-50">0{idx + 1}</span>
                         {section.title}
                       </span>
                       {activeSection === section.id && <ChevronRight className="w-4 h-4 animate-slide-in-right" />}
                     </button>
                   ))}
                </nav>
                
                <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <h4 className="font-bold text-slate-900 mb-2 text-sm">遇到问题？</h4>
                   <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                     如需帮助，请联系专属客服或查阅帮助中心文档。
                   </p>
                   <button className="text-xs font-bold text-indigo-600 hover:underline">联系客服 &rarr;</button>
                </div>
             </div>
          </div>

          {/* Right: Content Area */}
          <div className="flex-1 space-y-24 max-w-4xl">
             
             {/* Section 1: Preparation */}
             <section id="prep" className="scroll-mt-32 group">
                <div className="flex items-baseline gap-4 mb-8">
                   <span className="text-6xl font-black text-slate-100 group-hover:text-indigo-50 transition-colors select-none">01</span>
                   <h2 className="text-2xl font-bold text-slate-900">需求准备</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
                         <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-3">身份认证</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                         带有“企业认证”标识的企划通常能多获得 40% 的浏览量。画师更倾向于信任已认证的发布方。
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                         <Check className="w-3 h-3" /> 建议完成实名/企业认证
                      </div>
                   </div>

                   <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-green-600">
                         <DollarSign className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-3">预算规划</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                         合理的预算是吸引优质人才的基础。商用稿件（买断版权）的价格通常是私用稿件的 2-3 倍。建议预留 10%-20% 的浮动预算以应对可能的加购项。
                      </p>
                   </div>
                </div>
             </section>

             {/* Section 2: Post Project */}
             <section id="post" className="scroll-mt-32 group">
                <div className="flex items-baseline gap-4 mb-8">
                   <span className="text-6xl font-black text-slate-100 group-hover:text-blue-50 transition-colors select-none">02</span>
                   <h2 className="text-2xl font-bold text-slate-900">发布企划</h2>
                </div>

                <div className="border border-slate-200 rounded-3xl overflow-hidden">
                   <div className="bg-slate-50 p-6 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900">标准需求结构 (Brief)</h3>
                      <p className="text-sm text-slate-500 mt-1">清晰的需求描述可降低 50% 的沟通成本</p>
                   </div>
                   <div className="divide-y divide-slate-100">
                      <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-24 pt-1">01. 背景</span>
                         <p className="text-sm text-slate-700 leading-relaxed">简述项目用途。例如：“某二次元手游的新角色立绘”、“双11大促活动的C4D主视觉”。</p>
                      </div>
                      <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-24 pt-1">02. 风格</span>
                         <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                            <p>明确画风关键词（如：赛博朋克、日系厚涂、极简扁平）。</p>
                            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg w-fit text-xs font-bold">
                               <AlertCircle className="w-4 h-4" /> 强烈建议上传 1-3 张参考图 (Mood Board)
                            </div>
                         </div>
                      </div>
                      <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-24 pt-1">03. 规格</span>
                         <p className="text-sm text-slate-700 leading-relaxed">尺寸（如 3840x2160）、分辨率（300dpi）、色彩模式（CMYK/RGB）、交付格式（PSD源文件/PNG）。</p>
                      </div>
                      <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-24 pt-1">04. 截止</span>
                         <p className="text-sm text-slate-700 leading-relaxed">明确最终交付时间节点，以及是否接受分阶段（草稿、线稿）交付。</p>
                      </div>
                   </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                   <div className="flex-1 border border-slate-200 p-4 rounded-xl hover:border-indigo-300 cursor-pointer transition-all">
                      <div className="font-bold text-slate-900 mb-1">公开招募</div>
                      <p className="text-xs text-slate-500">所有画师可见。适合需求明确、希望比稿的场景。</p>
                   </div>
                   <div className="flex-1 border border-slate-200 p-4 rounded-xl hover:border-indigo-300 cursor-pointer transition-all">
                      <div className="font-bold text-slate-900 mb-1">定向邀请</div>
                      <p className="text-xs text-slate-500">仅向特定画师发送。适合已锁定意向人选的场景。</p>
                   </div>
                </div>
             </section>

             {/* Section 3: Select */}
             <section id="select" className="scroll-mt-32 group">
                <div className="flex items-baseline gap-4 mb-8">
                   <span className="text-6xl font-black text-slate-100 group-hover:text-indigo-50 transition-colors select-none">03</span>
                   <h2 className="text-2xl font-bold text-slate-900">选人合作</h2>
                </div>
                
                <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                   
                   <h3 className="text-xl font-bold mb-6">筛选画师的三大维度</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                         <div className="h-1 w-12 bg-indigo-400 mb-4 rounded-full"></div>
                         <h4 className="font-bold text-lg mb-2">作品集匹配度</h4>
                         <p className="text-indigo-200 text-sm leading-relaxed">画师过往作品的风格、完成度是否与您的需求一致？这是最直观的判断标准。</p>
                      </div>
                      <div>
                         <div className="h-1 w-12 bg-pink-400 mb-4 rounded-full"></div>
                         <h4 className="font-bold text-lg mb-2">报价合理性</h4>
                         <p className="text-indigo-200 text-sm leading-relaxed">报价是否在预算范围内？警惕过低的报价，可能意味着质量风险或跑单风险。</p>
                      </div>
                      <div>
                         <div className="h-1 w-12 bg-green-400 mb-4 rounded-full"></div>
                         <h4 className="font-bold text-lg mb-2">沟通与排期</h4>
                         <p className="text-indigo-200 text-sm leading-relaxed">建议在合作前简单沟通，确认对方对需求的理解程度以及档期是否匹配。</p>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 4: Fund */}
             <section id="fund" className="scroll-mt-32 group">
                <div className="flex items-baseline gap-4 mb-8">
                   <span className="text-6xl font-black text-slate-100 group-hover:text-green-50 transition-colors select-none">04</span>
                   <h2 className="text-2xl font-bold text-slate-900">资金托管</h2>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                   <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                         <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="font-bold text-xl text-slate-900 mb-1">全额托管，分阶段释放</h3>
                         <p className="text-slate-500 text-sm">
                            确认合作后，您需将资金托管至平台。此时资金并未支付给画师，而是由平台担保。只有在您确认验收节点后，资金才会释放。
                         </p>
                      </div>
                   </div>

                   <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">推荐支付比例</h4>
                   <div className="flex rounded-xl overflow-hidden h-12 text-xs font-bold text-white shadow-sm">
                      <div className="flex-1 bg-slate-400 flex items-center justify-center">草稿 (30%)</div>
                      <div className="flex-1 bg-slate-500 flex items-center justify-center border-l border-white/20">线稿 (30%)</div>
                      <div className="flex-[1.3] bg-slate-800 flex items-center justify-center border-l border-white/20">完稿验收 (40%)</div>
                   </div>
                   <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                      <span>确认大动态与构图</span>
                      <span>确认细节与铺色</span>
                      <span>交付源文件</span>
                   </div>
                </div>
             </section>

             {/* Section 5: Accept */}
             <section id="accept" className="scroll-mt-32 group pb-20">
                <div className="flex items-baseline gap-4 mb-8">
                   <span className="text-6xl font-black text-slate-100 group-hover:text-amber-50 transition-colors select-none">05</span>
                   <h2 className="text-2xl font-bold text-slate-900">验收评价</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h3 className="font-bold text-lg text-slate-900">高效反馈原则</h3>
                      <ul className="space-y-4">
                         <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                            <div>
                               <h4 className="font-bold text-sm text-slate-800 mb-1">汇总修改意见</h4>
                               <p className="text-xs text-slate-500 leading-relaxed">避免“挤牙膏”式反馈，尽量将同一阶段的问题一次性提出。</p>
                            </div>
                         </li>
                         <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                            <div>
                               <h4 className="font-bold text-sm text-slate-800 mb-1">指令具体明确</h4>
                               <p className="text-xs text-slate-500 leading-relaxed">避免“感觉不对”，尝试用“背景压暗”、“表情再开心点”等具体描述。</p>
                            </div>
                         </li>
                      </ul>
                   </div>
                   
                   <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex flex-col justify-center items-center text-center">
                      <ThumbsUp className="w-12 h-12 text-amber-500 mb-4" />
                      <h3 className="font-bold text-lg text-amber-900 mb-2">收货与好评</h3>
                      <p className="text-sm text-amber-800/80 mb-6">
                         收到满意的源文件后，请及时点击“确认验收”。真实的评价不仅是对画师的认可，也是为您积攒良好的甲方信用。
                      </p>
                      {onTriggerUpload && (
                        <button 
                          onClick={onTriggerUpload}
                          className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
                        >
                          开始发布第一个企划
                        </button>
                      )}
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
