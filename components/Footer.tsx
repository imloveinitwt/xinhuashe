
import React, { useState } from 'react';
import { 
  Hexagon, Facebook, Twitter, Instagram, Linkedin, 
  ExternalLink, Mail, MapPin, Phone, X, 
  Shield, FileText, Users, HelpCircle, Building
} from 'lucide-react';

type FooterPageKey = 'about' | 'contact' | 'privacy' | 'terms' | 'help' | 'join';

const PAGE_CONTENT: Record<FooterPageKey, { title: string; icon: any; content: React.ReactNode }> = {
  about: {
    title: '关于薪画社',
    icon: Building,
    content: (
      <div className="space-y-4 text-slate-600">
        <p>
          <strong>薪画社 (Xinhuashe)</strong> 成立于2023年，致力于打造全球领先的创意众包与数字资产管理平台。
          我们通过技术创新，将分散的创意人才与企业的商业需求无缝连接。
        </p>
        <p>
          我们的愿景是让每一个创意都能体现价值，让每一家企业都能便捷地获取顶级设计资源。
          平台集成了全链路的约稿交易系统、企业级 DAM（数字资产管理）以及最前沿的 AI 辅助创作工具。
        </p>
        <p>
          目前，薪画社已汇聚超过 50,000 名认证创作者，服务了包括游戏、互联网、广告营销在内的 2,000+ 家企业客户。
        </p>
      </div>
    )
  },
  contact: {
    title: '联系方式',
    icon: Phone,
    content: (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">公司总部</h4>
            <p className="text-slate-600 text-sm mt-1">
              北京市朝阳区望京 SOHO 塔3 A座 25层<br />
              100102
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">商务合作</h4>
            <p className="text-slate-600 text-sm mt-1">
              business@xinhuashe.com
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">客服热线</h4>
            <p className="text-slate-600 text-sm mt-1">
              400-888-6666 (工作日 9:00 - 18:00)
            </p>
          </div>
        </div>
      </div>
    )
  },
  privacy: {
    title: '隐私政策',
    icon: Shield,
    content: (
      <div className="space-y-4 text-slate-600 text-sm">
        <p><strong>生效日期：2023年10月1日</strong></p>
        <p>
          薪画社非常重视您的隐私。本隐私政策说明了我们如何收集、使用、披露、传输及存储您的信息。
          请在使用我们的服务前仔细阅读。
        </p>
        <h4 className="font-bold text-slate-900 mt-4">1. 我们收集的信息</h4>
        <p>
          当您注册账户时，我们会收集您的用户名、电子邮箱地址等基本信息。
          对于认证创作者，我们可能需要收集身份证明以完成实名认证（通过第三方加密服务）。
        </p>
        <h4 className="font-bold text-slate-900 mt-4">2. 信息的用途</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>提供、维护和改进我们的服务。</li>
          <li>处理交易并发送相关通知。</li>
          <li>用于数据分析和算法优化（去标识化处理）。</li>
        </ul>
        <h4 className="font-bold text-slate-900 mt-4">3. 信息安全</h4>
        <p>
          我们使用符合行业标准的加密技术（如 SSL/TLS）来保护您的数据传输和存储安全。
        </p>
      </div>
    )
  },
  terms: {
    title: '服务条款',
    icon: FileText,
    content: (
      <div className="space-y-4 text-slate-600 text-sm">
        <p>
          欢迎使用薪画社。如果您访问或使用我们的网站，即表示您同意受这些条款的约束。
        </p>
        <h4 className="font-bold text-slate-900 mt-4">1. 账户注册</h4>
        <p>
          您必须年满 18 岁才能注册账户。您有责任维护账户凭证的机密性。
        </p>
        <h4 className="font-bold text-slate-900 mt-4">2. 内容所有权</h4>
        <p>
          创作者保留其上传作品的原始版权，除非在交易中明确转让。
          用户授予薪画社在平台内展示、推广其非私密作品的权利。
        </p>
        <h4 className="font-bold text-slate-900 mt-4">3. 交易规则</h4>
        <p>
          所有通过平台进行的交易均受平台资金托管保护。禁止引导至站外交易，否则可能导致账户封禁。
        </p>
      </div>
    )
  },
  help: {
    title: '帮助中心',
    icon: HelpCircle,
    content: (
      <div className="space-y-4">
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-bold text-slate-800 mb-2">我是画师，如何接单？</h4>
          <p className="text-sm text-slate-600">
            完成实名认证后，您可以在“项目与任务”板块查看公开招募的企划。点击“应征”并提交您的报价和排期。
          </p>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-bold text-slate-800 mb-2">资金托管安全吗？</h4>
          <p className="text-sm text-slate-600">
            非常安全。甲方的预付款会先支付到平台监管账户，只有在您提交作品并经甲方验收通过后，资金才会释放到您的钱包。
          </p>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-bold text-slate-800 mb-2">如何开具发票？</h4>
          <p className="text-sm text-slate-600">
            企业用户可以在“财务与发票”板块申请增值税专用发票或普通发票。我们通常在 3-5 个工作日内处理。
          </p>
        </div>
      </div>
    )
  },
  join: {
    title: '加入我们',
    icon: Users,
    content: (
      <div className="space-y-4 text-slate-600">
        <p>
          薪画社正在快速成长，我们需要充满激情的人才加入。
        </p>
        <div className="space-y-3 mt-4">
           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">高级前端工程师</div>
                <div className="text-xs text-slate-500">北京 • 全职 • 25k-40k</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
           </div>
           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">产品经理 (SaaS方向)</div>
                <div className="text-xs text-slate-500">上海 • 全职 • 20k-35k</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
           </div>
           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">资深插画师 (运营)</div>
                <div className="text-xs text-slate-500">远程 • 兼职 • 面议</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
           </div>
        </div>
        <p className="text-sm mt-4 text-center">请发送简历至 hr@xinhuashe.com</p>
      </div>
    )
  }
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [modalKey, setModalKey] = useState<FooterPageKey | null>(null);

  const openPage = (key: FooterPageKey) => (e: React.MouseEvent) => {
    e.preventDefault();
    setModalKey(key);
  };

  return (
    <>
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <Hexagon className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">薪画社</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                连接创意与商业的桥梁。整合全球主流设计资源，为创作者提供广阔舞台，为企业打造智能化的数字资产管理与创意供应链。
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Column 1: About & Contact */}
            <div>
              <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider">关于薪画社</h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" onClick={openPage('about')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">关于我们</a></li>
                <li><a href="#" onClick={openPage('about')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">团队介绍</a></li>
                <li><a href="#" onClick={openPage('join')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">加入我们 (招聘)</a></li>
                <li className="pt-2 border-t border-slate-100 mt-2">
                  <a href="#" onClick={openPage('contact')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                     <Mail className="w-4 h-4" /> 联系方式
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Column 2: Product & Ecosystem */}
            <div>
              <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider">产品与服务</h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">浏览创意作品</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">发布定制需求</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">数字资产管理 (DAM)</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API 开放平台</a></li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1 group">
                    生态合作伙伴 <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Column 3: Legal & Privacy */}
            <div>
              <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider">法律与支持</h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" onClick={openPage('privacy')} className="hover:text-indigo-600 transition-colors">隐私政策</a></li>
                <li><a href="#" onClick={openPage('terms')} className="hover:text-indigo-600 transition-colors">服务条款</a></li>
                <li><a href="#" onClick={openPage('help')} className="hover:text-indigo-600 transition-colors">版权投诉指引</a></li>
                <li><a href="#" onClick={openPage('help')} className="hover:text-indigo-600 transition-colors">帮助中心</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              &copy; {currentYear} 薪画社 (Xinhuashe). 保留所有权利.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer">京ICP备12345678号-1</span>
              <span className="flex items-center gap-1.5 hover:text-slate-600 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                系统运行正常
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Content Modal */}
      {modalKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                {React.createElement(PAGE_CONTENT[modalKey].icon, { className: "w-5 h-5 text-indigo-600" })}
                <h2 className="text-lg font-bold text-slate-800">{PAGE_CONTENT[modalKey].title}</h2>
              </div>
              <button 
                onClick={() => setModalKey(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              {PAGE_CONTENT[modalKey].content}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
               <button 
                 onClick={() => setModalKey(null)}
                 className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
               >
                 关闭
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
