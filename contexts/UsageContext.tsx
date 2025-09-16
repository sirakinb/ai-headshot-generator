import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

interface UsageContextType {
  generationsUsed: number;
  subscriptionType: 'free' | 'standard' | 'unlimited';
  canGenerate: boolean;
  incrementUsage: () => void;
  resetUsage: () => void;
  upgradeSubscription: (type: 'standard' | 'unlimited') => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
};

interface UsageProviderProps {
  children: React.ReactNode;
}

export const UsageProvider: React.FC<UsageProviderProps> = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const { has } = useAuth();
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'standard' | 'unlimited'>('free');

  // Load usage data from localStorage and check subscription status
  useEffect(() => {
    if (isSignedIn && user && has) {
      const userId = user.id;
      const savedUsage = localStorage.getItem(`usage_${userId}`);
      
      if (savedUsage) {
        setGenerationsUsed(parseInt(savedUsage, 10));
      }
      
      // Check Clerk billing for subscription status
      // Note: Plan key must use underscores, not hyphens
      if (has({ plan: 'unlimited_plan' })) {
        setSubscriptionType('unlimited');
      } else if (has({ plan: 'standard_plan' })) {
        setSubscriptionType('standard');
      } else {
        setSubscriptionType('free');
      }
    }
  }, [isSignedIn, user, has]);

  // Save usage data to localStorage whenever it changes
  useEffect(() => {
    if (isSignedIn && user) {
      const userId = user.id;
      localStorage.setItem(`usage_${userId}`, generationsUsed.toString());
    }
  }, [generationsUsed, isSignedIn, user]);

  const canGenerate = () => {
    if (subscriptionType === 'unlimited') return true;
    if (subscriptionType === 'standard') return generationsUsed < 5; // 5 generations per month
    return generationsUsed < 1; // Free tier: only 1 generation
  };

  const incrementUsage = () => {
    setGenerationsUsed(prev => prev + 1);
  };

  const resetUsage = () => {
    setGenerationsUsed(0);
  };

  const upgradeSubscription = (type: 'standard' | 'unlimited') => {
    setSubscriptionType(type);
    // In a real app, this would integrate with a payment processor
  };

  return (
    <UsageContext.Provider
      value={{
        generationsUsed,
        subscriptionType,
        canGenerate: canGenerate(),
        incrementUsage,
        resetUsage,
        upgradeSubscription,
      }}
    >
      {children}
    </UsageContext.Provider>
  );
};
