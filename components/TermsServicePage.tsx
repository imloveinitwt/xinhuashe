
import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Shield, Scale, AlertTriangle, 
  Book, Globe, ChevronRight, Gavel, HelpCircle
} from 'lucide-react';

interface TermsServicePageProps {
  onBack: () => void;
}

const SECTIONS = [
  { id: 'service', title: '平台服务协议', icon: FileText },
  { id: 'privacy', title: '隐私政策', icon: Shield },
  { id: 'dispute', title: '交易纠纷处理规则', icon: Gavel },
  { id: 'violation', title: '违规行为处罚条例', icon: AlertTriangle },
  { id: 'copyright', title: '知识产权声明', icon: Scale },
  { id: 'faq', title: '常见问题索引', icon: HelpCircle },
];

const TermsServicePage: React.FC<TermsServicePageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('service');

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
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </button>
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
                <Book className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-slate-900">平台规则与服务协议中心</h1>
             </div>
             <p className="text-slate-500 max-w-3xl ml-11 text-lg">
               为了保障您的合法权益，维护良好的社区秩序，请您在使用薪画社服务前仔细阅读以下协议与规则。
               <br />
               <span className="text-sm opacity-70">最后更新日期：2023年10月1日</span>
             </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Sidebar Navigation (Sticky) */}
          <div className="lg:w-72 flex-shrink-0">
             <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                   <h3 className="font-bold text-slate-800">条款目录</h3>
                </div>
                <div className="p-2 space-y-1">
                   {SECTIONS.map((section) => (
                     <button
                       key={section.id}
                       onClick={() => scrollToSection(section.id)}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                         activeSection === section.id 
                           ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                           : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
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
          <div className="flex-1 space-y-10 max-w-5xl">
             
             {/* Section 1: Service Agreement */}
             <section id="service" className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                      薪画社平台服务协议
                   </h2>
                   <div className="text-slate-600 space-y-8 leading-relaxed">
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">1. 协议的范围</h4>
                         <p className="text-sm">
                            本协议是您与薪画社（以下简称“平台”）之间关于您使用平台服务所订立的协议。
                            使用平台服务即视为您已阅读并同意受本协议的约束。
                         </p>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">2. 账号注册与使用</h4>
                         <ul className="list-disc pl-5 text-sm space-y-2">
                            <li>您应当使用真实身份信息注册账号，且不得冒用他人身份。</li>
                            <li>您有责任妥善保管账号密码，因保管不善导致的损失由您自行承担。</li>
                            <li>严禁将账号赠与、借用、租用、转让或售卖给他人。</li>
                         </ul>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">3. 用户行为规范</h4>
                         <p className="text-sm">
                            用户不得利用平台制作、复制、发布、传播含有违反国家法律法规、危害国家安全、色情低俗、暴力恐怖、虚假诈骗等内容的信息。
                            一经发现，平台有权立即删除相关内容并封禁账号。
                         </p>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 2: Privacy Policy */}
             <section id="privacy" className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                      隐私政策
                   </h2>
                   <div className="text-slate-600 space-y-8 leading-relaxed">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4">
                         我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">1. 信息收集</h4>
                         <p className="text-sm">
                            在您使用我们的服务时，我们需要收集一些信息以提供更好的服务，包括但不限于：
                            <br/>- 身份信息（用于实名认证）
                            <br/>- 联系方式（用于通知和沟通）
                            <br/>- 交易记录（用于资金结算与纠纷处理）
                         </p>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">2. 信息使用</h4>
                         <p className="text-sm">
                            我们承诺不会向任何第三方出售您的个人信息。我们仅在以下情况下共享您的信息：
                            <br/>- 获得您的明确授权。
                            <br/>- 根据法律法规或政府强制性要求。
                         </p>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 3: Dispute Rules */}
             <section id="dispute" className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                      交易纠纷处理规则
                   </h2>
                   <div className="text-slate-600 space-y-8 leading-relaxed">
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">1. 纠纷介入流程</h4>
                         <p className="text-sm">
                            当交易双方产生争议且自行协商无效时，任一方均可发起“申请仲裁”。
                            <br/>平台将在 3 个工作日内介入，依据双方提供的证据（站内聊天记录、交付物、源文件等）进行裁定。
                         </p>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">2. 常见争议判定标准</h4>
                         <div className="overflow-x-auto border border-slate-200 rounded-lg">
                            <table className="w-full text-sm text-left">
                               <thead className="bg-slate-50 font-bold text-slate-700">
                                  <tr>
                                     <th className="p-4 border-b">争议类型</th>
                                     <th className="p-4 border-b">责任判定与处理</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-200">
                                  <tr>
                                     <td className="p-4 font-medium">画师拖稿/失联</td>
                                     <td className="p-4">全额退还企划方托管资金，画师扣除信用分并可能被封号。</td>
                                  </tr>
                                  <tr>
                                     <td className="p-4 font-medium">企划方无故拒付</td>
                                     <td className="p-4">若画师已按要求完成且多次修改，平台将强制支付相应阶段款项给画师。</td>
                                  </tr>
                                  <tr>
                                     <td className="p-4 font-medium">画风/质量不符</td>
                                     <td className="p-4">对比画师过往作品集与交付物。若严重不符，支持退款；若为主观审美差异，倾向于按进度支付辛苦费。</td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 4: Violations */}
             <section id="violation" className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                      违规行为处罚条例
                   </h2>
                   <div className="text-slate-600 space-y-6 text-sm">
                      <div className="border border-red-100 bg-red-50 p-6 rounded-xl">
                         <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2 text-lg">
                            <AlertTriangle className="w-5 h-5" /> 严重违规（永久封号）
                         </h4>
                         <ul className="list-disc pl-5 space-y-2 text-red-700">
                            <li>发布反动、色情、暴力等违法信息。</li>
                            <li>涉及诈骗、盗刷资金等犯罪行为。</li>
                            <li>恶意抄袭、盗图并冒充原创进行交易。</li>
                            <li>多次引导站外交易并发生纠纷，严重损害平台声誉。</li>
                         </ul>
                      </div>
                      <div className="border border-amber-100 bg-amber-50 p-6 rounded-xl">
                         <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-lg">
                            <AlertTriangle className="w-5 h-5" /> 一般违规（警告/禁言/短期封禁）
                         </h4>
                         <ul className="list-disc pl-5 space-y-2 text-amber-700">
                            <li>发布广告、垃圾信息。</li>
                            <li>在评论区辱骂、人身攻击他人。</li>
                            <li>无故取消订单、拖延交付（根据次数累计加重处罚）。</li>
                         </ul>
                      </div>
                   </div>
                </div>
             </section>

             {/* Section 5: Copyright */}
             <section id="copyright" className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                      知识产权声明
                   </h2>
                   <div className="text-slate-600 space-y-8 leading-relaxed">
                      <p className="text-sm">
                         薪画社尊重知识产权，反对并打击侵权行为。
                      </p>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">1. 平台权利</h4>
                         <p className="text-sm">
                            平台页面设计、代码、Logo等知识产权归薪画社所有。
                         </p>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">2. 用户权利</h4>
                         <p className="text-sm">
                            用户在平台发布的原创作品，著作权归作者所有。用户同意授予平台免费的、非独家的使用权，用于平台宣传展示。
                         </p>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 mb-2 text-lg">3. 侵权投诉</h4>
                         <p className="text-sm">
                            若您发现平台内容侵犯了您的权益，请发送邮件至 legal@xinhuashe.com，我们将在收到通知后依法处理。
                         </p>
                      </div>
                   </div>
                </div>
             </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsServicePage;
