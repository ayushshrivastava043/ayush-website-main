#!/usr/bin/env python3
"""
AI Assistant API Server
Runs on port 7000 to provide AI chat functionality
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Assistant',
        'port': 7000,
        'version': '1.0.0'
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """AI chat endpoint"""
    try:
        data = request.json
        message = data.get('message', '')
        
        # Simulate AI response
        response = f"AI Response to: {message}"
        
        return jsonify({
            'status': 'success',
            'response': response,
            'timestamp': '2025-09-12T15:15:00'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("🤖 Starting AI Assistant API Server...")
    print("🌐 AI Server: http://localhost:7000")
    print("📊 Health Check: http://localhost:7000/api/health")
    print("💬 Chat Endpoint: http://localhost:7000/api/chat")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=7000, debug=True, use_reloader=False)
