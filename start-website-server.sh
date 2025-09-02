#!/bin/bash

# Universal Website Server Launcher
# This script can be run from anywhere and will find the correct paths

echo "🚀 Universal Website Server Launcher"
echo "====================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📍 Script location: $SCRIPT_DIR"

# Define the website directory
WEBSITE_DIR="$SCRIPT_DIR"
SERVER_FILE="$WEBSITE_DIR/server/unified-server.js"

echo "🔍 Looking for server files..."
echo "   Website directory: $WEBSITE_DIR"
echo "   Server file: $SERVER_FILE"

# Check if the website directory exists
if [ ! -d "$WEBSITE_DIR" ]; then
    echo "❌ Error: Website directory not found at $WEBSITE_DIR"
    exit 1
fi

# Check if the server file exists
if [ ! -f "$SERVER_FILE" ]; then
    echo "❌ Error: Server file not found at $SERVER_FILE"
    echo "   Available files in server directory:"
    ls -la "$WEBSITE_DIR/server/" 2>/dev/null || echo "   Server directory not found"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

echo "✅ All checks passed!"
echo ""

# Change to the website directory
cd "$WEBSITE_DIR"
echo "📁 Changed to directory: $(pwd)"

# Display what we're serving
echo ""
echo "📋 Server Information:"
echo "   Main directory: $(pwd)"
echo "   Index file: $(pwd)/index.html"
echo "   Assets: $(pwd)/assets"
echo "   Server: $(pwd)/server/unified-server.js"
echo ""

# Kill any existing processes on port 4000
echo "🔧 Checking for existing processes on port 4000..."
if lsof -ti:4000 > /dev/null 2>&1; then
    echo "🔪 Killing existing processes on port 4000..."
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start the server
echo "🌐 Starting server..."
echo "   Server URL: http://localhost:4000/"
echo "   Press Ctrl+C to stop"
echo ""

# Run the server
node server/unified-server.js

echo ""
echo "🛑 Server stopped" 