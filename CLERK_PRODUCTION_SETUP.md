# Clerk Production Setup Guide

## 🎯 **Step-by-Step Clerk Production Setup**

### **1. Create Production Application**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Click "Add application" 
3. **Application name**: `AI Headshot Generator - Production`
4. **Framework**: React
5. **Environment**: Production

### **2. Configure Domain**
1. In your new production app, go to **Settings → Domains**
2. Add your production domain: `headshots.pentridgemedia.com`
3. **Important**: Remove any localhost/development domains

### **3. Get Production API Keys**
1. Go to **API Keys** section
2. Copy these keys (you'll need them for Vercel):
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

### **4. Configure Authentication Settings**
1. **Sign-up/Sign-in**: Enable email + password
2. **Social logins**: Configure if desired (Google, GitHub, etc.)
3. **Email settings**: Configure production email provider

### **5. Set Up Billing (Critical!)**
1. Go to **Billing** section in your production Clerk app
2. **Connect Stripe**: Use your LIVE Stripe account (not test)
3. **Create Plans**:
   
   **Standard Plan:**
   - Plan name: `Standard Plan`
   - Plan key: `standard_plan` (must use underscores!)
   - Price: $10/month
   - Features: `5 headshots per month, No watermarks`
   
   **Unlimited Plan:**
   - Plan name: `Unlimited Plan`  
   - Plan key: `unlimited_plan` (must use underscores!)
   - Price: $15/month
   - Features: `Unlimited headshots, No watermarks`

### **6. Configure Webhooks (Optional but Recommended)**
1. Go to **Webhooks** section
2. Add endpoint: `https://headshots.pentridgemedia.com/api/webhooks/clerk`
3. Subscribe to events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`

### **7. Test Your Setup**
1. **Test sign-up** with a real email
2. **Test billing** with Stripe test cards in live mode
3. **Verify** all features work

---

## ⚠️ **Important Notes**

- **Keep your development Clerk app separate** - don't modify it
- **Plan keys MUST use underscores** (`unlimited_plan`, not `unlimited-plan`)
- **Use LIVE Stripe account** for production billing
- **Test everything** before going live

---

## 🔑 **Next Steps After Clerk Setup**

1. **Update Vercel environment variables** with new production keys
2. **Test billing flow** end-to-end
3. **Deploy and test** complete user journey

Let me know when you have your production Clerk keys ready!
