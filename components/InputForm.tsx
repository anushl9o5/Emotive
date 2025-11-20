import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (feeling: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(input);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in zoom-in duration-500">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How are you feeling right now?"
            className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800 text-zinc-100 text-lg rounded-3xl p-6 pr-20 min-h-[160px] focus:ring-1 focus:ring-rose-400/30 focus:border-rose-400/30 outline-none transition-all resize-none placeholder:text-zinc-500 shadow-xl shadow-black/20"
            disabled={isLoading}
            maxLength={200}
            autoFocus
          />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className={`text-xs text-zinc-600 transition-opacity duration-300 ${input.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
              {input.length}/200
            </span>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                ${!input.trim() || isLoading 
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 text-white hover:scale-110 hover:shadow-rose-500/20 active:scale-90'
                }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};