# Production Deployment Guide

This guide will walk you through deploying your AI Headshot Generator to production.

## 🎯 **Pre-Production Checklist**

### ✅ **Code & Features Complete**
- [x] Authentication working (Clerk)
- [x] Billing system functional (Standard & Unlimited plans)
- [x] Watermarking for free users
- [x] Usage tracking and limits
- [x] Gemini API integration
- [x] Drag & drop file uploads

### ✅ **Environment Setup**
- [ ] Production Clerk instance configured
- [ ] Production Gemini API key
- [ ] Production Stripe account connected
- [ ] Domain name purchased/configured

## 🔧 **Step 1: Environment Variables**

### **Current Development Variables:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...  # Development key
GEMINI_API_KEY=AIzaSyCNPcQS2RfBy8XJiq5Q6uFQKi7MLP2Rqno
```

### **Production Variables Needed:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...  # Production key from Clerk
CLERK_SECRET_KEY=sk_live_...            # Production secret key
GEMINI_API_KEY=your_production_api_key  # Production Gemini key
```

## 🏗️ **Step 2: Clerk Production Setup**

### **Create Production Instance:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a **new application** for production (or switch existing to production)
3. Configure **Production Domain** (e.g., `headshots.pentridge.media`)

### **Billing Setup:**
1. Navigate to **Billing Settings**
2. Connect your **live Stripe account** (not test mode)
3. Create production plans:
   - **Standard Plan**: `standard_plan` key, $10/month
   - **Unlimited Plan**: `unlimited_plan` key, $15/month

### **Webhook Configuration:**
```bash
# Production webhook endpoint
https://your-domain.com/api/webhooks/clerk

# Subscribe to events:
- subscription.created
- subscription.updated  
- subscription.active
- subscriptionItem.active
- subscriptionItem.canceled
```

## 🌐 **Step 3: Domain & Hosting Setup**

### **Recommended: Vercel Deployment**

1. **Connect GitHub Repository:**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

3. **Custom Domain:**
   - Add your domain in Vercel dashboard
   - Configure DNS records as instructed

### **Environment Variables in Vercel:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
GEMINI_API_KEY=your_production_key
```

## 🔐 **Step 4: Security & Performance**

### **Security Checklist:**
- [ ] API keys are environment variables (not hardcoded)
- [ ] Clerk production keys configured
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured properly

### **Performance Optimizations:**
- [ ] Images optimized for web
- [ ] Build optimized (`npm run build`)
- [ ] CDN configured (Vercel handles this)

## 💳 **Step 5: Payment Processing**

### **Stripe Production Setup:**
1. **Activate Stripe Account:**
   - Complete business verification
   - Add bank account details
   - Enable live payments

2. **Connect to Clerk:**
   - In Clerk Dashboard → Billing Settings
   - Connect your live Stripe account
   - Test a subscription flow

### **Tax Configuration:**
- Configure tax rates in Stripe
- Set up tax collection as needed

## 📊 **Step 6: Monitoring & Analytics**

### **Set Up Monitoring:**
1. **Vercel Analytics** (built-in)
2. **Clerk Analytics** (user signups, usage)
3. **Stripe Dashboard** (payments, subscriptions)
4. **Google Analytics** (optional)

### **Error Tracking:**
```bash
# Optional: Add Sentry for error tracking
npm install @sentry/react
```

## 🧪 **Step 7: Production Testing**

### **Test Complete User Journey:**
1. **Sign up** with real email
2. **Generate free headshot** (should have watermark)
3. **Subscribe to Standard plan** with real payment method
4. **Generate paid headshots** (no watermark)
5. **Upgrade to Unlimited** (test proration)
6. **Cancel subscription** (test flow)

### **Test Payment Scenarios:**
- Successful payments
- Failed payments
- Subscription cancellations
- Plan upgrades/downgrades

## 🚀 **Step 8: Go Live!**

### **Final Launch Steps:**
1. **Update Clerk to production mode**
2. **Switch Gemini to production API key**
3. **Deploy final version to Vercel**
4. **Test all functionality one more time**
5. **Monitor for first 24 hours**

### **Launch Announcement:**
- Social media posts
- Email to beta testers
- Product Hunt launch (optional)

## 📈 **Post-Launch Monitoring**

### **Week 1 Checklist:**
- [ ] Monitor error rates
- [ ] Check payment success rates
- [ ] Review user feedback
- [ ] Monitor API usage/costs

### **Ongoing Maintenance:**
- Weekly billing reports
- Monthly user analytics
- API usage monitoring
- Customer support setup

## 💰 **Cost Estimates**

### **Monthly Operational Costs:**
- **Vercel Hosting**: $0-20/month (depending on usage)
- **Clerk Authentication**: $25/month (1000+ MAUs)
- **Gemini API**: Variable (pay per use)
- **Stripe Fees**: 2.9% + 30¢ per transaction
- **Domain**: $10-15/year

### **Revenue Projections:**
- **Break-even**: ~10 Standard subscribers or 7 Unlimited subscribers
- **Target**: 100+ subscribers = $1000-1500/month revenue

---

## 🆘 **Need Help?**

- **Clerk Support**: [clerk.com/support](https://clerk.com/support)
- **Vercel Support**: [vercel.com/help](https://vercel.com/help)
- **Stripe Support**: [stripe.com/support](https://stripe.com/support)

---

**🎉 You're ready for production! Your AI Headshot Generator is about to help thousands of professionals create amazing headshots!**
