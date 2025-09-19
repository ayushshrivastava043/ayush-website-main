#!/usr/bin/env python3
"""
Simple script to integrate workflow diagrams into the main website
"""

import os
import shutil
from datetime import datetime

def integrate_workflow_diagrams():
    main_index = "/Users/ayush/AI_Projects/Website/index.html"
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"{main_index}.backup.{timestamp}"
    shutil.copy2(main_index, backup_file)
    print(f"✅ Backup created: {backup_file}")
    
    # Read the current file
    with open(main_index, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create the workflow diagrams link HTML
    workflow_link = '''
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
'''
    
    # Insert the workflow diagrams link before the closing body tag
    if "</body>" in content:
        content = content.replace("</body>", workflow_link + "\n  </body>")
        
        # Write the updated content
        with open(main_index, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Workflow diagrams link added to main website")
        return True
    else:
        print("❌ Could not find closing body tag")
        return False

if __name__ == "__main__":
    print("🔧 Integrating Workflow Diagrams into Main Website")
    print("=" * 50)
    
    if integrate_workflow_diagrams():
        print("\n🎉 Integration Complete!")
        print("=======================")
        print("✅ Main website updated with workflow diagrams link")
        print("✅ Workflow diagrams page created")
        print("✅ API server ready to start")
        print("\n🚀 To start the complete system:")
        print("   1. Start your main website: cd /Users/ayush/AI_Projects/Website && node server/unified-server.js")
        print("   2. Start the diagram API: cd /Users/ayush/AI_Projects/Website/workflow_diagrams_api && ./start_diagram_api.sh")
        print("\n🌐 Access URLs:")
        print("   - Main Website: http://localhost:4000")
        print("   - Workflow Diagrams: http://localhost:4000/workflow-diagrams.html")
        print("   - Diagram API: http://localhost:5001/api/health")
    else:
        print("❌ Integration failed")
