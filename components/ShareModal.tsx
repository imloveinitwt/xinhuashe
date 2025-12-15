
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Link, Copy, Check, Image as ImageIcon, 
  MessageCircle, Twitter, Facebook, Send, Download, Loader2
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export interface ShareData {
  title: string;
  cover: string;
  author?: string;
  desc?: string;
  type: 'artwork' | 'project' | 'profile';
  id: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

// Helper to load image for canvas
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Try to handle CORS
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Mock URL generation based on type
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/${data.type}/${data.id}`);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('链接已复制到剪贴板', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    showToast(`正在跳转至 ${platform} 分享...`, 'info');
    // In a real app, this would open a popup window for the social provider
  };

  const handleDownloadPoster = async () => {
    setIsGenerating(true);
    showToast('正在生成分享海报...', 'info');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not supported');

      // 1. Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 900);
      
      // Top Gradient Stripe
      const gradient = ctx.createLinearGradient(0, 0, 600, 0);
      gradient.addColorStop(0, '#4f46e5'); // indigo-600
      gradient.addColorStop(1, '#9333ea'); // purple-600
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 20);

      // 2. Main Image
      try {
        let img: HTMLImageElement | null = null;
        try {
           img = await loadImage(data.cover);
        } catch (e) {
           console.warn('Image load failed, using fallback color');
        }
        
        // Draw Image Area (Rounded Rectangle Clip)
        const targetWidth = 520;
        const targetHeight = 520;
        const x = 40;
        const y = 60;
        const radius = 20;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + targetWidth - radius, y);
        ctx.quadraticCurveTo(x + targetWidth, y, x + targetWidth, y + radius);
        ctx.lineTo(x + targetWidth, y + targetHeight - radius);
        ctx.quadraticCurveTo(x + targetWidth, y + targetHeight, x + targetWidth - radius, y + targetHeight);
        ctx.lineTo(x + radius, y + targetHeight);
        ctx.quadraticCurveTo(x, y + targetHeight, x, y + targetHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();

        if (img) {
            // Draw image with aspect ratio "cover"
            const imgRatio = img.width / img.height;
            const targetRatio = targetWidth / targetHeight;
            let renderWidth, renderHeight, offsetX, offsetY;

            if (imgRatio > targetRatio) {
                renderHeight = targetHeight;
                renderWidth = img.width * (targetHeight / img.height);
                offsetX = (targetWidth - renderWidth) / 2;
                offsetY = 0;
            } else {
                renderWidth = targetWidth;
                renderHeight = img.height * (targetWidth / img.width);
                offsetX = 0;
                offsetY = (targetHeight - renderHeight) / 2;
            }
            ctx.drawImage(img, x + offsetX, y + offsetY, renderWidth, renderHeight);
        } else {
            // Fallback Background
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(x, y, targetWidth, targetHeight);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.title.charAt(0).toUpperCase(), x + targetWidth/2, y + targetHeight/2 + 15);
        }
        ctx.restore();

      } catch (e) {
        console.error("Canvas draw error", e);
      }

      // 3. Text Content
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.font = 'bold 32px sans-serif';
      // Truncate title
      const title = data.title.length > 20 ? data.title.substring(0, 20) + '...' : data.title;
      ctx.fillText(title, 40, 640);

      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = '22px sans-serif';
      if (data.author) {
         ctx.fillText(`By ${data.author}`, 40, 680);
      }

      if (data.desc) {
         ctx.font = '18px sans-serif';
         ctx.fillStyle = '#94a3b8'; // slate-400
         const descLine = data.desc.substring(0, 35) + (data.desc.length > 35 ? '...' : '');
         ctx.fillText(descLine, 40, 720);
      }

      // 4. Footer & QR Code Area
      const footerY = 770;
      ctx.fillStyle = '#f8fafc'; // slate-50
      ctx.fillRect(40, footerY, 520, 100);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, footerY, 520, 100);

      // Mock QR Code (Geometric Pattern)
      const qrX = 470;
      const qrY = footerY + 15;
      const qrSize = 70;
      ctx.fillStyle = '#000000';
      ctx.fillRect(qrX, qrY, qrSize, qrSize); // Border
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 3, qrY + 3, qrSize - 6, qrSize - 6); // Inner white
      ctx.fillStyle = '#000000';
      ctx.fillRect(qrX + 15, qrY + 15, qrSize - 30, qrSize - 30); // Center block
      ctx.fillRect(qrX + 6, qrY + 6, 15, 15); // Corner
      ctx.fillRect(qrX + 49, qrY + 49, 15, 15); // Corner

      // App Branding Text
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('薪画社 Xinhuashe', 60, footerY + 40);
      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.fillText('长按识别二维码，查看详情', 60, footerY + 70);

      // 5. Export
      const dataUrl = canvas.toDataURL('image/png');
      
      // 6. Download
      const link = document.createElement('a');
      link.download = `xhs_share_${data.type}_${data.id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('海报已保存到本地', 'success');
    } catch (err) {
      console.error(err);
      showToast('海报生成失败，请检查网络或重试', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-lg">分享{data.type === 'artwork' ? '作品' : data.type === 'project' ? '企划' : '主页'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Preview Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex gap-4 mb-6">
             <div className="w-20 h-20 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                <img src={data.cover} alt={data.title} className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-bold text-slate-900 truncate mb-1">{data.title}</h4>
                {data.author && <p className="text-xs text-slate-500 mb-1">By {data.author}</p>}
                <p className="text-xs text-slate-400 line-clamp-1">{data.desc || '来自 薪画社 的精彩内容'}</p>
             </div>
          </div>

          {/* Social Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
             {[
               { name: '微信', icon: MessageCircle, color: 'bg-green-100 text-green-600 hover:bg-green-200' },
               { name: '朋友圈', icon: ImageIcon, color: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' },
               { name: '微博', icon: Send, color: 'bg-red-100 text-red-500 hover:bg-red-200' },
               { name: '推特', icon: Twitter, color: 'bg-blue-100 text-blue-500 hover:bg-blue-200' },
             ].map((item) => (
               <button 
                 key={item.name}
                 onClick={() => handleSocialShare(item.name)}
                 className="flex flex-col items-center gap-2 group"
               >
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                 </div>
                 <span className="text-xs text-slate-500 group-hover:text-slate-800">{item.name}</span>
               </button>
             ))}
          </div>

          {/* Copy Link */}
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">分享链接</label>
             <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600 truncate font-mono select-all">
                   {shareUrl}
                </div>
                <button 
                  onClick={handleCopy}
                  className={`px-4 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-500 text-white shadow-sm' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'
                  }`}
                >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {copied ? '已复制' : '复制'}
                </button>
             </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center">
           <button 
             onClick={handleDownloadPoster}
             disabled={isGenerating}
             className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isGenerating ? '正在生成...' : '生成分享海报'}
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareModal;
