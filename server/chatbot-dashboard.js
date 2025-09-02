#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Dashboard Configuration
const CONFIG = {
    port: 8000,
    title: "🚀 Astronaut AI Assistant Dashboard",
    description: "Chat Testing & Backend Monitoring"
};

// Store active connections and chat sessions
const connections = new Map();
const chatSessions = new Map();

// Create HTTP server
const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = req.url;
    
    // API endpoints
    if (url === '/api/status') {
        handleStatusAPI(req, res);
        return;
    }
    
    if (url === '/api/chat') {
        handleChatAPI(req, res);
        return;
    }
    
    if (url === '/api/processes') {
        handleProcessesAPI(req, res);
        return;
    }
    
    if (url === '/api/logs') {
        handleLogsAPI(req, res);
        return;
    }
    
    // Serve dashboard HTML
    if (url === '/' || url === '/index.html') {
        serveDashboard(req, res);
        return;
    }
    
    // Serve static files
    if (url.startsWith('/assets/')) {
        serveStaticFile(req, res, url);
        return;
    }
    
    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

// Handle status API
function handleStatusAPI(req, res) {
    const status = {
        server: 'running',
        port: CONFIG.port,
        uptime: process.uptime(),
        connections: connections.size,
        sessions: chatSessions.size,
        timestamp: new Date().toISOString()
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status, null, 2));
}

// Handle chat API
function handleChatAPI(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
    }
    
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const { message, session_id } = JSON.parse(body);
            
            // Generate session ID if not provided
            const currentSessionId = session_id || `session_${Date.now()}`;
            
            // Store message in session
            if (!chatSessions.has(currentSessionId)) {
                chatSessions.set(currentSessionId, []);
            }
            
            const session = chatSessions.get(currentSessionId);
            session.push({
                type: 'user',
                message: message,
                timestamp: new Date().toISOString()
            });
            
            // Simulate AI response (you can integrate with actual AI here)
            const aiResponse = generateAIResponse(message);
            
            session.push({
                type: 'ai',
                message: aiResponse,
                timestamp: new Date().toISOString()
            });
            
            const response = {
                session_id: currentSessionId,
                response: aiResponse,
                response_time_ms: Math.random() * 1000 + 100,
                timestamp: new Date().toISOString()
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response, null, 2));
            
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }, null, 2));
        }
    });
}

// Handle processes API
function handleProcessesAPI(req, res) {
    // Get system processes
    const ps = spawn('ps', ['aux']);
    let output = '';
    
    ps.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    ps.on('close', (code) => {
        if (code === 0) {
            const processes = output.split('\n')
                .slice(1) // Remove header
                .filter(line => line.trim())
                .map(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 11) {
                        return {
                            user: parts[0],
                            pid: parts[1],
                            cpu: parts[2],
                            mem: parts[3],
                            vsz: parts[4],
                            rss: parts[5],
                            tty: parts[6],
                            stat: parts[7],
                            start: parts[8],
                            time: parts[9],
                            command: parts.slice(10).join(' ')
                        };
                    }
                    return null;
                })
                .filter(p => p !== null)
                .slice(0, 20); // Limit to 20 processes
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ processes }, null, 2));
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to get processes' }, null, 2));
        }
    });
}

// Handle logs API
function handleLogsAPI(req, res) {
    // Get recent logs (you can customize this)
    const logs = [
        { level: 'INFO', message: 'Dashboard server started', timestamp: new Date().toISOString() },
        { level: 'INFO', message: `Listening on port ${CONFIG.port}`, timestamp: new Date().toISOString() },
        { level: 'INFO', message: 'Chat API endpoint ready', timestamp: new Date().toISOString() },
        { level: 'INFO', message: 'Process monitoring active', timestamp: new Date().toISOString() }
    ];
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ logs }, null, 2));
}

// Generate AI response (placeholder)
function generateAIResponse(message) {
    const responses = [
        "🚀 That's an interesting question! Let me help you with that.",
        "✨ Great question! Here's what I can tell you about that topic.",
        "🌟 I'd be happy to help! Let me break this down for you.",
        "💫 Excellent question! This is something I'm well-versed in.",
        "🎯 I understand what you're asking. Let me provide some insights."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Serve dashboard HTML
function serveDashboard(req, res) {
    const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: white;
            min-height: 100vh;
        }
        
        .header {
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid #00ffee;
        }
        
        .header h1 {
            color: #00ffee;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #ccc;
            font-size: 1.1rem;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .panel {
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ffee;
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
        }
        
        .panel h2 {
            color: #00ffee;
            margin-bottom: 20px;
            font-size: 1.5rem;
            border-bottom: 1px solid #00ffee;
            padding-bottom: 10px;
        }
        
        .chat-area {
            height: 400px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00ffee;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .message {
            margin-bottom: 15px;
            padding: 10px 15px;
            border-radius: 10px;
            max-width: 80%;
        }
        
        .message.user {
            background: #007bff;
            color: white;
            margin-left: auto;
            text-align: right;
        }
        
        .message.ai {
            background: rgba(0, 255, 238, 0.2);
            color: #00ffee;
            border: 1px solid #00ffee;
        }
        
        .input-area {
            display: flex;
            gap: 10px;
        }
        
        input[type="text"] {
            flex: 1;
            padding: 12px;
            border: 1px solid #00ffee;
            border-radius: 25px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            outline: none;
        }
        
        button {
            padding: 12px 20px;
            background: linear-gradient(45deg, #00ffee, #00ff88);
            color: #000;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 255, 238, 0.3);
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .status-card {
            background: rgba(0, 255, 238, 0.1);
            border: 1px solid #00ffee;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
        }
        
        .status-card .value {
            font-size: 2rem;
            font-weight: bold;
            color: #00ffee;
        }
        
        .status-card .label {
            color: #ccc;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .process-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .process-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0, 255, 238, 0.3);
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 8px;
            font-family: monospace;
            font-size: 0.85rem;
        }
        
        .process-pid {
            color: #00ffee;
            font-weight: bold;
        }
        
        .process-cpu {
            color: #ffaa00;
        }
        
        .process-mem {
            color: #ff4444;
        }
        
        .refresh-btn {
            background: linear-gradient(45deg, #ffaa00, #ff8800);
            margin-bottom: 15px;
        }
        
        .logs-area {
            max-height: 200px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00ffee;
            border-radius: 10px;
            padding: 15px;
            font-family: monospace;
            font-size: 0.85rem;
        }
        
        .log-entry {
            margin-bottom: 8px;
            padding: 5px;
            border-radius: 5px;
        }
        
        .log-info {
            background: rgba(0, 255, 238, 0.1);
            border-left: 3px solid #00ffee;
        }
        
        .log-warning {
            background: rgba(255, 170, 0, 0.1);
            border-left: 3px solid #ffaa00;
        }
        
        .log-error {
            background: rgba(255, 68, 68, 0.1);
            border-left: 3px solid #ff4444;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${CONFIG.title}</h1>
        <p>${CONFIG.description} - Port ${CONFIG.port}</p>
    </div>
    
    <div class="container">
        <!-- Chat Panel -->
        <div class="panel">
            <h2>💬 Chat Testing</h2>
            <div class="chat-area" id="chat-area">
                <div class="message ai">
                    🚀 Welcome to the AI Assistant Dashboard! Start chatting to test the system.
                </div>
            </div>
            <div class="input-area">
                <input type="text" id="chat-input" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>
        
        <!-- Status Panel -->
        <div class="panel">
            <h2>📊 System Status</h2>
            <div class="status-grid">
                <div class="status-card">
                    <div class="value" id="server-status">🟢</div>
                    <div class="label">Server</div>
                </div>
                <div class="status-card">
                    <div class="value" id="uptime">0s</div>
                    <div class="label">Uptime</div>
                </div>
                <div class="status-card">
                    <div class="value" id="connections">0</div>
                    <div class="label">Connections</div>
                </div>
                <div class="status-card">
                    <div class="value" id="sessions">0</div>
                    <div class="label">Chat Sessions</div>
                </div>
            </div>
            
            <h3>📝 Recent Logs</h3>
            <div class="logs-area" id="logs-area">
                <div class="log-entry log-info">Dashboard loaded successfully</div>
            </div>
        </div>
        
        <!-- Processes Panel -->
        <div class="panel">
            <h2>⚙️ Backend Processes</h2>
            <button class="refresh-btn" onclick="refreshProcesses()">🔄 Refresh Processes</button>
            <div class="process-list" id="process-list">
                <div class="process-item">Loading processes...</div>
            </div>
        </div>
        
        <!-- API Testing Panel -->
        <div class="panel">
            <h2>🔧 API Testing</h2>
            <div style="margin-bottom: 15px;">
                <button onclick="testStatusAPI()">Test Status API</button>
                <button onclick="testChatAPI()">Test Chat API</button>
                <button onclick="testProcessesAPI()">Test Processes API</button>
            </div>
            <div id="api-results" style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px; font-family: monospace; font-size: 0.85rem; max-height: 200px; overflow-y: auto;">
                Click buttons above to test APIs...
            </div>
        </div>
    </div>

    <script>
        let sessionId = null;
        
        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            updateStatus();
            refreshProcesses();
            setInterval(updateStatus, 5000); // Update every 5 seconds
        });
        
        // Handle Enter key in chat
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
        
        // Send chat message
        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            input.value = '';
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        session_id: sessionId
                    })
                });
                
                const data = await response.json();
                
                if (data.session_id) {
                    sessionId = data.session_id;
                }
                
                // Add AI response
                addMessage(data.response, 'ai');
                
            } catch (error) {
                addMessage('❌ Error: ' + error.message, 'ai');
            }
        }
        
        // Add message to chat
        function addMessage(message, type) {
            const chatArea = document.getElementById('chat-area');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${type}\`;
            messageDiv.textContent = message;
            chatArea.appendChild(messageDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
        
        // Update system status
        async function updateStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                
                document.getElementById('uptime').textContent = Math.floor(data.uptime) + 's';
                document.getElementById('connections').textContent = data.connections;
                document.getElementById('sessions').textContent = data.sessions;
                
            } catch (error) {
                console.error('Failed to update status:', error);
            }
        }
        
        // Refresh processes
        async function refreshProcesses() {
            try {
                const response = await fetch('/api/processes');
                const data = await response.json();
                
                const processList = document.getElementById('process-list');
                processList.innerHTML = '';
                
                data.processes.forEach(process => {
                    const processDiv = document.createElement('div');
                    processDiv.className = 'process-item';
                    processDiv.innerHTML = \`
                        <span class="process-pid">PID: \${process.pid}</span> | 
                        <span class="process-cpu">CPU: \${process.cpu}%</span> | 
                        <span class="process-mem">MEM: \${process.mem}%</span><br>
                        <strong>\${process.command}</strong>
                    \`;
                    processList.appendChild(processDiv);
                });
                
            } catch (error) {
                document.getElementById('process-list').innerHTML = '<div class="process-item">❌ Failed to load processes</div>';
            }
        }
        
        // Test Status API
        async function testStatusAPI() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                document.getElementById('api-results').innerHTML = '<strong>Status API Response:</strong><br>' + JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('api-results').innerHTML = '<strong>Status API Error:</strong><br>' + error.message;
            }
        }
        
        // Test Chat API
        async function testChatAPI() {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Test message' })
                });
                const data = await response.json();
                document.getElementById('api-results').innerHTML = '<strong>Chat API Response:</strong><br>' + JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('api-results').innerHTML = '<strong>Chat API Error:</strong><br>' + error.message;
            }
        }
        
        // Test Processes API
        async function testProcessesAPI() {
            try {
                const response = await fetch('/api/processes');
                const data = await response.json();
                document.getElementById('api-results').innerHTML = '<strong>Processes API Response:</strong><br>' + JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('api-results').innerHTML = '<strong>Processes API Error:</strong><br>' + error.message;
            }
        }
    </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(dashboardHTML);
}

// Serve static files
function serveStaticFile(req, res, url) {
    const filePath = path.join(__dirname, '..', url);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }
        
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
}

// Start server
server.listen(CONFIG.port, () => {
    console.log('🚀 Chatbot Dashboard Server Started!');
    console.log(`📱 Dashboard: http://localhost:${CONFIG.port}`);
    console.log(`🔧 API Endpoints:`);
    console.log(`   - GET  /api/status     - Server status`);
    console.log(`   - POST /api/chat       - Chat API`);
    console.log(`   - GET  /api/processes  - System processes`);
    console.log(`   - GET  /api/logs       - Server logs`);
    console.log(`📊 Monitoring active on port ${CONFIG.port}`);
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down dashboard server...');
    server.close(() => {
        console.log('✅ Dashboard server stopped');
        process.exit(0);
    });
});

// Handle errors
server.on('error', (err) => {
    console.error('❌ Server error:', err);
});

