import React from 'react';
import { Download, RefreshCw, Maximize2 } from 'lucide-react';

interface ImageDisplayProps {
  imageUrl: string;
  feeling: string;
  onReset: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, feeling, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `emotive-flow-${feeling.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group rounded-2xl overflow-hidden shadow-2xl shadow-rose-500/20 ring-1 ring-zinc-800 aspect-[9/16] bg-zinc-900">
        
        {/* Image */}
        <img 
          src={imageUrl} 
          alt={`Abstract representation of ${feeling}`} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3">
          <p className="text-white/80 text-xs font-medium uppercase tracking-widest mb-1">
            Mood: {feeling}
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={handleDownload}
              className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors active:scale-95 duration-150"
            >
              <Download className="w-4 h-4" />
              Save Wallpaper
            </button>
            
            <button 
              onClick={onReset}
              className="p-3 bg-zinc-800/80 backdrop-blur-md text-white rounded-xl hover:bg-zinc-700 transition-colors active:scale-95 duration-150 border border-zinc-700"
              title="Create New"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={onReset}
          className="text-zinc-500 hover:text-zinc-300 text-sm flex items-center gap-2 mx-auto transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Generate another one
        </button>
      </div>
    </div>
  );
};