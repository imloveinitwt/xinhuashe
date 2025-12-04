
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Hexagon, Facebook, Twitter, Instagram, Linkedin, 
  ExternalLink, Mail, MapPin, Phone, X, 
  Shield, FileText, Users, HelpCircle, Building, ChevronRight, Scale,
  Briefcase, Palette, CreditCard, CheckCircle2, LayoutTemplate,
  BookOpen, Umbrella, Search
} from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate?: (mode: ViewMode) => void;
  onTriggerUpload?: () => void;
}

type FooterPageKey = 'about' | 'contact' | 'privacy' | 'terms' | 'join' | 'copyright' | 'painter_guide' | 'employer_guide' | 'transaction_rules' | 'community_guidelines' | 'minor_protection';

// Removed 'help' from PAGE_CONTENT keys as it's now a standalone page
const PAGE_CONTENT: Record<FooterPageKey, { title: string; icon: any; content: React.ReactNode }> = {
  about: {
    title: '关于薪画社',
    icon: Building,
    content: (
      <div className="space-y-8 text-slate-600">
        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-3">我们的使命</h3>
          <p className="leading-relaxed">
            <strong>薪画社 (Xinhuashe)</strong> 成立于2023年，致力于打造全球领先的创意众包与数字资产管理平台。
            我们的使命是通过技术创新，将分散的创意人才与企业的商业需求无缝连接，让每一个创意都能便捷地获取顶级设计资源。
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-3">核心价值</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-1">专业信赖</h4>
              <p className="text-sm">严格的准入机制与资金托管，保障每一次交易的安全与质量。</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-1">技术驱动</h4>
              <p className="text-sm">引入 AI 辅助创作与 DAM 资产管理，重塑创意工作流。</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-1">开放共赢</h4>
              <p className="text-sm">构建透明的生态系统，让创作者与企业共同成长。</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-1">全球视野</h4>
              <p className="text-sm">汇聚全球设计资源，服务无国界的创意需求。</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-3">发展历程</h3>
          <ul className="border-l-2 border-indigo-100 pl-4 space-y-4">
            <li className="relative">
              <span className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white"></span>
              <span className="font-bold text-slate-800">2023.10</span>
              <p className="text-sm">薪画社平台 1.0 正式上线，整合交易与社区功能。</p>
            </li>
            <li className="relative">
              <span className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></span>
              <span className="font-bold text-slate-800">2023.06</span>
              <p className="text-sm">获得 A 轮融资，估值突破 1 亿美元。</p>
            </li>
            <li className="relative">
              <span className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></span>
              <span className="font-bold text-slate-800">2022.12</span>
              <p className="text-sm">核心团队组建完成，启动“创意供应链”项目研发。</p>
            </li>
          </ul>
        </section>
      </div>
    )
  },
  contact: {
    title: '联系方式',
    icon: Phone,
    content: (
      <div className="space-y-8">
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
           <h3 className="text-lg font-bold text-indigo-900 mb-2">客户服务中心</h3>
           <p className="text-indigo-700 text-sm mb-4">如果您在使用过程中遇到任何问题，或有任何建议，欢迎随时联系我们。</p>
           <div className="flex flex-col md:flex-row gap-4">
              <button className="flex-1 bg-white text-indigo-600 px-4 py-3 rounded-lg font-bold shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> 400-888-6666
              </button>
              <button className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> 在线客服
              </button>
           </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">公司总部</h4>
              <p className="text-slate-600 text-sm mt-1">
                北京市朝阳区望京 SOHO 塔3 A座 25层<br />
                邮编：100102
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">商务合作</h4>
              <p className="text-slate-600 text-sm mt-1">
                business@xinhuashe.com<br/>
                <span className="text-xs text-slate-400">（通常在 24 小时内回复）</span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">媒体联系</h4>
              <p className="text-slate-600 text-sm mt-1">
                pr@xinhuashe.com
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  privacy: {
    title: '隐私政策',
    icon: Shield,
    content: (
      <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-medium text-slate-800">生效日期：2023年10月1日</p>
          <p className="mt-1">薪画社非常重视您的隐私。本政策旨在说明我们如何收集、使用、存储及保护您的个人信息。</p>
        </div>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">1. 我们收集的信息</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>账户信息：</strong>注册时提供的用户名、电子邮箱、手机号码等。</li>
            <li><strong>认证信息：</strong>创作者进行实名认证时提供的身份证件信息（仅用于核验，加密存储）。</li>
            <li><strong>交易数据：</strong>订单详情、支付记录、发票信息等。</li>
            <li><strong>使用数据：</strong>设备信息、IP地址、浏览记录、点击行为等日志信息。</li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">2. 信息的用途</h4>
          <p>我们收集的信息主要用于：</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>提供、维护和改进我们的服务功能。</li>
            <li>处理交易结算，履行反洗钱义务。</li>
            <li>发送服务通知、验证码及必要的营销信息（您可以选择退订）。</li>
            <li>利用去标识化的数据进行算法模型训练，以优化内容推荐和搜索体验。</li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">3. 信息共享与披露</h4>
          <p>除了以下情况，我们不会向任何第三方出售或提供您的个人信息：</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>获得您的明确授权。</li>
            <li>根据法律法规或政府强制性要求。</li>
            <li>与授权合作伙伴（如支付机构、云服务商）共享必要信息以提供服务。</li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">4. 数据安全</h4>
          <p>
            我们采用符合行业标准的加密技术（如 SSL/TLS）、访问控制机制和安全审计流程来保护您的数据。
            尽管如此，互联网环境并非百分之百安全，请妥善保管您的账户凭证。
          </p>
        </section>
      </div>
    )
  },
  terms: {
    title: '服务条款',
    icon: FileText,
    content: (
      <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
        <p>
          欢迎使用薪画社。在您注册或使用本平台服务前，请仔细阅读本《服务条款》。使用我们的服务即表示您同意受这些条款的约束。
        </p>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">1. 账户注册与使用</h4>
          <p>
            您保证注册时提供的信息真实、准确。您需年满 18 周岁或具有完全民事行为能力。
            严禁恶意注册、借用他人账户或利用平台进行违法违规活动。
          </p>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">2. 知识产权声明</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>平台内容：</strong>薪画社的Logo、界面设计、代码等均受版权法保护。
            </li>
            <li>
              <strong>用户作品：</strong>创作者保留其上传作品的原始著作权，除非在交易中明确转让。
              创作者授予平台在全球范围内免费、非独家的展示权，用于平台推广。
            </li>
            <li>
              <strong>交易成果：</strong>除非另有约定，定制类交易的成果著作权在结清款项后归雇主所有（"买断制"），或按约定的授权范围使用。
            </li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">3. 交易与资金规则</h4>
          <p>
            平台提供资金托管服务以保障交易安全。
            <br/>- <strong>预付款：</strong>雇主需预先支付款项至平台托管。
            <br/>- <strong>验收与结算：</strong>雇主验收通过后，资金释放至创作者账户。
            <br/>- <strong>禁止私单：</strong>严禁引导用户进行线下或站外交易，一经发现将冻结账户。
          </p>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">4. 违约与赔偿</h4>
          <p>
            如用户违反本条款，导致平台或第三方受损，用户应承担相应的法律责任和赔偿义务。
            平台有权根据违规情节采取警告、下架作品、冻结资金或封禁账户等措施。
          </p>
        </section>
      </div>
    )
  },
  community_guidelines: {
    title: '社区自律公约',
    icon: BookOpen,
    content: (
      <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
        <section className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <p className="font-medium text-indigo-900">
            薪画社致力于打造一个专业、友善、包容的创意社区。为了维护社区氛围，保障每位用户的合法权益，我们特制定本公约。
          </p>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">1. 基本原则</h4>
          <p>用户在平台上的所有行为应遵循以下原则：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>尊重原创：</strong>严禁抄袭、盗图、抹去水印等侵权行为。</li>
            <li><strong>友善交流：</strong>理性评论，不进行人身攻击、辱骂或骚扰他人。</li>
            <li><strong>诚实守信：</strong>不发布虚假信息，不进行欺诈交易。</li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">2. 禁止发布的内容</h4>
          <p>严禁发布以下内容，一经发现将予以删除，严重者将封禁账号：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>违反国家法律法规、危害国家安全的信息。</li>
            <li>色情、低俗、暴力、恐怖、赌博等不良信息。</li>
            <li>涉及政治敏感、宗教极端或煽动民族仇恨的言论。</li>
            <li>恶意广告、垃圾信息或诱导站外交易的链接。</li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">3. 违规处理机制</h4>
          <p>
            平台设有专门的内容审核团队和举报通道。对于违规行为，我们将视情节轻重采取以下措施：
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>内容处理：删除违规内容、限制展示。</li>
            <li>账号处罚：警告、禁言、短期封禁、永久封禁。</li>
            <li>法律追责：涉及违法犯罪的，将移交司法机关处理。</li>
          </ul>
        </section>
      </div>
    )
  },
  minor_protection: {
    title: '未成年人保护',
    icon: Umbrella,
    content: (
      <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
        <p>
          薪画社高度重视未成年人的网络保护工作。根据《中华人民共和国未成年人保护法》等法律法规，我们采取以下措施：
        </p>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">1. 注册与使用限制</h4>
          <p>
            本平台主要面向成年专业创作者与企业用户。未满 14 周岁的儿童禁止注册和使用本平台服务。
            已满 14 周岁但未满 18 周岁的未成年人，应在监护人指导和同意下使用本平台。
          </p>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">2. 内容分级与审核</h4>
          <p>
            平台建立了严格的内容审核机制，严禁发布危害未成年人身心健康的内容。
            对于可能不适宜未成年人观看的内容（如特定艺术风格），平台将进行标注或限制访问。
          </p>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-2">3. 防沉迷与消费提示</h4>
          <p>
            我们倡导未成年人合理安排上网时间。平台不向未成年人提供大额消费或借贷服务。
            如监护人发现未成年人未经同意在平台进行消费，请及时联系客服进行处理。
          </p>
        </section>
        
        <section className="bg-slate-50 p-4 rounded-lg">
           <h5 className="font-bold text-slate-800 mb-1">家长监护工程</h5>
           <p className="text-xs text-slate-500">
             如果您是家长，发现您的孩子在未获得您许可的情况下使用本平台，或对其使用行为有任何疑问，请通过 <a href="mailto:guardian@xinhuashe.com" className="text-indigo-600 underline">guardian@xinhuashe.com</a> 联系我们。
           </p>
        </section>
      </div>
    )
  },
  copyright: {
    title: '版权投诉指引',
    icon: Scale,
    content: (
      <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
        <section className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
          <h3 className="font-bold text-slate-900 mb-2">薪画社版权保护原则</h3>
          <p>
            薪画社尊重并保护知识产权。我们严格遵守《中华人民共和国著作权法》等法律法规。
            如您发现平台上的内容侵犯了您的合法权益，请按下述流程提交投诉。
          </p>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-3">1. 投诉通知所需材料</h4>
          <p className="mb-2">为确保您的投诉被有效受理，通知书应包含以下内容：</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>权利人信息：</strong>姓名（或名称）、联系方式（邮箱/电话）、身份证明复印件（身份证或营业执照）。</li>
            <li><strong>侵权内容链接：</strong>具体的侵权作品网址或足以准确定位侵权内容的信息。</li>
            <li><strong>初步证明材料：</strong>权属证明文件（如版权登记证书、最早公开发布截图、创作手稿等）。</li>
            <li><strong>诚信声明：</strong>声明投诉内容真实，并愿意承担由此产生的法律责任。</li>
          </ul>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-3">2. 投诉投递方式</h4>
          <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
            <Mail className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-medium text-slate-800">法务部邮箱：</p>
              <a href="mailto:legal@xinhuashe.com" className="text-indigo-600 hover:underline">legal@xinhuashe.com</a>
            </div>
          </div>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-3">3. 处理流程</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>平台在收到合格投诉通知后，将在 24 小时内对涉嫌侵权内容采取“删除、屏蔽、断开链接”等必要措施。</li>
            <li>平台会将投诉通知转送给被投诉人（即上传内容的用户）。</li>
            <li>被投诉人如认为不构成侵权，可向平台提交《不侵权说明》及相关证明。</li>
            <li>收到反通知后，平台可能恢复相关内容，权利人可依法向有关部门投诉或向法院起诉。</li>
          </ol>
        </section>
      </div>
    )
  },
  join: {
    title: '加入我们',
    icon: Users,
    content: (
      <div className="space-y-6 text-slate-600">
        <div className="bg-indigo-600 text-white p-6 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">和优秀的人，做有挑战的事</h3>
          <p className="opacity-90 text-sm">薪画社正在重新定义创意产业的未来，我们需要你的加入。</p>
        </div>
        
        <h4 className="font-bold text-slate-900 mt-6 mb-4">热招职位</h4>
        <div className="space-y-3">
           <div className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
              <div>
                <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">高级前端工程师 (React)</div>
                <div className="text-xs text-slate-500 mt-1">北京 • 研发部 • 3-5年经验</div>
              </div>
              <span className="text-indigo-600 text-sm font-bold">25k-40k</span>
           </div>
           <div className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
              <div>
                <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">产品经理 (SaaS/B端)</div>
                <div className="text-xs text-slate-500 mt-1">上海 • 产品部 • 3年以上经验</div>
              </div>
              <span className="text-indigo-600 text-sm font-bold">20k-35k</span>
           </div>
           <div className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
              <div>
                <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">资深运营专家 (创作者生态)</div>
                <div className="text-xs text-slate-500 mt-1">远程/北京 • 运营部 • 5年以上经验</div>
              </div>
              <span className="text-indigo-600 text-sm font-bold">面议</span>
           </div>
        </div>
        <div className="text-center pt-4">
          <p className="text-sm">简历投递：<a href="mailto:hr@xinhuashe.com" className="text-indigo-600 font-bold hover:underline">hr@xinhuashe.com</a></p>
        </div>
      </div>
    )
  },
  employer_guide: {
    title: '企划方发约指南',
    icon: Briefcase,
    content: (
      <div className="space-y-6 text-slate-600">
        <section className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 mb-2">如何高效获取优质稿件？</h3>
          <p className="text-sm text-indigo-700">遵循标准的约稿流程，利用资金托管保障双方权益，让创意落地更简单。</p>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-lg mb-4">标准约稿流程</h4>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
              <div>
                <h5 className="font-bold text-slate-800">发布需求 (Post)</h5>
                <p className="text-sm text-slate-600 mt-1">
                  填写项目详情，包括风格参考、尺寸规格、截稿日期及预算范围。您可以选择公开招募，或直接邀请特定画师。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
              <div>
                <h5 className="font-bold text-slate-800">选定画师 (Select)</h5>
                <p className="text-sm text-slate-600 mt-1">
                  查看应征画师的作品集与报价。建议通过站内信沟通细节，确认档期后发起“确认合作”。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">3</div>
              <div>
                <h5 className="font-bold text-slate-800">支付预付款 (Deposit)</h5>
                <p className="text-sm text-slate-600 mt-1">
                  将项目资金托管至薪画社平台。此时资金并未直接进入画师账户，画师看到托管状态后开始工作。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">4</div>
              <div>
                <h5 className="font-bold text-slate-800">阶段验收 (Acceptance)</h5>
                <p className="text-sm text-slate-600 mt-1">
                  通常分为草稿、线稿、色稿、成图四个阶段。每个阶段验收通过后，平台将释放对应比例的资金给画师。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">5</div>
              <div>
                <h5 className="font-bold text-slate-800">收货评价 (Review)</h5>
                <p className="text-sm text-slate-600 mt-1">
                  接收源文件，确认无误后完成最终支付，并对画师进行评价。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Link to full guide */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => {
                // Handle navigation in Footer component
              }}
              data-nav-target="employer_guide_full"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              查看完整企划手册 <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    )
  },
  painter_guide: {
    title: '画师接单指南',
    icon: Palette,
    content: (
      <div className="space-y-6 text-slate-600">
        <section className="bg-pink-50 p-5 rounded-xl border border-pink-100">
          <h3 className="font-bold text-pink-900 mb-2">开启您的职业创作之路</h3>
          <p className="text-sm text-pink-700">薪画社为您提供公平的接单环境与完善的作品展示空间，助您实现创意变现。</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 p-4 rounded-xl hover:border-pink-300 transition-colors">
            <LayoutTemplate className="w-6 h-6 text-pink-500 mb-3" />
            <h5 className="font-bold text-slate-800 mb-1">1. 完善主页</h5>
            <p className="text-sm text-slate-500">上传高质量代表作，填写详细的个人简介与擅长风格标签，这能显著提高被邀请的概率。</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-xl hover:border-pink-300 transition-colors">
            <FileText className="w-6 h-6 text-pink-500 mb-3" />
            <h5 className="font-bold text-slate-800 mb-1">2. 参与应征</h5>
            <p className="text-sm text-slate-500">在“企划广场”浏览需求，根据自身能力报价。报价时简述创作思路能增加中标率。</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-xl hover:border-pink-300 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-pink-500 mb-3" />
            <h5 className="font-bold text-slate-800 mb-1">3. 按期交付</h5>
            <p className="text-sm text-slate-500">严格遵守约定的节点交付稿件（草稿、线稿等）。保持良好沟通是获得好评的关键。</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-xl hover:border-pink-300 transition-colors">
            <CreditCard className="w-6 h-6 text-pink-500 mb-3" />
            <h5 className="font-bold text-slate-800 mb-1">4. 获得收益</h5>
            <p className="text-sm text-slate-500">企划方验收通过后，资金即时解冻至您的钱包，支持提现至支付宝或银行卡。</p>
          </div>
        </div>

        <section className="bg-slate-50 p-4 rounded-lg text-sm">
          <h5 className="font-bold text-slate-900 mb-2">💡 接单小贴士</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>请勿在站外（如QQ/微信）进行资金交易，否则无法享受平台担保。</li>
            <li>若企划方提出超出原定需求的大幅修改，您有权提出增加预算（加购）。</li>
            <li>保持诚信，恶意拖稿或失联将严重影响您的信用分及接单权限。</li>
          </ul>
        </section>
        
        {/* Placeholder for link to full guide */}
        <div id="full-guide-link-placeholder"></div> 
      </div>
    )
  },
  transaction_rules: {
    title: '交易与版权规则',
    icon: Scale,
    content: (
      <div className="space-y-6 text-slate-600 text-sm">
        <section>
          <h4 className="font-bold text-slate-900 text-base mb-3 border-l-4 border-indigo-500 pl-3">资金安全保障</h4>
          <p className="mb-3">
            薪画社采用<strong>全额资金托管模式</strong>。企划方在项目开始前需将预算托管至平台，确保有支付能力；画师在收到托管通知后开工，确保劳动有保障。
          </p>
          <div className="bg-indigo-50 text-indigo-800 p-3 rounded-lg font-medium">
            资金流向：企划方支付 -> 平台托管 -> 阶段验收通过 -> 释放给画师
          </div>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-3 border-l-4 border-indigo-500 pl-3">版权归属模式</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 p-4 rounded-lg">
              <h5 className="font-bold text-slate-800 mb-1">买断制 (Buyout)</h5>
              <p className="text-slate-500">
                默认模式。交易完成后，作品的著作权财产权（复制、发行、改编等）完全转让给企划方。画师仅保留署名权及展示权（用于个人作品集）。
              </p>
            </div>
            <div className="border border-slate-200 p-4 rounded-lg">
              <h5 className="font-bold text-slate-800 mb-1">授权制 (Licensing)</h5>
              <p className="text-slate-500">
                画师保留著作权，仅授权企划方在特定范围（如仅限头像使用、不可商用等）内使用。需在需求详情中明确约定。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 text-base mb-3 border-l-4 border-indigo-500 pl-3">争议处理</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>退款规则：</strong>若画师未按时出稿或长期失联，企划方可申请全额退款。若企划方单方面终止合作，需按已完成进度支付相应稿酬（如草稿阶段通常支付 20%-30%）。
            </li>
            <li>
              <strong>仲裁介入：</strong>双方无法协商一致时，可申请平台人工介入。平台将依据聊天记录、交付物质量及相关凭证进行公正裁决。
            </li>
          </ul>
        </section>
      </div>
    )
  }
};

const Footer: React.FC<FooterProps> = ({ onNavigate, onTriggerUpload }) => {
  const currentYear = new Date().getFullYear();
  const [modalKey, setModalKey] = useState<FooterPageKey | null>(null);

  useEffect(() => {
    if (modalKey) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [modalKey]);

  const openPage = (key: FooterPageKey) => (e: React.MouseEvent) => {
    e.preventDefault();
    setModalKey(key);
  };

  const handleNavAction = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (action) action();
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

            {/* Links Column 2: Usage Guides & Services */}
            <div>
              <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider">使用指南与服务</h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li>
                  <a href="#" onClick={openPage('employer_guide')} className="hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium">
                    <Briefcase className="w-3.5 h-3.5" /> 企划方发约指南
                  </a>
                </li>
                <li>
                  <a href="#" onClick={openPage('painter_guide')} className="hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium">
                    <Palette className="w-3.5 h-3.5" /> 画师接单指南
                  </a>
                </li>
                <li>
                  <a href="#" onClick={openPage('transaction_rules')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5" /> 交易与版权规则
                  </a>
                </li>
                <li className="pt-2 mt-2 border-t border-slate-100">
                   <a href="#" onClick={handleNavAction(() => onTriggerUpload?.())} className="hover:text-indigo-600 transition-colors">
                     发布需求 / 申请入驻
                   </a>
                </li>
                <li>
                  <a href="#" onClick={handleNavAction(() => onNavigate?.('workspace'))} className="hover:text-indigo-600 transition-colors">
                    数字资产管理 (DAM)
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Column 3: Legal & Support */}
            <div>
              <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider">法律与支持</h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" onClick={openPage('privacy')} className="hover:text-indigo-600 transition-colors">隐私政策</a></li>
                <li><a href="#" onClick={openPage('terms')} className="hover:text-indigo-600 transition-colors">服务条款</a></li>
                <li><a href="#" onClick={openPage('copyright')} className="hover:text-indigo-600 transition-colors">版权投诉指引</a></li>
                <li><a href="#" onClick={openPage('community_guidelines')} className="hover:text-indigo-600 transition-colors">社区自律公约</a></li>
                <li><a href="#" onClick={openPage('minor_protection')} className="hover:text-indigo-600 transition-colors">未成年人保护</a></li>
                <li>
                  <a href="#" onClick={handleNavAction(() => onNavigate?.('help_center'))} className="hover:text-indigo-600 transition-colors">
                    帮助中心
                  </a>
                </li>
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
      {modalKey && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  {React.createElement(PAGE_CONTENT[modalKey].icon, { className: "w-5 h-5" })}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{PAGE_CONTENT[modalKey].title}</h2>
              </div>
              <button 
                onClick={() => setModalKey(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              {PAGE_CONTENT[modalKey].content}
              
              {/* Conditional Button for Painter Guide */}
              {modalKey === 'painter_guide' && (
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                   <button 
                     onClick={() => {
                        setModalKey(null);
                        onNavigate?.('painter_guide_full');
                     }}
                     className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors inline-flex items-center gap-2 shadow-lg"
                   >
                     查看完整接单手册 <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              )}

              {/* Conditional Button for Employer Guide */}
              {modalKey === 'employer_guide' && (
                 <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => {
                         setModalKey(null);
                         onNavigate?.('employer_guide_full');
                      }}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shadow-lg"
                    >
                      查看完整企划手册 <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              )}

              {/* Link for Terms, Privacy, Transaction Rules, Copyright, Community Guidelines to Full Terms Page */}
              {['terms', 'privacy', 'transaction_rules', 'copyright', 'community_guidelines', 'minor_protection'].includes(modalKey) && (
                 <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => {
                         setModalKey(null);
                         onNavigate?.('terms_service_full');
                      }}
                      className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-2 shadow-sm"
                    >
                      查看完整规则中心 <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
               <button 
                 onClick={() => setModalKey(null)}
                 className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-sm"
               >
                 关闭
               </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Footer;
