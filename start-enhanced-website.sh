#!/bin/bash

# Enhanced Website Startup Script
# Starts both the Enhanced Agentic Chatbot and the main website

echo "🚀 Starting Enhanced Website with Agentic Chatbot..."

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

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        print_success "Node.js is installed: $(node --version)"
    else
        print_warning "Node.js is not installed. Some features may not work."
    fi
}

# Install enhanced chatbot dependencies
install_enhanced_dependencies() {
    print_status "Installing Enhanced Agentic Chatbot dependencies..."
    
    if [ -f "requirements-enhanced-agentic.txt" ]; then
        pip3 install -r requirements-enhanced-agentic.txt
        if [ $? -eq 0 ]; then
            print_success "Enhanced chatbot dependencies installed successfully"
        else
            print_error "Failed to install enhanced chatbot dependencies"
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
start_enhanced_chatbot() {
    print_status "Starting Enhanced Agentic Chatbot..."
    
    # Check if the main script exists
    if [ ! -f "enhanced-agentic-chatbot-langgraph.py" ]; then
        print_error "enhanced-agentic-chatbot-langgraph.py not found"
        exit 1
    fi
    
    # Start the chatbot in background
    print_success "Starting Enhanced Agentic Chatbot on http://$HOST:$PORT"
    print_status "Features enabled:"
    echo "  🤖 LangGraph Workflows"
    echo "  📊 Stateful Conversations"
    echo "  🔄 Multi-Agent System"
    echo "  💾 Persistent Memory"
    echo "  🛠️ Tool Integration"
    echo "  🔍 Error Handling"
    echo ""
    
    # Start the chatbot
    python3 enhanced-agentic-chatbot-langgraph.py &
    CHATBOT_PID=$!
    
    # Wait a moment for the chatbot to start
    sleep 3
    
    # Check if the chatbot started successfully
    if kill -0 $CHATBOT_PID 2>/dev/null; then
        print_success "Enhanced Agentic Chatbot started successfully (PID: $CHATBOT_PID)"
        return 0
    else
        print_error "Failed to start Enhanced Agentic Chatbot"
        return 1
    fi
}

# Start the website server
start_website_server() {
    print_status "Starting website server..."
    
    # Check if we have a Python web server
    if [ -f "App.py" ]; then
        print_success "Starting Flask website server..."
        python3 App.py &
        WEBSITE_PID=$!
        sleep 2
        
        if kill -0 $WEBSITE_PID 2>/dev/null; then
            print_success "Website server started successfully (PID: $WEBSITE_PID)"
            print_status "Website available at: http://localhost:5000"
        else
            print_warning "Failed to start Flask server, using Python HTTP server instead"
            python3 -m http.server 8000 &
            WEBSITE_PID=$!
            print_success "Python HTTP server started on port 8000 (PID: $WEBSITE_PID)"
            print_status "Website available at: http://localhost:8000"
        fi
    else
        print_warning "No Flask app found, starting Python HTTP server..."
        python3 -m http.server 8000 &
        WEBSITE_PID=$!
        print_success "Python HTTP server started on port 8000 (PID: $WEBSITE_PID)"
        print_status "Website available at: http://localhost:8000"
    fi
}

# Show status
show_status() {
    echo ""
    echo "=========================================="
    echo "🚀 Enhanced Website Status"
    echo "=========================================="
    echo ""
    echo "🤖 Enhanced Agentic Chatbot:"
    echo "   URL: http://$HOST:$PORT"
    echo "   Status: Running"
    echo "   Features: LangGraph Workflows, Stateful Conversations"
    echo ""
    echo "🌐 Website:"
    echo "   URL: http://localhost:8000 (or 5000)"
    echo "   Status: Running"
    echo "   Chatbot: Enhanced Agentic AI Assistant"
    echo ""
    echo "📊 Available Endpoints:"
    echo "   Chat: http://$HOST:$PORT/chat"
    echo "   Status: http://$HOST:$PORT/status"
    echo "   Tools: http://$HOST:$PORT/tools"
    echo ""
    echo "🎯 Enhanced Features:"
    echo "   ✅ LangGraph Workflows"
    echo "   ✅ Stateful Conversations"
    echo "   ✅ Multi-Agent System"
    echo "   ✅ Persistent Memory"
    echo "   ✅ Confidence Scoring"
    echo "   ✅ Suggested Actions"
    echo "   ✅ Workflow Visualization"
    echo ""
    print_status "Press Ctrl+C to stop all servers"
    echo ""
}

# Cleanup function
cleanup() {
    echo ""
    print_warning "Shutting down Enhanced Website..."
    
    if [ ! -z "$CHATBOT_PID" ]; then
        kill $CHATBOT_PID 2>/dev/null
        print_status "Enhanced Agentic Chatbot stopped"
    fi
    
    if [ ! -z "$WEBSITE_PID" ]; then
        kill $WEBSITE_PID 2>/dev/null
        print_status "Website server stopped"
    fi
    
    print_success "All servers stopped successfully"
    exit 0
}

# Handle script interruption
trap cleanup INT

# Main execution
main() {
    echo "=========================================="
    echo "🚀 Enhanced Website with Agentic Chatbot"
    echo "=========================================="
    echo ""
    
    # Run checks
    check_python
    check_node
    check_environment
    create_directories
    check_port $PORT
    
    # Install dependencies
    install_enhanced_dependencies
    
    echo ""
    print_status "All checks passed. Starting Enhanced Website..."
    echo ""
    
    # Start services
    if start_enhanced_chatbot; then
        start_website_server
        show_status
        
        # Wait for user interruption
        while true; do
            sleep 1
        done
    else
        print_error "Failed to start Enhanced Agentic Chatbot"
        exit 1
    fi
}

# Run main function
main
