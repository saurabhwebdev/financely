#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI not found, installing..."
    npm install -g vercel
fi

echo "Building project..."
npm run build

echo "Deploying to Vercel..."
vercel --prod

echo "Deployment finished!" 