# AI Portal - Main Flask Application
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import asyncio
import json
import os
from datetime import datetime
from typing import Dict, Any

# Import our core modules (optional)
try:
    from core.avatar_engine.avatar_creator import AvatarCreator
    from core.ai_assistant.personal_ai import PersonalAIAssistant
    CORE_MODULES_AVAILABLE = True
except ImportError:
    print("⚠️  Core modules not found - running in limited mode")
    CORE_MODULES_AVAILABLE = False
    AvatarCreator = None
    PersonalAIAssistant = None

# Import diagram service
from services.diagram_service import diagram_bp

# Initialize Flask app
app = Flask(__name__)
app.config.from_object('config.Config')

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize SocketIO for real-time communication
socketio = SocketIO(app, cors_allowed_origins="*")

# Register blueprints
app.register_blueprint(diagram_bp)

# Initialize core systems (if available)
if CORE_MODULES_AVAILABLE:
    avatar_creator = AvatarCreator()
    ai_assistants = {}  # Store AI assistants for each user
else:
    avatar_creator = None
    ai_assistants = {}

# Global state
active_users = {}
active_avatars = {}

@app.route('/')
def index():
    """Main dashboard page"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return render_template('index.html')

@app.route('/enhanced')
def enhanced_portal():
    """Enhanced AI Portal - Personal Workspace"""
    return render_template('enhanced_portal.html')

@app.route('/workflow-diagrams')
def workflow_diagrams():
    """Workflow Diagrams Dashboard"""
    return render_template('workflow_diagrams.html')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "port": app.config['PORT'],
        "services": {
            "avatar_engine": "running" if CORE_MODULES_AVAILABLE else "unavailable",
            "ai_assistant": "running" if CORE_MODULES_AVAILABLE else "unavailable",
            "websocket": "running",
            "enhanced_portal": "available",
            "workflow_diagrams": "running"
        }
    })

@app.route('/api/profile')
def get_profile():
    """Get user profile information"""
    profile = {
        "name": "Ayush",
        "title": "AI Developer & Tech Enthusiast",
        "location": "AI_Projects",
        "status": "Building AI Portal",
        "skills": {
            "AI/ML": "Expert",
            "Development": "Advanced", 
            "Innovation": "Pioneer",
            "Problem Solving": "Master"
        },
        "current_projects": [
            "AI Portal Integration",
            "Futuristic Log Dashboard",
            "Agentic Chatbot",
            "Avatar Generator"
        ]
    }
    return jsonify(profile)

@app.route('/api/dashboards')
def get_dashboards():
    """Get available dashboards"""
    dashboards = {
        "server_management": {
            "name": "Server Management",
            "description": "Monitor servers and infrastructure",
            "status": "available",
            "url": "/dashboard/server"
        },
        "ai_projects": {
            "name": "AI Project Monitoring", 
            "description": "Track AI projects and training",
            "status": "available",
            "url": "/dashboard/ai-projects"
        },
        "log_analytics": {
            "name": "Log Dashboard",
            "description": "Real-time log monitoring and AI insights",
            "status": "available", 
            "url": "/dashboard/logs"
        },
        "workflow_diagrams": {
            "name": "Workflow Diagrams",
            "description": "Generate and preview system architecture diagrams",
            "status": "available",
            "url": "/workflow-diagrams"
        }
    }
    return jsonify(dashboards)

@app.route('/api/themes')
def get_themes():
    """Get available themes"""
    themes = {
        "space": {
            "name": "Space Theme",
            "description": "Futuristic space aesthetic with neon accents",
            "colors": ["#0f0f23", "#1a1a2e", "#16213e", "#00ff88"]
        },
        "ocean": {
            "name": "Ocean Theme", 
            "description": "Deep ocean blues with wave animations",
            "colors": ["#0c1445", "#1e3a8a", "#0ea5e9", "#0ea5e9"]
        },
        "forest": {
            "name": "Forest Theme",
            "description": "Natural greens with organic elements", 
            "colors": ["#064e3b", "#065f46", "#16a34a", "#16a34a"]
        },
        "sky": {
            "name": "Sky Theme",
            "description": "Bright sky blues with cloud animations",
            "colors": ["#1e40af", "#3b82f6", "#60a5fa", "#3b82f6"]
        }
    }
    return jsonify(themes)

if __name__ == '__main__':
    # Get configuration
    host = app.config.get('HOST', '0.0.0.0')
    port = app.config.get('PORT', 6000)
    debug = app.config.get('DEBUG', True)
    
    print(f"🚀 Starting Enhanced AI Portal on port {port}")
    print(f"   - Main Portal: http://localhost:{port}/")
    print(f"   - Enhanced Portal: http://localhost:{port}/enhanced")
    print(f"   - Workflow Diagrams: http://localhost:{port}/workflow-diagrams")
    print(f"   - API Health: http://localhost:{port}/api/health")
    print(f"   - Diagram API: http://localhost:{port}/api/diagrams/health")
    print(f"   - Core Modules: {'Available' if CORE_MODULES_AVAILABLE else 'Limited Mode'}")
    print(f"   - Debug Mode: {'ON' if debug else 'OFF'}")
    print("   Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the server
    socketio.run(app, host=host, port=port, debug=debug, use_reloader=False)
