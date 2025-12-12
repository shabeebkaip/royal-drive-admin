#!/bin/bash

# Royal Drive Admin Deployment Script
# This script handles the deployment process for the application

set -e

echo "🚀 Starting deployment process..."

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build the application
echo "🔨 Building the application..."
pnpm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 reload ecosystem.config.cjs --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

echo "✅ Deployment completed successfully!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs royal-drive-admin"
