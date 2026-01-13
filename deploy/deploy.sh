#!/bin/bash

# RPP Auto - Manual Deployment Script
# This script can be run manually if GitHub Actions is not used

set -e

echo "🚀 RPP Auto - Deployment Script"
echo "================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "Run: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Stop existing container
echo "🛑 Stopping existing container..."
docker stop rpp-auto-api 2>/dev/null || true
docker rm rpp-auto-api 2>/dev/null || true

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t rpp-auto-backend .

# Start container
echo "▶️  Starting container..."
docker run -d \
  --name rpp-auto-api \
  -p 8000:8000 \
  --env-file .env \
  --restart unless-stopped \
  rpp-auto-backend

# Wait for startup
echo "⏳ Waiting for container to start..."
sleep 5

# Check status
if docker ps | grep -q rpp-auto-api; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container Status:"
    docker ps | grep rpp-auto-api
    echo ""
    echo "🔗 API Documentation: http://localhost:8000/docs"
else
    echo "❌ Deployment failed"
    echo "📋 Container logs:"
    docker logs rpp-auto-api
    exit 1
fi

echo ""
echo "🎉 Deployment completed!"
