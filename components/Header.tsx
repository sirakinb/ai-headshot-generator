
import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="p-4 border-b border-slate-700/50">
      <div className="container mx-auto flex items-center justify-center">
        <SparklesIcon className="w-8 h-8 text-indigo-400 mr-3" />
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          AI Professional Headshot Generator
        </h1>
      </div>
    </header>
  );
};
