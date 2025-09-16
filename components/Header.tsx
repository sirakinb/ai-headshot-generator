
import React from 'react';
import { SparklesIcon } from './Icons';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

interface HeaderProps {
  onShowPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowPricing }) => {
  return (
    <header className="p-4 border-b border-slate-700/50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <SparklesIcon className="w-8 h-8 text-indigo-400 mr-3" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            AI Professional Headshot Generator
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {onShowPricing && (
            <button
              onClick={onShowPricing}
              className="text-slate-300 hover:text-indigo-400 transition-colors font-medium"
            >
              Pricing
            </button>
          )}
          <SignedOut>
            <SignInButton>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
