#!/bin/bash

# Workflow Diagrams API Server Startup Script
# This script starts the Python Flask API server for diagram generation

echo "🚀 Starting Workflow Diagrams API Server"
echo "=========================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Check if PlantUML is available
if ! command -v plantuml &> /dev/null; then
    echo "❌ PlantUML is not installed"
    echo "   Please install PlantUML: brew install plantuml"
    exit 1
fi

# Check if required Python packages are available
echo "🔍 Checking Python dependencies..."
python3 -c "import flask, flask_cors" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Installing required Python packages..."
    pip3 install flask flask-cors
fi

# Kill any existing process on port 6060
echo "🔧 Checking for existing processes on port 6060..."
if lsof -ti:6060 > /dev/null 2>&1; then
    echo "🔪 Killing existing processes on port 6060..."
    lsof -ti:6060 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start the API server
echo "🌐 Starting API server on port 6060..."
echo "📊 Health Check: http://localhost:6060/api/health"
echo "📋 Available Endpoints:"
echo "   - GET  /api/health"
echo "   - GET  /api/diagrams/list"
echo "   - POST /api/diagrams/generate"
echo "   - GET  /api/diagrams/source/<type>"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=" * 50

cd "$(dirname "$0")"
python3 diagram_server.py
