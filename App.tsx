import React, { useState } from 'react';
import { generateEmotiveWallpaper } from './services/geminiService';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ImageDisplay } from './components/ImageDisplay';

const App: React.FC = () => {
  const [feeling, setFeeling] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (userFeeling: string) => {
    setFeeling(userFeeling);
    setLoading(true);
    setError(null);
    
    // Small artificial delay to ensure the UI transition isn't too jarring
    // if the API is super fast (rare for image gen, but good for UX)
    const startTime = Date.now();

    const result = await generateEmotiveWallpaper(userFeeling);

    const elapsed = Date.now() - startTime;
    const minDuration = 800; 
    if (elapsed < minDuration) {
        await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
    }

    if (result.error) {
      setError(result.error);
    } else {
      setImageUrl(result.imageUrl);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setImageUrl(null);
    setFeeling('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-4 z-10">
        
        {/* Error Message */}
        {error && (
          <div className="w-full max-w-md mb-6 bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm text-center animate-in fade-in slide-in-from-top-2">
            {error}
            <button 
              onClick={() => setError(null)}
              className="block w-full mt-2 text-xs font-bold uppercase tracking-wider hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Switcher */}
        {!imageUrl ? (
          <div className="w-full flex-1 flex flex-col justify-center pb-32">
             <InputForm onSubmit={handleGenerate} isLoading={loading} />
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col justify-start pt-4 pb-12">
            <ImageDisplay 
              imageUrl={imageUrl} 
              feeling={feeling} 
              onReset={handleReset} 
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;