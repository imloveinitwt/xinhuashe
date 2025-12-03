
import React from 'react';
import { Hexagon, Facebook, Twitter, Instagram, Linkedin, Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Hexagon className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">薪画社</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              连接创意与商业的桥梁。整合六大主流平台资源，为创作者提供更广阔的舞台，为企业提供更高效的创意供应链。
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1: Platform Services */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">平台服务</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">浏览创意作品</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">寻找优质画师</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">发布定制需求</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">近期赛事活动</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">数字资产管理 (DAM)</a></li>
            </ul>
          </div>

          {/* Links Column 2: Ecosystem Partners (Real Links) */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">生态合作伙伴</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="https://huajia.163.com/" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  网易画架 <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://www.mihuashi.com/" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  米画师 <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://www.tezign.com/" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  特赞 Tezign <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://www.huashi6.com/" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  触站 Huashi6 <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://www.gracg.com/" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  涂鸦王国 <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Support & Legal */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">支持与法律</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">帮助中心</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">创作者指南</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">隐私政策</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">服务条款</a></li>
              <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-indigo-600 transition-colors">版权与侵权投诉</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} 薪画社 (Xinhuashe). 保留所有权利.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>京ICP备12345678号</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              系统运行正常
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
