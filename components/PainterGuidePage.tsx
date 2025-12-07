
import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, FileText, 
  UserCheck, Send, Layers, DollarSign, BookOpen, 
  MessageSquare, ShieldCheck, Download, ChevronRight,
  ArrowRight, ArrowDown, Users, Monitor, PenTool
} from 'lucide-react';

interface PainterGuidePageProps {
  onBack: () => void;
}

const SECTIONS = [
  { id: 'overview', title: '全流程概览', icon: BookOpen },
  { id: 'prep', title: '一、接单准备', icon: UserCheck },
  { id: 'bid', title: '二、参与应征', icon: Send },
  { id: 'create', title: '三、创作流程', icon: Layers },
  { id: 'delivery', title: '四、交付验收', icon: Download },
  { id: 'payment', title: '五、财务安全', icon: DollarSign },
];

const WorkflowDiagram = () => {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[800px] bg-white p-6 rounded-xl border border-slate-200">
        
        {/* Stages Header */}
        <div className="grid grid-cols-3 gap-8 mb-8 border-b border-slate-100 pb-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-indigo-600 italic">01 报名阶段</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Registration Stage</p>
          </div>
          <div className="text-center border-l border-slate-100 border-r">
            <h3 className="text-xl font-bold text-indigo-600 italic">02 设计阶段</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Design Phase</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-indigo-600 italic">03 验收阶段</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Acceptance Stage</p>
          </div>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-[80px_1fr] gap-6 relative">
          
          {/* Roles Column */}
          <div className="flex flex-col justify-around gap-12 py-4">
            <div className="h-16 w-16 bg-indigo-50 rounded-xl flex flex-col items-center justify-center border border-indigo-100 shadow-sm z-10">
              <Users className="w-6 h-6 text-indigo-600 mb-1" />
              <span className="text-[10px] font-bold text-indigo-900">需求方</span>
            </div>
            <div className="h-16 w-16 bg-orange-50 rounded-xl flex flex-col items-center justify-center border border-orange-100 shadow-sm z-10">
              <Monitor className="w-6 h-6 text-orange-600 mb-1" />
              <span className="text-[10px] font-bold text-orange-900">平台</span>
            </div>
            <div className="h-16 w-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center border border-blue-100 shadow-sm z-10">
              <PenTool className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-blue-900">设计师</span>
            </div>
          </div>

          {/* Flow Content */}
          <div className="grid grid-cols-3 gap-8 relative">
            
            {/* Background Lines (Simplified) */}
            <div className="absolute inset-0 pointer-events-none">
               {/* Vertical dashed lines separating stages */}
               <div className="absolute left-1/3 top-0 bottom-0 border-r border-dashed border-slate-200"></div>
               <div className="absolute left-2/3 top-0 bottom-0 border-r border-dashed border-slate-200"></div>
            </div>

            {/* Stage 1: Registration */}
            <div className="relative h-full flex flex-col justify-around py-4">
               {/* Client */}
               <div className="flex justify-center relative">
                  <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md relative z-10">发布任务</div>
                  {/* Line down to Platform */}
                  <div className="absolute top-full left-1/2 w-0.5 h-12 bg-slate-300 -ml-0.5"></div>
                  <div className="absolute top-full left-1/2 text-slate-300 mt-10 -ml-1.5"><ArrowDown className="w-3 h-3" /></div>
               </div>

               {/* Platform */}
               <div className="flex flex-col items-center gap-2 relative">
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                    <FileText className="w-3 h-3" /> 审核需求
                  </div>
                  <div className="h-4 w-0.5 bg-slate-300"></div>
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                    <Send className="w-3 h-3" /> 发布通过
                  </div>
                  {/* Line down to Designer */}
                  <div className="absolute top-full left-1/2 w-0.5 h-8 bg-slate-300 -ml-0.5"></div>
                  <div className="absolute top-full left-1/2 text-slate-300 mt-6 -ml-1.5"><ArrowDown className="w-3 h-3" /></div>
               </div>

               {/* Designer */}
               <div className="flex justify-center relative">
                  <div className="bg-white border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-full text-xs font-bold shadow-sm">报名应征</div>
                  {/* Arrow to Next Stage (Designer) */}
                  <div className="absolute left-full top-1/2 w-8 h-0.5 bg-slate-300 -mt-0.5"></div>
                  <div className="absolute left-full top-1/2 text-slate-300 -mt-1.5 ml-6"><ArrowRight className="w-3 h-3" /></div>
               </div>
            </div>

            {/* Stage 2: Design */}
            <div className="relative h-full flex flex-col justify-around py-4">
               {/* Client */}
               <div className="flex justify-center relative">
                  <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md relative z-10">选定设计师</div>
                  {/* Line down to Platform */}
                  <div className="absolute top-full left-1/2 w-0.5 h-16 bg-slate-300 -ml-0.5"></div>
                  <div className="absolute top-full left-1/2 text-slate-300 mt-14 -ml-1.5"><ArrowDown className="w-3 h-3" /></div>
               </div>

               {/* Platform */}
               <div className="flex items-center justify-center gap-2 relative">
                  <div className="bg-orange-500 text-white p-2 rounded-lg text-[10px] font-bold shadow-md text-center w-16 leading-tight">
                    搭建<br/>项目组
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div className="bg-orange-500 text-white p-2 rounded-lg text-[10px] font-bold shadow-md text-center w-16 leading-tight">
                    梳理<br/>需求
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div className="bg-orange-500 text-white p-2 rounded-lg text-[10px] font-bold shadow-md text-center w-16 leading-tight">
                    指导<br/>审稿
                  </div>
                  {/* Line down to Designer */}
                  <div className="absolute top-full left-1/2 w-0.5 h-8 bg-slate-300 -ml-0.5"></div>
                  <div className="absolute top-full left-1/2 text-slate-300 mt-6 -ml-1.5"><ArrowDown className="w-3 h-3" /></div>
               </div>

               {/* Designer */}
               <div className="flex items-center justify-center gap-2">
                  <div className="bg-white border border-blue-500 text-blue-600 px-2 py-1.5 rounded text-[10px] font-bold">联系沟通</div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div className="bg-white border border-blue-500 text-blue-600 px-2 py-1.5 rounded text-[10px] font-bold">初稿设计</div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div className="bg-white border border-blue-500 text-blue-600 px-2 py-1.5 rounded text-[10px] font-bold">设计调整</div>
               </div>
               
               {/* Connection to Next Stage */}
               <div className="absolute top-1/2 right-0 transform translate-x-4 -translate-y-1/2 z-0">
                  <ArrowRight className="w-4 h-4 text-slate-300" />
               </div>
            </div>

            {/* Stage 3: Acceptance */}
            <div className="relative h-full flex flex-col justify-between py-4">
               {/* Client */}
               <div className="flex justify-center mt-4">
                  <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md">验收稿件</div>
               </div>

               {/* Platform - Empty space but line passes through */}
               <div className="h-16 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-slate-300 border-l border-dashed border-slate-300 opacity-50"></div>
               </div>

               {/* Designer */}
               <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                    <Download className="w-3 h-3" /> 上传源文件
                  </div>
                  <div className="h-4 w-0.5 bg-slate-300"></div>
                  <div className="flex gap-2">
                     <div className="bg-green-500 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm">任务结束</div>
                     <div className="bg-green-500 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                       <DollarSign className="w-3 h-3" /> 任务打款
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const PainterGuidePage: React.FC<PainterGuidePageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-20 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </button>
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center gap-3">
                  <BookOpen className="w-10 h-10" /> 画师全链路接单指南
                </h1>
                <p className="text-pink-100 max-w-2xl text-lg font-medium leading-relaxed">
                  从完善档案到最终收款，薪画社为您提供最专业的职业指引，助您在创意变现的道路上畅通无阻。
                </p>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left: Sidebar Navigation (Sticky) */}
          <div className="lg:w-64 flex-shrink-0">
             <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                           ? 'bg-pink-50 text-pink-600' 
                           : 'text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-pink-500' : 'text-slate-400'}`} />
                       {section.title}
                       {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Right: Content Area */}
          <div className="flex-1 space-y-12 max-w-5xl">
             
             {/* Section 0: Workflow Diagram */}
             <section id="overview" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">00</div>
                   全流程概览
                </h2>
                <WorkflowDiagram />
             </section>

             {/* Section 1: Preparation */}
             <section id="prep" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold">01</div>
                   接单准备
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">完善个人档案</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">
                         一个完整的个人档案是获得企划方信任的第一步。就像简历一样，它决定了企划方是否愿意进一步了解你。
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                               <CheckCircle2 className="w-4 h-4 text-green-500" /> 必须项
                            </h4>
                            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                               <li><strong>头像与昵称：</strong>保持专业，避免频繁更换。</li>
                               <li><strong>个人简介：</strong>清晰说明擅长风格、接单范围（如：擅长日系厚涂，不接急单）。</li>
                               <li><strong>代表作品：</strong>上传 3-9 张最高水准的原创作品，这是核心竞争力。</li>
                            </ul>
                         </div>
                         <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                               <AlertCircle className="w-4 h-4 text-amber-500" /> 注意事项
                            </h4>
                            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                               <li>请勿在简介中留下站外联系方式（如QQ/微信），这可能导致账号被降权。</li>
                               <li>确保上传的作品拥有完整版权，若是同人作品请标注。</li>
                            </ul>
                         </div>
                      </div>
                   </div>
                   
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">实名认证</h3>
                      <div className="flex items-start gap-4 bg-blue-50 p-6 rounded-xl border border-blue-100 text-sm text-blue-800">
                         <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                         <p className="leading-relaxed">
                            依据相关法律法规，接单前必须完成实名认证。认证信息仅用于平台审核与资金提现，我们将严格保密。
                            <br/>
                            <span className="font-bold mt-1 block">未认证账号将无法发布应征或申请提现。</span>
                         </p>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 2: Bidding */}
             <section id="bid" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">02</div>
                   参与应征
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">如何写出中标率高的应征方案？</h3>
                      <p className="text-slate-600 mb-4">
                         在“企划大厅”看到合适的项目后，点击“立即应征”。此时你需要填写报价单，这是企划方判断是否与你合作的关键。
                      </p>
                      <div className="space-y-4">
                         <div className="border-l-4 border-indigo-500 pl-6 py-3 bg-slate-50 rounded-r-xl">
                            <h4 className="font-bold text-slate-800 mb-1">❌ 错误的示范</h4>
                            <p className="text-sm text-slate-500">“选我选我”、“画风如图”、“可以接，私聊”</p>
                         </div>
                         <div className="border-l-4 border-green-500 pl-6 py-3 bg-slate-50 rounded-r-xl">
                            <h4 className="font-bold text-slate-800 mb-1">✅ 优秀的示范</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                               “您好，看了您的需求，需要绘制一张赛博朋克风格的城市夜景。我擅长科幻场景与光影处理，
                               曾参与过《XXX》项目的场景设计。
                               <br/>
                               <strong>我的排期：</strong>本周可开始，预计10天内完稿。
                               <br/>
                               <strong>大致流程：</strong>草稿(2天) -> 线稿(3天) -> 上色细化(5天)。
                               <br/>
                               希望能与您合作，作品集中有类似的案例供您参考。”
                            </p>
                         </div>
                      </div>
                   </div>

                   <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-3">合理报价的技巧</h3>
                      <div className="overflow-hidden border border-slate-200 rounded-xl">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 font-bold text-slate-700">
                               <tr>
                                  <th className="p-4 border-b border-r border-slate-200">项目类型</th>
                                  <th className="p-4 border-b border-r border-slate-200">参考价格区间 (仅供参考)</th>
                                  <th className="p-4 border-b">影响因素</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                               <tr>
                                  <td className="p-4 border-r border-slate-200">Q版头像</td>
                                  <td className="p-4 border-r border-slate-200">¥100 - ¥500</td>
                                  <td className="p-4">精度、商用/私用、是否包含背景</td>
                               </tr>
                               <tr>
                                  <td className="p-4 border-r border-slate-200">角色立绘 (半身/全身)</td>
                                  <td className="p-4 border-r border-slate-200">¥800 - ¥3000+</td>
                                  <td className="p-4">设计复杂度、服饰细节、是否拆分图层</td>
                               </tr>
                               <tr>
                                  <td className="p-4 border-r border-slate-200">插画 / 宣传图</td>
                                  <td className="p-4 border-r border-slate-200">¥2000 - ¥8000+</td>
                                  <td className="p-4">构图难度、场景大小、人物数量</td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 ml-1">* 实际报价请根据自身水平、工时成本及市场行情综合考量。</p>
                   </div>
                </div>
             </section>

             {/* Section 3: Creation Process */}
             <section id="create" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">03</div>
                   创作流程
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                   <div className="relative">
                      {/* Process Line */}
                      <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                      
                      <div className="space-y-10">
                         <div className="relative pl-16">
                            <div className="absolute left-3 top-0 w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">1</div>
                            <h3 className="font-bold text-slate-800 text-lg">确认合作与保证金</h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                               企划方选中你后，会发起“确认合作”。此时请<strong>务必等待企划方托管赏金</strong>。
                               看到系统提示“资金已托管”后，方可开始工作。切勿在未托管状态下出稿。
                            </p>
                         </div>

                         <div className="relative pl-16">
                            <div className="absolute left-3 top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">2</div>
                            <h3 className="font-bold text-slate-800 text-lg">草稿阶段</h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                               提交大动态、构图和大致配色。此阶段是修改成本最低的时候，请务必与企划方确认好大方向。
                               <br/>上传带水印的草图至节点验收处。
                            </p>
                         </div>

                         <div className="relative pl-16">
                            <div className="absolute left-3 top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">3</div>
                            <h3 className="font-bold text-slate-800 text-lg">线稿 / 细化阶段</h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                               根据反馈细化线稿或铺色。每次提交阶段性成果，建议都打上厚码或水印，保障权益。
                            </p>
                         </div>

                         <div className="relative pl-16">
                            <div className="absolute left-3 top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">4</div>
                            <h3 className="font-bold text-slate-800 text-lg">成图完稿</h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                               完成所有绘制，提交成图小样（非源文件）给企划方确认。
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 4: Delivery */}
             <section id="delivery" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">04</div>
                   交付验收
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                   <div className="p-5 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800 leading-relaxed">
                      <strong>关键规则：</strong> “一手交钱，一手交货”。在薪画社平台，这意味着：
                      企划方点击“确认验收” -> 资金解冻到画师账户 -> 画师发送高清源文件。
                   </div>
                   
                   <div className="space-y-4">
                      <h3 className="font-bold text-slate-800">标准交付动作：</h3>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                         <li>企划方对成图小样满意，表示可以收稿。</li>
                         <li>你在系统内点击“发起验收”。</li>
                         <li>企划方点击“确认支付/验收”，此时资金进入你的余额。</li>
                         <li>你通过系统附件或网盘链接，将<strong>无水印高清大图及源文件(PSD/AI)</strong>发送给企划方。</li>
                         <li>交易结束，双方互评。</li>
                      </ol>
                   </div>
                </div>
             </section>

             {/* Section 5: Finance */}
             <section id="payment" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                   <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">05</div>
                   财务安全
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                         <ShieldCheck className="w-5 h-5 text-indigo-600" /> 资金托管机制
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                         薪画社作为第三方担保，资金先由企划方支付给平台，验收通过后再释放给画师。
                         这有效避免了“画了图不给钱”或“付了钱不画图”的风险。
                      </p>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                         <MessageSquare className="w-5 h-5 text-rose-500" /> 拒绝私下交易
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                         严禁引导企划方进行微信、支付宝转账。私下交易一旦发生纠纷（如跑单、拒付），平台将无法提供仲裁与赔付支持，且会导致账号被封禁。
                      </p>
                   </div>
                </div>
             </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PainterGuidePage;
