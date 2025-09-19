#!/bin/bash

# 🎨 Start Website with Workflow Diagrams Integration
# ================================================

echo "🎨 Starting Website with Workflow Diagrams Integration..."
echo "======================================================="

# Check if PlantUML is installed
if ! command -v plantuml &> /dev/null; then
    echo "❌ PlantUML is not installed. Installing now..."
    brew install plantuml
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install PlantUML. Please install manually."
        echo "   Visit: https://plantuml.com/starting"
        exit 1
    fi
else
    echo "✅ PlantUML is already installed"
fi

# Check if workflow diagrams directory exists
WORKFLOW_DIAGRAMS_PATH="/Users/ayush/AI_Projects/agenticchatbot/WorkflowDiagrams"
if [ ! -d "$WORKFLOW_DIAGRAMS_PATH" ]; then
    echo "❌ Workflow diagrams directory not found: $WORKFLOW_DIAGRAMS_PATH"
    echo "   Please ensure the WorkflowDiagrams library is properly set up"
    exit 1
else
    echo "✅ Workflow diagrams directory found"
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements_diagrams.txt

# Check if all required files exist
echo "🔍 Checking required files..."

REQUIRED_FILES=(
    "services/diagram_service.py"
    "templates/workflow_diagrams.html"
    "app.py"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file not found"
        exit 1
    fi
done

# Start the Flask application
echo ""
echo "🚀 Starting Flask application with workflow diagrams..."
echo "   - Main Portal: http://localhost:6000/"
echo "   - Workflow Diagrams: http://localhost:6000/workflow-diagrams"
echo "   - API Health: http://localhost:6000/api/health"
echo "   - Diagram API: http://localhost:6000/api/diagrams/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=" * 50

# Start the server
python app.py
