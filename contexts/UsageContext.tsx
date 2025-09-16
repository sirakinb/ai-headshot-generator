import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

interface UsageContextType {
  generationsUsed: number;
  generationsRemaining: number;
  maxGenerations: number;
  subscriptionType: 'free' | 'standard' | 'unlimited';
  canGenerate: boolean;
  incrementUsage: () => Promise<void>;
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

  // Helper function to check if we need to reset monthly usage
  const shouldResetUsage = (lastResetDate?: string) => {
    if (!lastResetDate) return false;
    
    const lastReset = new Date(lastResetDate);
    const now = new Date();
    
    // Check if we're in a different month/year
    return (
      lastReset.getMonth() !== now.getMonth() || 
      lastReset.getFullYear() !== now.getFullYear()
    );
  };

  // Load usage data from Clerk user metadata and check subscription status
  useEffect(() => {
    if (isSignedIn && user && has) {
      // Check Clerk billing for subscription status first
      console.log('Checking subscription status...');
      console.log('User object:', user);
      console.log('Has function available:', !!has);
      
      let currentSubscription: 'free' | 'standard' | 'unlimited' = 'free';
      
      // Try different possible plan keys
      const unlimitedPlanKeys = ['unlimited_plan', 'unlimited_ai_headshots', 'Unlimited AI Headshots'];
      const standardPlanKeys = ['standard_plan', 'standard-plan'];
      
      let foundPlan = false;
      for (const planKey of unlimitedPlanKeys) {
        if (has({ plan: planKey })) {
          console.log(`Found unlimited plan with key: ${planKey}`);
          currentSubscription = 'unlimited';
          foundPlan = true;
          break;
        }
      }
      
      if (!foundPlan) {
        for (const planKey of standardPlanKeys) {
          if (has({ plan: planKey })) {
            console.log(`Found standard plan with key: ${planKey}`);
            currentSubscription = 'standard';
            foundPlan = true;
            break;
          }
        }
      }
      
      if (!foundPlan) {
        console.log('No paid plan found, defaulting to free');
      }
      
      console.log('Final subscription type:', currentSubscription);
      setSubscriptionType(currentSubscription);

      // Get usage data from Clerk user metadata (server-side, cross-device)
      const savedUsage = user.unsafeMetadata?.generationsUsed as number;
      const lastResetDate = user.unsafeMetadata?.lastResetDate as string;
      
      // For Standard plan, check if we need monthly reset
      if (currentSubscription === 'standard' && shouldResetUsage(lastResetDate)) {
        // Reset usage for new month
        setGenerationsUsed(0);
        // Update Clerk metadata with reset
        user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            generationsUsed: 0,
            lastResetDate: new Date().toISOString(),
          },
        }).then(() => user.reload()).catch(console.error);
      } else if (typeof savedUsage === 'number') {
        setGenerationsUsed(savedUsage);
      }
    }
  }, [isSignedIn, user, has]);

  // Helper function to get max generations based on subscription
  const getMaxGenerations = () => {
    if (subscriptionType === 'unlimited') return Infinity;
    if (subscriptionType === 'standard') return 5;
    return 1; // Free tier
  };

  const maxGenerations = getMaxGenerations();
  const generationsRemaining = maxGenerations === Infinity ? Infinity : maxGenerations - generationsUsed;

  const canGenerate = () => {
    if (subscriptionType === 'unlimited') return true;
    return generationsUsed < maxGenerations;
  };

  const incrementUsage = async () => {
    const newCount = generationsUsed + 1;
    setGenerationsUsed(newCount);
    
    // Save to Clerk user metadata (server-side, cross-device)
    if (user) {
      try {
        const updateData = {
          ...user.unsafeMetadata,
          generationsUsed: newCount,
        };

        // For Standard plan, also track when usage started (for monthly reset)
        if (subscriptionType === 'standard' && !user.unsafeMetadata?.lastResetDate) {
          updateData.lastResetDate = new Date().toISOString();
        }

        // Try the correct Clerk API method - using unsafeMetadata for client-side updates
        await user.update({
          unsafeMetadata: updateData,
        });
        // Force reload to get updated data
        await user.reload();
        
      } catch (error) {
        console.error('Failed to update usage count:', error);
        console.error('Error details:', error);
        // Revert on error
        setGenerationsUsed(prev => prev - 1);
      }
    }
  };

  const resetUsage = async () => {
    setGenerationsUsed(0);
    
    // Also update Clerk metadata
    if (user) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            generationsUsed: 0,
            lastResetDate: new Date().toISOString(),
          },
        });
        
        // Force reload to get updated data
        await user.reload();
        
      } catch (error) {
        console.error('Failed to reset usage count:', error);
        console.error('Error details:', error);
      }
    }
  };

  const upgradeSubscription = (type: 'standard' | 'unlimited') => {
    setSubscriptionType(type);
    // In a real app, this would integrate with a payment processor
  };

  return (
    <UsageContext.Provider
      value={{
        generationsUsed,
        generationsRemaining,
        maxGenerations,
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
