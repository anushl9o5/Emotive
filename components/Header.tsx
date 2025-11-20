import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-4 flex flex-col items-center justify-center text-center z-10 relative">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 animate-gradient-x pb-1">
          Emotive
        </h1>
      </div>
    </header>
  );
};