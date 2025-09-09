from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    print(f"🔍 Serving asset: {filename}")
    print(f"📁 Current directory: {os.getcwd()}")
    print(f"📁 Assets directory: {os.path.join(os.getcwd(), 'assets')}")
    print(f"✅ File exists: {os.path.exists(os.path.join('assets', filename))}")
    return send_from_directory('assets', filename)

@app.route('/')
def main():
    return '''
<!DOCTYPE html>
<html>
<head>
    <title>🚀 WORKING DEBUG PORTAL</title>
    <style>
        body { 
            background: linear-gradient(135deg, #0a0a2a 0%, #2c005e 100%); 
            color: white; 
            font-family: Arial; 
            padding: 20px; 
            margin: 0;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .avatar { 
            width: 200px; 
            height: 200px; 
            border-radius: 50%; 
            border: 6px solid #00d4ff; 
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
            margin: 20px auto;
            display: block;
        }
        h1 { color: #00d4ff; font-size: 2.5em; margin-bottom: 20px; }
        .status { 
            background: rgba(0, 212, 255, 0.1); 
            padding: 20px; 
            border-radius: 15px; 
            border: 2px solid #00d4ff;
            margin: 20px 0;
        }
        .success { color: #00ff88; }
        .error { color: #ff4444; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 WORKING DEBUG PORTAL</h1>
        
        <div class="status">
            <h2>🎯 Avatar Test</h2>
            <img src="/assets/astronaut-avatar.gif" alt="Test Avatar" class="avatar" id="avatarImage">
            <p>If you see the astronaut above, the static file serving is WORKING! ✅</p>
            <p>If you see a broken image, check the console for errors. ❌</p>
        </div>
        
        <div class="status">
            <h2>🔍 Debug Information</h2>
            <p><strong>Current URL:</strong> <span id="currentUrl"></span></p>
            <p><strong>Avatar Path:</strong> <span id="avatarPath"></span></p>
            <p><strong>Page Loaded:</strong> <span id="pageLoaded"></span></p>
        </div>
        
        <div class="status">
            <h2>📱 Next Steps</h2>
            <p>If the avatar is working, we can build the full portal!</p>
            <p>If not, we'll debug the static file serving issue.</p>
        </div>
    </div>

    <script>
        // Debug information
        document.getElementById('currentUrl').textContent = window.location.href;
        document.getElementById('avatarPath').textContent = '/assets/astronaut-avatar.gif';
        document.getElementById('pageLoaded').textContent = new Date().toLocaleString();
        
        // Check if avatar loaded
        const avatarImage = document.getElementById('avatarImage');
        avatarImage.onload = function() {
            console.log('✅ Avatar loaded successfully!');
            this.style.borderColor = '#00ff88';
            this.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';
        };
        
        avatarImage.onerror = function() {
            console.log('❌ Avatar failed to load!');
            this.style.borderColor = '#ff4444';
            this.style.boxShadow = '0 0 30px rgba(255, 68, 68, 0.6)';
        };
        
        console.log('🚀 Debug portal loaded successfully!');
        console.log('🔍 Check console for avatar loading status');
    </script>
</body>
</html>
    '''

if __name__ == '__main__':
    print("🚀 Starting WORKING DEBUG PORTAL...")
    print(f"📁 Current directory: {os.getcwd()}")
    print(f"📁 Assets directory: {os.path.join(os.getcwd(), 'assets')}")
    print(f"✅ Avatar file exists: {os.path.exists('assets/astronaut-avatar.gif')}")
    print("📱 Open: http://localhost:3031/")
    print("🔍 This will show exactly what's happening with the avatar!")
    app.run(host='0.0.0.0', port=3031, debug=False)



