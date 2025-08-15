#!/bin/bash

# Install script for local development and testing

set -e

echo "🚀 Installing seanlangbrown-ai-tools locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14.0.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14.0.0 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Check if we're in the package directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the package directory."
    exit 1
fi

# Install dependencies (if any)
echo "📦 Installing dependencies..."
npm install

# Link the package globally for local testing
echo "🔗 Linking package globally..."
npm link

echo "✅ Installation completed successfully!"
echo ""
echo "Available commands:"
echo "  aitools devcontainers  - Set up devcontainer configuration"
echo "  aitools claude-md      - Set up Claude configuration" 
echo "  aitools help           - Show help"
echo ""
echo "Alternative commands:"
echo "  setup-claude-devcontainers"
echo "  setup-claude-md"
echo ""
echo "💡 To test the installation:"
echo "  1. Navigate to a git repository: cd /path/to/your/project"
echo "  2. Run: aitools devcontainers"
echo "  3. Run: aitools claude-md"
echo ""
echo "🧹 To uninstall: npm unlink -g seanlangbrown-ai-tools"
