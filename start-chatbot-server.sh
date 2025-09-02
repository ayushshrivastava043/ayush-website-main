#!/bin/bash

# 🚀 Production Chatbot Server Startup Script
# Connects to Agentic AI system on port 5000

echo "🚀 Starting Production Chatbot Server..."
echo "📍 Port: 5000"
echo "🤖 Backend: Agentic AI System"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if port 5000 is available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Port 5000 is already in use. Stopping existing process..."
    lsof -ti:5000 | xargs kill -9
    sleep 2
fi

# Start the server
echo "✅ Starting Agentic Chatbot Server on port 5000..."
node agentic-chatbot-server.js

echo ""
echo "🎉 Server started successfully!"
echo "🌐 Chatbot will be available at: http://localhost:5000"
echo "🔗 API Endpoint: http://localhost:5000/api/chat"
echo ""
echo "Press Ctrl+C to stop the server"
