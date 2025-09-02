from flask import Flask, render_template, jsonify
from datetime import datetime
import os

# Create Flask app
app = Flask(__name__)

# Basic configuration
app.config['HOST'] = '0.0.0.0'
app.config['PORT'] = 3030
app.config['DEBUG'] = True

@app.route('/')
def index():
    """Main page"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Portal - Main</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #0f0f23; color: white; }
            .container { max-width: 800px; margin: 0 auto; text-align: center; }
            .btn { display: inline-block; padding: 15px 30px; background: #00ff88; color: black; 
                   text-decoration: none; border-radius: 10px; margin: 10px; font-weight: bold; }
            .btn:hover { background: #00cc6a; }
            .port-info { color: #00ff88; font-size: 1.2rem; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 AI Portal - Main</h1>
            <p class="port-info">🌐 Port: 3030 (Chrome Safe!)</p>
            <p>Welcome to your AI Portal! Click below to access the enhanced version:</p>
            <a href="/enhanced" class="btn">🌌 Open Enhanced Portal</a>
            <a href="/api/health" class="btn">🔧 API Health Check</a>
            <p><strong>Port:</strong> 3030</p>
            <p><strong>Status:</strong> Running successfully on Chrome-safe port!</p>
        </div>
    </body>
    </html>
    """

@app.route('/enhanced')
def enhanced_portal():
    """Enhanced AI Portal - Personal Workspace"""
    return render_template('enhanced_portal.html')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "port": app.config['PORT'],
        "message": "Enhanced AI Portal is running successfully on Chrome-safe port 3030!",
        "services": {
            "enhanced_portal": "available",
            "api_endpoints": "running",
            "templates": "loaded"
        }
    })

@app.route('/test')
def test_page():
    """Test page to verify Flask is working"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Page</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a2e; color: white; }
            .container { max-width: 600px; margin: 0 auto; text-align: center; }
            .success { color: #00ff88; font-size: 24px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 SUCCESS!</h1>
            <p class="success">Flask is working perfectly!</p>
            <p>Your AI Portal server is running successfully on Chrome-safe port 3030.</p>
            <p><strong>Next step:</strong> <a href="/enhanced" style="color: #00ff88;">Open Enhanced Portal</a></p>
        </div>
    </body>
    </html>
    """

if __name__ == '__main__':
    # Get configuration
    host = app.config.get('HOST', '0.0.0.0')
    port = app.config.get('PORT', 3030)
    debug = app.config.get('DEBUG', True)
    
    print("🚀 Starting WORKING Enhanced AI Portal...")
    print("=" * 50)
    print(f"🌐 Port: {port} (Chrome Safe!)")
    print(f"🔧 Debug Mode: {'ON' if debug else 'OFF'}")
    print(f"📁 Templates: {os.path.exists('templates/enhanced_portal.html')}")
    print("=" * 50)
    print(f"📱 Main Portal: http://localhost:{port}/")
    print(f"🚀 Enhanced Portal: http://localhost:{port}/enhanced")
    print(f"🔧 API Health: http://localhost:{port}/api/health")
    print(f"🧪 Test Page: http://localhost:{port}/test")
    print("=" * 50)
    print("✅ Chrome will NOT block this port!")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Start the server
        app.run(host=host, port=port, debug=debug)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Try installing Flask: pip install flask")
