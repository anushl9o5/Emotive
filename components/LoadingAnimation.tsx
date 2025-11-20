import React, { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  feeling: string;
}

interface AnimationConfig {
  colors: string[];
  speed: string;
  opacity: string;
  blur: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ feeling }) => {
  const [config, setConfig] = useState<AnimationConfig>({
    colors: ['bg-rose-500', 'bg-purple-500', 'bg-indigo-500'],
    speed: '7s',
    opacity: 'opacity-60',
    blur: 'blur-[60px]'
  });

  useEffect(() => {
    const lower = feeling.toLowerCase();
    
    // Default: Energetic/Balanced
    let newConfig: AnimationConfig = {
      colors: ['bg-rose-500', 'bg-purple-500', 'bg-indigo-500'],
      speed: '7s',
      opacity: 'opacity-60',
      blur: 'blur-[60px]'
    };

    // Logic to determine physics of the lava based on emotion
    if (lower.match(/sad|lonely|blue|depressed|tired|grief|cry|down|bad|empty|nothing|numb/)) {
      newConfig = {
        colors: ['bg-slate-800', 'bg-blue-900', 'bg-indigo-950'], 
        speed: '18s', // Extremely slow, viscous
        opacity: 'opacity-40', // Dim, murky
        blur: 'blur-[80px]' // Very diffuse
      };
    } else if (lower.match(/angry|mad|furious|hate|rage|annoyed|frustrated|burn|scream|stress/)) {
      newConfig = {
        colors: ['bg-red-600', 'bg-orange-700', 'bg-rose-900'], 
        speed: '2s', // Chaotic, fast, boiling
        opacity: 'opacity-80', // Intense, opaque
        blur: 'blur-[40px]' // Sharper, more defined blobs
      };
    } else if (lower.match(/happy|joy|excited|love|great|good|awesome|yay|glad|hyper|party/)) {
      newConfig = {
        colors: ['bg-yellow-500', 'bg-pink-500', 'bg-orange-500'], 
        speed: '4s', // Fast, flowing energetic
        opacity: 'opacity-70', // Bright
        blur: 'blur-[50px]'
      };
    } else if (lower.match(/calm|peace|relax|chill|zen|quiet|fine|ok|sleepy|bored/)) {
      newConfig = {
        colors: ['bg-teal-600', 'bg-emerald-700', 'bg-cyan-800'], 
        speed: '12s', // Slow, smooth flow
        opacity: 'opacity-50', // Soft
        blur: 'blur-[70px]'
      };
    }

    setConfig(newConfig);
  }, [feeling]);

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-1000">
        {/* 
            Container mimics the phone screen ratio (9:16) 
            Visualizes the "assembling" of the final image
        */}
        <div className="relative w-full aspect-[9/16] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
            
            {/* Base Layer */}
            <div className="absolute inset-0 bg-black"></div>

            {/* Lava Simulation Layer */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* Blob 1: The Core */}
                <div 
                    className={`absolute w-[140%] h-[90%] rounded-[40%] mix-blend-screen animate-blob ${config.colors[0]} ${config.opacity} ${config.blur}`}
                    style={{ animationDuration: config.speed }}
                ></div>
                
                {/* Blob 2: The Flow */}
                <div 
                    className={`absolute w-[110%] h-[110%] rounded-[45%] mix-blend-screen animate-blob animation-delay-2000 ${config.colors[1]} ${config.opacity} ${config.blur} translate-x-10`}
                    style={{ animationDuration: config.speed }}
                ></div>
                
                {/* Blob 3: The Accent */}
                <div 
                    className={`absolute w-[100%] h-[100%] rounded-[35%] mix-blend-screen animate-blob animation-delay-4000 ${config.colors[2]} ${config.opacity} ${config.blur} -translate-x-10 translate-y-10`}
                    style={{ animationDuration: config.speed }}
                ></div>
            </div>

            {/* Assembly overlay effect */}
            {/* A subtle grain/noise or vignette to make it look contained */}
            <div className="absolute inset-0 ring-inset ring-1 ring-white/5 rounded-2xl pointer-events-none"></div>
        </div>
    </div>
  );
};
