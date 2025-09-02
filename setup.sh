#!/bin/bash

# 🚀 Chatbot Beta - Setup Script
# This script sets up the development environment

echo "🚀 Setting up Chatbot Beta Development Environment..."
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip first."
    exit 1
fi

echo "✅ pip3 found: $(pip3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "🔧 Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "🔧 Installing Python dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file from template..."
    cp .env.template .env
    echo "⚠️  Please edit .env file with your API keys"
else
    echo "✅ .env file already exists"
fi

# Create necessary directories
echo "🔧 Creating necessary directories..."
mkdir -p logs
mkdir -p backups
mkdir -p temp

# Set permissions
echo "🔧 Setting file permissions..."
chmod +x setup.sh
chmod +x deploy.sh
chmod +x backup.sh

echo ""
echo "🎉 Setup Complete!"
echo "=================================================="
echo "📁 Project Structure:"
echo "   ├── Backend: Flask application"
echo "   ├── Frontend: HTML/CSS/JS dashboard"
echo "   ├── Configs: YAML configuration files"
echo "   ├── Core: AI and chatbot logic"
echo "   └── Utils: Helper functions"
echo ""
echo "🚀 To start the application:"
echo "   1. Activate virtual environment: source venv/bin/activate"
echo "   2. Run: python tester_dashboard.py"
echo "   3. Open: http://localhost:5001"
echo ""
echo "🔧 To install additional packages:"
echo "   pip install package_name"
echo ""
echo "📚 Documentation: PROJECT_STRUCTURE.md"
echo "=================================================="

