#!/bin/bash

# Production Deployment Script
echo "🚀 Starting production deployment..."

# Check if we're on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Must be on main branch for production deployment"
  echo "Current branch: $BRANCH"
  exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ You have uncommitted changes. Please commit or stash them first."
  git status --short
  exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"

# Check if environment variables are set
echo "🔍 Checking environment variables..."
if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ]; then
  echo "⚠️  Warning: VITE_CLERK_PUBLISHABLE_KEY not set in local environment"
  echo "   Make sure it's set in Vercel dashboard"
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "⚠️  Warning: GEMINI_API_KEY not set in local environment"
  echo "   Make sure it's set in Vercel dashboard"
fi

# Commit and push changes
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Production deployment - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://headshots.pentridgemedia.com"
echo "📊 Check deployment status at: https://vercel.com/dashboard"
