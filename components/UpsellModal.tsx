import React from 'react';
import { SparklesIcon } from './Icons';
import { useUsage } from '../contexts/UsageContext';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToPricing: () => void;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, onGoToPricing }) => {
  const { upgradeSubscription } = useUsage();

  if (!isOpen) return null;

  const handleUpgrade = (type: 'standard' | 'unlimited') => {
    // In a real app, this would integrate with Stripe or another payment processor
    upgradeSubscription(type);
    onClose();
    alert(`Upgraded to ${type === 'standard' ? 'Standard' : 'Unlimited'} plan! (This is a demo - no actual payment processed)`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 border border-slate-700">
        <div className="text-center">
          <SparklesIcon className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Ready to upgrade your account?
          </h2>
          <p className="text-slate-300 mb-6">
            Choose from our Standard or Unlimited plans to continue creating professional headshots without watermarks.
          </p>
          
          <button
            onClick={onGoToPricing}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 transition-colors font-semibold text-lg mb-4"
          >
            View Pricing Plans
          </button>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="font-semibold text-slate-200">Standard</div>
              <div className="text-indigo-400 font-bold">$10/month</div>
              <div className="text-slate-400">5 headshots</div>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500 rounded-lg p-3">
              <div className="font-semibold text-slate-200">Unlimited</div>
              <div className="text-indigo-400 font-bold">$15/month</div>
              <div className="text-slate-400">Unlimited</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
