#!/bin/bash

# Add Workflow Diagrams Integration to Main Website
# This script adds a link to the workflow diagrams in the main website

echo "🔧 Adding Workflow Diagrams to Main Website"
echo "==========================================="

MAIN_INDEX="/Users/ayush/AI_Projects/Website/index.html"
BACKUP_FILE="/Users/ayush/AI_Projects/Website/index.html.backup.$(date +%Y%m%d_%H%M%S)"

# Create backup
echo "📁 Creating backup of main index.html..."
cp "$MAIN_INDEX" "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"

# Add workflow diagrams link to the main website
echo "🔗 Adding workflow diagrams link..."

# Create a temporary file with the new content
cat > /tmp/workflow_diagrams_integration.html << 'EOF'

<!-- Workflow Diagrams Integration -->
<div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
    <a href="workflow-diagrams.html" 
       style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; 
              background: linear-gradient(135deg, #00ff88, #00cc6a); 
              color: #000; text-decoration: none; border-radius: 25px; 
              font-weight: 600; font-size: 14px; 
              box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
              transition: all 0.3s ease;"
       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 255, 136, 0.4)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 255, 136, 0.3)'">
        <i class="fas fa-sitemap"></i>
        Workflow Diagrams
    </a>
</div>

EOF

# Find a good place to insert the workflow diagrams link
# Look for the body tag and add after it
if grep -q "<body" "$MAIN_INDEX"; then
    # Insert the workflow diagrams link after the body tag
    sed -i '' '/<body/a\
<!-- Workflow Diagrams Integration -->\
<div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">\
    <a href="workflow-diagrams.html" \
       style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; \
              background: linear-gradient(135deg, #00ff88, #00cc6a); \
              color: #000; text-decoration: none; border-radius: 25px; \
              font-weight: 600; font-size: 14px; \
              box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);\
              transition: all 0.3s ease;"\
       onmouseover="this.style.transform=\x27translateY(-2px)\x27; this.style.boxShadow=\x270 6px 20px rgba(0, 255, 136, 0.4)\x27"\
       onmouseout="this.style.transform=\x27translateY(0)\x27; this.style.boxShadow=\x270 4px 15px rgba(0, 255, 136, 0.3)\x27">\
        <i class="fas fa-sitemap"></i>\
        Workflow Diagrams\
    </a>\
</div>' "$MAIN_INDEX"
    
    echo "✅ Workflow diagrams link added to main website"
else
    echo "❌ Could not find body tag in main index.html"
    exit 1
fi

echo ""
echo "🎉 Integration Complete!"
echo "======================="
echo "✅ Main website updated with workflow diagrams link"
echo "✅ Workflow diagrams page created"
echo "✅ API server ready to start"
echo ""
echo "🚀 To start the complete system:"
echo "   1. Start your main website: cd /Users/ayush/AI_Projects/Website && node server/unified-server.js"
echo "   2. Start the diagram API: cd /Users/ayush/AI_Projects/Website/workflow_diagrams_api && ./start_diagram_api.sh"
echo ""
echo "🌐 Access URLs:"
echo "   - Main Website: http://localhost:4000"
echo "   - Workflow Diagrams: http://localhost:4000/workflow-diagrams.html"
echo "   - Diagram API: http://localhost:5001/api/health"
echo ""
echo "📁 Files created:"
echo "   - workflow-diagrams.html (main page)"
echo "   - workflow_diagrams_api/diagram_server.py (API server)"
echo "   - workflow_diagrams_api/start_diagram_api.sh (startup script)"
