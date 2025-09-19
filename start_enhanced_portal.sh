#!/bin/bash

# 🚀 Enhanced AI Portal - Startup Script
# This script starts the enhanced AI portal with all features on port 6000

echo "🚀 Starting Enhanced AI Portal..."
echo "=================================="
echo "🌐 Port: 6000 (New dedicated port)"
echo "=================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing Flask..."
    pip install flask flask-cors flask-socketio
fi

# Check if required modules exist
echo "🔍 Checking required modules..."
if [ ! -d "core" ]; then
    echo "❌ Core modules not found. Please ensure the AI Portal structure is complete."
    exit 1
fi

# Check if port 6000 is available
echo "🔍 Checking if port 6000 is available..."
if lsof -Pi :6000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 6000 is already in use. Please stop the service using port 6000 first."
    echo "   You can check what's using it with: lsof -i :6000"
    exit 1
else
    echo "✅ Port 6000 is available"
fi

# Start the enhanced portal
echo "🚀 Starting Enhanced AI Portal on port 6000..."
echo "   - Main Portal: http://localhost:6000/"
echo "   - Enhanced Portal: http://localhost:6000/enhanced"
echo "   - API Health: http://localhost:6000/api/health"
echo ""
echo "🌐 This is a NEW PORT (6000) - separate from your other services!"
echo "   - Website services: 4000s"
echo "   - Chatbot services: 5000s"
echo "   - AI Portal: 6000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================="

# Start the Flask application
python3 App.py

echo ""
echo "👋 Enhanced AI Portal stopped."
