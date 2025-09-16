# Clerk Billing Setup Guide

This guide will walk you through setting up Clerk billing for the AI Headshot Generator.

## 1. Enable Billing in Clerk Dashboard

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Billing Settings**
3. Follow the setup wizard to enable billing
4. Choose your payment gateway:
   - **Development**: Use Clerk development gateway for testing
   - **Production**: Connect your Stripe account

## 2. Create Plans

Navigate to the **Plans** page in Clerk Dashboard and create the following plans:

### Standard Plan
- **Name**: `standard-plan` 
- **Key**: `standard_plan` (this matches the code in `UsageContext.tsx`)
- **Display Name**: "Standard Plan"
- **Price**: $10.00/month
- **Billing Interval**: Monthly
- **Description**: "5 AI headshots every month for $10."
- **Publicly Available**: Yes

### Features to Add (Standard):
- 5 headshots per month
- No watermarks
- All style options
- High-quality downloads

### Unlimited Plan
- **Name**: `unlimited-plan`
- **Key**: `unlimited_plan` (this matches the code in `UsageContext.tsx`)
- **Display Name**: "Unlimited Headshots"
- **Price**: $15.00/month
- **Billing Interval**: Monthly
- **Description**: "Unlimited AI headshots every month for just $15."
- **Publicly Available**: Yes

### Features to Add (Unlimited):
- Unlimited generations
- No watermarks
- All style options
- Priority processing
- High-resolution downloads

## 3. Update Plan Names in Code

If you use different plan names in Clerk Dashboard, update the plan names in `/contexts/UsageContext.tsx`:

```typescript
// Lines 45-51: Update with your actual plan names
if (has({ plan: 'unlimited_plan' })) {
  setSubscriptionType('unlimited');
} else if (has({ plan: 'standard_plan' })) {
  setSubscriptionType('standard');
} else {
  setSubscriptionType('free');
}
```

## 4. Test the Integration

### Development Testing:
1. Use the Clerk development gateway
2. Sign up a test user
3. Try the pricing flow
4. Use test payment methods

### Test Payment Methods (Development):
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`

## 5. Webhook Setup (Optional but Recommended)

To sync subscription changes in real-time, set up webhooks:

1. In Clerk Dashboard, go to **Webhooks**
2. Create a new webhook endpoint
3. Subscribe to these events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.active`
   - `subscriptionItem.active`
   - `subscriptionItem.canceled`
   - `subscriptionItem.ended`

### Example Webhook Handler:
```typescript
// pages/api/webhooks/clerk.ts
import { Webhook } from 'svix'

export default async function handler(req, res) {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  
  try {
    const payload = webhook.verify(req.body, req.headers)
    
    switch (payload.type) {
      case 'subscriptionItem.active':
        // User subscribed - update your database
        break
      case 'subscriptionItem.canceled':
        // User canceled - handle accordingly
        break
    }
    
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).json({ error: 'Invalid webhook' })
  }
}
```

## 6. Production Deployment

1. Connect your Stripe account in Clerk Dashboard
2. Set up production webhook endpoints
3. Update environment variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

## 7. Testing Checklist

- [ ] User can sign up/sign in
- [ ] Free user gets 1 generation with watermark
- [ ] Pricing page loads correctly
- [ ] Subscription flow works
- [ ] Subscribed users get unlimited generations
- [ ] Subscribed users get no watermarks
- [ ] Usage tracking persists across sessions

## 8. Monitoring

Monitor your billing through:
- Clerk Dashboard analytics
- Stripe Dashboard (for payments)
- Your application logs

## Support

If you encounter issues:
1. Check Clerk documentation: https://clerk.com/docs/billing
2. Review webhook logs in Clerk Dashboard
3. Check browser console for errors
4. Contact Clerk support if needed

---

**Note**: This implementation uses localStorage for usage tracking. For production, consider using a database for more reliable tracking across devices.
