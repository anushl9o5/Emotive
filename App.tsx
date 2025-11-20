import React, { useState } from 'react';
import { generateEmotiveWallpaper } from './services/geminiService';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ImageDisplay } from './components/ImageDisplay';
import { LoadingAnimation } from './components/LoadingAnimation';

const App: React.FC = () => {
  const [feeling, setFeeling] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (userFeeling: string) => {
    setFeeling(userFeeling);
    setLoading(true);
    setError(null);
    
    // Minimum display time for the animation (3s) to ensure the user enjoys the visual experience
    const startTime = Date.now();

    const result = await generateEmotiveWallpaper(userFeeling);

    const elapsed = Date.now() - startTime;
    const minDuration = 3000; // Increased to 3s for the animation to play out
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
      {/* Background Decorative Blobs - only visible when NOT loading to avoid conflict with loading blobs */}
      {!loading && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-700">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
        </div>
      )}

      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-4 z-10">
        
        {/* Error Message */}
        {error && !loading && (
          <div className="w-full max-w-md mb-6 bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm text-center animate-in fade-in slide-in-from-top-2">
            {error}
            <button 
              onClick={() => setError(null)}
              className="block w-full mt-2 text-xs font-bold uppercase tracking-wider hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content Switcher */}
        {loading ? (
          <div className="w-full flex-1 flex flex-col justify-center pb-20">
            <LoadingAnimation feeling={feeling} />
          </div>
        ) : !imageUrl ? (
          <div className="w-full flex-1 flex flex-col justify-center pb-32">
             <InputForm 
               onSubmit={handleGenerate} 
               isLoading={loading} 
               initialValue={feeling} // Pass feeling back in case of error/retry
             />
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