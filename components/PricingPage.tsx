import React from 'react';
import { PricingTable, useUser, useClerk } from '@clerk/clerk-react';
import { SparklesIcon } from './Icons';
import { useUsage } from '../contexts/UsageContext';

interface PricingPageProps {
  onBack: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack }) => {
  const { isSignedIn } = useUser();
  const { subscriptionType } = useUsage();
  const clerk = useClerk();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-slate-400 hover:text-slate-300 transition-colors mb-6"
          >
            ← Back to Generator
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="w-8 h-8 text-indigo-400 mr-3" />
            <h1 className="text-3xl font-bold text-slate-100">Choose Your Plan</h1>
          </div>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upgrade to unlimited professional headshots with no watermarks. 
            Perfect for professionals who need regular updates to their image.
          </p>
        </div>

        {/* Plan Comparison */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
          <h3 className="text-xl font-semibold text-slate-100 mb-4 text-center">
            Choose the plan that fits your needs:
          </h3>
          <p className="text-slate-400 text-center">
            Both plans include no watermarks, all style options, and high-quality downloads.
          </p>
        </div>

        {/* Current Subscription Status */}
        {isSignedIn && subscriptionType !== 'free' && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h3 className="text-xl font-semibold text-slate-100 mb-4 text-center">
              Your Current Plan
            </h3>
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500 rounded-lg px-6 py-4">
                <SparklesIcon className="w-6 h-6 text-indigo-400" />
                <div>
                  <div className="font-semibold text-slate-100 capitalize">
                    {subscriptionType} Plan
                  </div>
                  <div className="text-slate-400 text-sm">
                    {subscriptionType === 'standard' ? '5 headshots per month' : 'Unlimited headshots'}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <p className="text-slate-300">
                  Need to make changes to your subscription?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    onClick={() => {
                      // Open Clerk's user profile modal directly
                      clerk.openUserProfile();
                    }}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors font-medium"
                  >
                    Manage Subscription
                  </button>
                  <p className="text-slate-400 text-xs">
                    Cancel anytime • No questions asked
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clerk Pricing Table */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <PricingTable />
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">What's the difference between Standard and Unlimited plans?</h4>
              <p className="text-slate-400">The Standard plan gives you 5 professional headshots per month for $10, while the Unlimited plan provides unlimited headshots for $15/month. Both plans include no watermarks, all style options, and high-quality downloads.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">How many headshots do I get with each plan?</h4>
              <p className="text-slate-400"><strong>Standard:</strong> 5 headshots per month. <strong>Unlimited:</strong> Generate as many headshots as you need with no limits. Your usage resets each month for Standard plan subscribers.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">Do both plans include watermark-free images?</h4>
              <p className="text-slate-400">Yes! Both Standard and Unlimited plans provide completely watermark-free professional headshots. Only the free tier includes watermarks.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">Can I upgrade from Standard to Unlimited?</h4>
              <p className="text-slate-400">Absolutely! You can upgrade anytime. You'll be charged the prorated difference immediately and get unlimited access right away. Any unused time on your Standard plan will be credited to your account.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">What happens if I exceed my Standard plan limit?</h4>
              <p className="text-slate-400">Once you've used your 5 monthly headshots on the Standard plan, you'll need to wait until your next billing cycle or upgrade to the Unlimited plan to continue generating headshots.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">How do I cancel my subscription?</h4>
              <p className="text-slate-400">You can cancel anytime by clicking your profile picture in the top-right corner, then "Manage account" → "Billing" tab. Or use the "Manage Subscription" button above if you're currently subscribed. No questions asked, cancel instantly.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">What happens when I cancel?</h4>
              <p className="text-slate-400">You'll continue to have full access to your plan benefits until the end of your current billing period. After that, your account will revert to the free tier (1 headshot with watermark).</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-400">We accept all major credit cards and debit cards through our secure payment processor powered by Stripe.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">Do you offer refunds?</h4>
              <p className="text-slate-400">We offer a satisfaction guarantee. If you're not happy with your headshots within the first 7 days of subscribing, contact us for a full refund.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">Which plan should I choose?</h4>
              <p className="text-slate-400">Choose <strong>Standard</strong> if you need occasional updates (5 headshots/month is perfect for LinkedIn, resume, etc.). Choose <strong>Unlimited</strong> if you're a content creator, entrepreneur, or frequently update your professional image.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-slate-400">
            Have questions? Contact us at{' '}
            <a href="mailto:info@pentridgemedia.com" className="text-indigo-400 hover:text-indigo-300">
              info@pentridgemedia.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
