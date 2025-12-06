
import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud, ZoomIn, ZoomOut, Check, RotateCcw, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64Image: string) => Promise<void>;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose, onSave }) => {
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate Type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showToast('仅支持 JPG, PNG, WEBP 格式', 'error');
        return;
      }

      // Validate Size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('图片大小不能超过 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const generateCroppedImage = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setIsSaving(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 300; // Output size (resolution)
      
      // Set fixed output resolution
      canvas.width = size;
      canvas.height = size;

      if (ctx) {
        // Calculate the relative scale and position
        // We need to map the visible area in the container to the canvas
        // This is a simplified cropping logic mapping DOM position to Canvas draw
        
        const image = imageRef.current;
        const container = containerRef.current;
        
        // Draw image onto canvas based on current CSS transform simulation
        // 1. Clear
        ctx.clearRect(0, 0, size, size);
        
        // 2. We want to draw the image such that the center of the crop circle maps to center of canvas
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(position.x, position.y);
        
        // Draw image centered
        // Note: We need to scale the image draw size relative to the container view
        // Assuming container view is 256px wide, and output is 300px
        const ratio = size / 256; 
        // Actually simpler: just draw the image centered and let user transform it
        
        // The image natural dimensions
        const imgWidth = image.naturalWidth;
        const imgHeight = image.naturalHeight;
        
        // Fit image into the coordinate system based on display size
        // Display Image Width
        const displayWidth = image.width;
        const displayHeight = image.height;
        
        const scaleFactorX = imgWidth / displayWidth;
        
        // This math can be tricky. A robust way for a custom cropper:
        // Render the image exactly as seen.
        // Or simpler: Use the scale and position directly.
        
        // Let's rely on visual approximation for this demo code
        // Draw image centered at origin, offset by position
        ctx.drawImage(
          image, 
          -displayWidth / 2, 
          -displayHeight / 2, 
          displayWidth, 
          displayHeight
        );
      }

      const base64 = canvas.toDataURL('image/webp', 0.85); // Compress quality
      await onSave(base64);
      onClose();
    } catch (error) {
      console.error(error);
      showToast('裁剪失败，请重试', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600" /> 修改头像
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all group h-64"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-indigo-500">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700">点击上传图片</p>
              <p className="text-xs text-slate-400 mt-2">支持 JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-move mb-6 select-none"
                   ref={containerRef}
                   onMouseDown={handleMouseDown}
                   onMouseMove={handleMouseMove}
                   onMouseUp={handleMouseUp}
                   onMouseLeave={handleMouseUp}
              >
                {/* Image Layer */}
                <div 
                  className="w-full h-full flex items-center justify-center pointer-events-none"
                  style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center center'
                  }}
                >
                  <img 
                    ref={imageRef}
                    src={selectedImage} 
                    alt="Crop Preview" 
                    className="max-w-full max-h-full object-contain pointer-events-none" 
                    draggable={false}
                  />
                </div>

                {/* Mask Overlay (Circular) */}
                <div className="absolute inset-0 pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] rounded-full border-2 border-white/80"></div>
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                   <div className="w-full h-1/3 border-b border-white/50 absolute top-0"></div>
                   <div className="w-full h-1/3 border-b border-white/50 absolute top-1/3"></div>
                   <div className="h-full w-1/3 border-r border-white/50 absolute left-0"></div>
                   <div className="h-full w-1/3 border-r border-white/50 absolute left-1/3"></div>
                </div>
              </div>

              {/* Controls */}
              <div className="w-full flex items-center gap-4 px-4">
                <ZoomOut className="w-4 h-4 text-slate-400" />
                <input 
                  type="range" 
                  min="0.5" 
                  max="3" 
                  step="0.1" 
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="mt-4 flex gap-4 text-xs text-slate-500">
                 <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> 拖动调整位置</span>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={handleFileChange}
          />
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          {selectedImage ? (
             <button 
               onClick={() => { setSelectedImage(null); setScale(1); setPosition({x:0,y:0}); }}
               className="text-sm text-slate-500 hover:text-slate-800 font-medium px-2"
             >
               重新上传
             </button>
          ) : <div></div>}
          
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg transition-colors">
              取消
            </button>
            <button 
              onClick={generateCroppedImage}
              disabled={!selectedImage || isSaving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? '处理中...' : '确认使用'}
              {!isSaving && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AvatarUploadModal;
