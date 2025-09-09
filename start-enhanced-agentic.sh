#!/bin/bash

# Enhanced Agentic Chatbot Startup Script
# LangGraph-based autonomous AI assistant system

echo "🚀 Starting Enhanced Agentic Chatbot (LangGraph)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python 3 is installed
check_python() {
    if command -v python3 &> /dev/null; then
        print_success "Python 3 is installed: $(python3 --version)"
    else
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
}

# Check if pip is installed
check_pip() {
    if command -v pip3 &> /dev/null; then
        print_success "pip3 is installed: $(pip3 --version)"
    else
        print_error "pip3 is not installed. Please install pip3."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing Enhanced Agentic Chatbot dependencies..."
    
    if [ -f "requirements-enhanced-agentic.txt" ]; then
        pip3 install -r requirements-enhanced-agentic.txt
        if [ $? -eq 0 ]; then
            print_success "Dependencies installed successfully"
        else
            print_error "Failed to install dependencies"
            exit 1
        fi
    else
        print_warning "requirements-enhanced-agentic.txt not found, installing basic dependencies..."
        pip3 install langgraph langchain langchain-core langchain-community langchain-openai transformers torch accelerate flask flask-cors openai
    fi
}

# Check environment variables
check_environment() {
    print_status "Checking environment configuration..."
    
    # Check for OpenAI API key
    if [ -z "$OPENAI_API_KEY" ]; then
        print_warning "OPENAI_API_KEY not set. Will use Hugging Face models as fallback."
    else
        print_success "OpenAI API key found"
    fi
    
    # Check for Hugging Face API key
    if [ -z "$HUGGINGFACE_API_KEY" ]; then
        print_warning "HUGGINGFACE_API_KEY not set. Will use local models."
    else
        print_success "Hugging Face API key found"
    fi
    
    # Set default environment variables if not set
    export HOST=${HOST:-"localhost"}
    export PORT=${PORT:-"5001"}
    export DEBUG=${DEBUG:-"False"}
    export DB_PATH=${DB_PATH:-"agentic_chatbot.db"}
    export CHECKPOINT_PATH=${CHECKPOINT_PATH:-"agentic_checkpoints.db"}
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    # Create data directory
    mkdir -p data
    mkdir -p logs
    mkdir -p checkpoints
    
    print_success "Directories created"
}

# Check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        print_warning "Port $port is already in use. Trying to find alternative port..."
        
        # Try ports 5002-5010
        for ((i=5002; i<=5010; i++)); do
            if ! lsof -Pi :$i -sTCP:LISTEN -t >/dev/null; then
                export PORT=$i
                print_success "Using port $i instead"
                break
            fi
        done
        
        if [ $i -gt 5010 ]; then
            print_error "No available ports found in range 5001-5010"
            exit 1
        fi
    else
        print_success "Port $port is available"
    fi
}

# Start the enhanced agentic chatbot
start_chatbot() {
    print_status "Starting Enhanced Agentic Chatbot..."
    
    # Check if the main script exists
    if [ ! -f "enhanced-agentic-chatbot-langgraph.py" ]; then
        print_error "enhanced-agentic-chatbot-langgraph.py not found"
        exit 1
    fi
    
    # Start the chatbot
    print_success "Starting Enhanced Agentic Chatbot on http://$HOST:$PORT"
    print_status "Features enabled:"
    echo "  🤖 LangGraph Workflows"
    echo "  📊 Stateful Conversations"
    echo "  🔄 Multi-Agent System"
    echo "  💾 Persistent Memory"
    echo "  🛠️ Tool Integration"
    echo "  🔍 Error Handling"
    echo ""
    print_status "Press Ctrl+C to stop the server"
    echo ""
    
    # Run the chatbot
    python3 enhanced-agentic-chatbot-langgraph.py
}

# Main execution
main() {
    echo "=========================================="
    echo "🤖 Enhanced Agentic Chatbot (LangGraph)"
    echo "=========================================="
    echo ""
    
    # Run checks
    check_python
    check_pip
    check_environment
    create_directories
    check_port $PORT
    
    # Install dependencies
    install_dependencies
    
    echo ""
    print_status "All checks passed. Starting Enhanced Agentic Chatbot..."
    echo ""
    
    # Start the chatbot
    start_chatbot
}

# Handle script interruption
trap 'echo ""; print_warning "Shutting down Enhanced Agentic Chatbot..."; exit 0' INT

# Run main function
main
