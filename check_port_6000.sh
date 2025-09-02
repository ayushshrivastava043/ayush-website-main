#!/bin/bash

# 🔍 Port 6000 Availability Checker
# This script checks if port 6000 is available for the Enhanced AI Portal

echo "🔍 Checking Port 6000 Availability for Enhanced AI Portal"
echo "=========================================================="

# Check if port 6000 is in use
if lsof -Pi :6000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 6000 is currently in use by:"
    lsof -i :6000
    echo ""
    echo "💡 You need to stop the service using port 6000 first."
    echo "   Or we can use a different port for the AI Portal."
    echo ""
    echo "🔧 To see what's using the port:"
    echo "   lsof -i :6000"
    echo ""
    echo "🛑 To stop a process using the port:"
    echo "   kill -9 <PID>"
    exit 1
else
    echo "✅ Port 6000 is available!"
    echo ""
    echo "🚀 Ready to start Enhanced AI Portal on port 6000"
    echo ""
    echo "🌐 Port Configuration Summary:"
    echo "   - Website services: 4000s"
    echo "   - Chatbot services: 5000s"
    echo "   - AI Portal: 6000 (NEW - This Project)"
    echo ""
    echo "📱 Access URLs:"
    echo "   - Main Portal: http://localhost:6000/"
    echo "   - Enhanced Portal: http://localhost:6000/enhanced"
    echo "   - API Health: http://localhost:6000/api/health"
    echo ""
    echo "🎯 You can now start the Enhanced AI Portal!"
    echo "   python3 app.py"
    echo ""
    echo "=========================================================="
fi


