const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Agentic Chatbot Integration
class AgenticChatbotBridge {
    constructor() {
        this.agenticPath = path.join(__dirname, '../Chatbot/agentic_enhancement');
        this.pythonProcess = null;
        this.isAgenticRunning = false;
        this.sessionHistory = new Map();
    }

    async startAgenticSystem() {
        try {
            console.log('🚀 Starting Agentic Chatbot system...');
            
            // Check if agentic system exists
            if (!fs.existsSync(this.agenticPath)) {
                console.log('⚠️ Agentic enhancement system not found, using fallback mode');
                this.isAgenticRunning = false;
                return false;
            }

            // Start the Python agentic system
            this.pythonProcess = spawn('python3', ['core/app.py'], {
                cwd: this.agenticPath,
                stdio: ['pipe', 'pipe', 'pipe']
            });

            this.pythonProcess.stdout.on('data', (data) => {
                console.log('🤖 Agentic System:', data.toString());
            });

            this.pythonProcess.stderr.on('data', (data) => {
                console.error('❌ Agentic Error:', data.toString());
            });

            this.pythonProcess.on('close', (code) => {
                console.log(`🤖 Agentic process exited with code ${code}`);
                this.isAgenticRunning = false;
            });

            // Wait for system to start
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.isAgenticRunning = true;
            
            console.log('✅ Agentic Chatbot system started successfully!');
            return true;
        } catch (error) {
            console.error('❌ Failed to start Agentic system:', error);
            this.isAgenticRunning = false;
            return false;
        }
    }

    async sendToAgentic(message, sessionId) {
        try {
            if (!this.isAgenticRunning) {
                console.log('🔄 Agentic system not running, using fallback mode');
                return {
                    response: this.generateFallbackResponse(message),
                    session_id: sessionId,
                    agentic_status: 'fallback'
                };
            }

            // Create session history if not exists
            if (!this.sessionHistory.has(sessionId)) {
                this.sessionHistory.set(sessionId, []);
            }

            // Add user message to history
            this.sessionHistory.get(sessionId).push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            // Prepare payload for agentic system
            const payload = {
                message: message,
                session_id: sessionId,
                user_id: 'website_user',
                context: {
                    user_type: 'portfolio_visitor',
                    source: 'website_chatbot',
                    session_history: this.sessionHistory.get(sessionId)
                }
            };

            // Send to agentic system via HTTP
            const response = await fetch('http://localhost:5000/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Agentic API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Add assistant response to history
            this.sessionHistory.get(sessionId).push({
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toISOString()
            });

            return {
                response: data.response,
                session_id: sessionId,
                agentic_status: 'active'
            };

        } catch (error) {
            console.error('❌ Agentic communication error:', error);
            
            // Fallback to smart responses
            return {
                response: this.generateFallbackResponse(message),
                session_id: sessionId,
                agentic_status: 'fallback'
            };
        }
    }

    generateFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Smart keyword-based responses (fallback when agentic system is down)
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! I\'m Ayush\'s AI Assistant with autonomous capabilities. How can I help you today? 🚀';
        }
        
        if (lowerMessage.includes('portfolio') || lowerMessage.includes('project')) {
            return 'I can help you explore Ayush\'s portfolio! He has amazing projects in AI, project management, and business development. What specific area interests you? 💼';
        }
        
        if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
            return 'Ayush is passionate about AI! He works on AI sales tools, video generation, and API development. Would you like to know more about any specific AI project? 🤖';
        }
        
        if (lowerMessage.includes('agentic') || lowerMessage.includes('autonomous')) {
            return 'I\'m powered by an autonomous AI system that can make decisions, plan tasks, and learn from our conversations! I can help you with complex workflows and intelligent responses. 🧠';
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return 'You can reach Ayush through his portfolio contact section or LinkedIn. He\'s always open to discussing exciting opportunities! 📧';
        }
        
        if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
            return 'Ayush has diverse experience in project management, business development, and AI implementation. He\'s worked with telecom, edtech, and various industries. What would you like to know? 💪';
        }
        
        // Default intelligent response
        return `That's an interesting question about "${message}"! As Ayush's autonomous AI assistant, I can help you learn more about his work, projects, or expertise. What would you like to explore? 🎯`;
    }
}

// Initialize the bridge
const agenticBridge = new AgenticChatbotBridge();

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const sessionId = req.body.session_id || `session_${Date.now()}`;
        
        console.log('🤖 Received message:', message);
        console.log('🆔 Session ID:', sessionId);
        
        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                error: 'Message is required',
                response: 'Please provide a message to chat with me! 🤖'
            });
        }

        // Send to agentic system
        const result = await agenticBridge.sendToAgentic(message.trim(), sessionId);
        
        console.log('🤖 Agentic response:', result.response);
        console.log('📊 Agentic status:', result.agentic_status);
        
        res.json({
            response: result.response,
            session_id: result.session_id,
            agentic_status: result.agentic_status,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Chat endpoint error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            response: 'I apologize, but I\'m having trouble processing your request right now. Please try again! 🤖'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        agentic_status: agenticBridge.isAgenticRunning ? 'active' : 'inactive',
        service: 'Agentic Chatbot Bridge'
    });
});

// Agentic system status endpoint
app.get('/api/agentic-status', async (req, res) => {
    try {
        const status = {
            bridge_status: 'running',
            agentic_running: agenticBridge.isAgenticRunning,
            sessions_active: agenticBridge.sessionHistory.size,
            timestamp: new Date().toISOString()
        };
        
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get agentic status' });
    }
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Agentic Chatbot Bridge running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
    console.log(`🤖 Agentic status: http://localhost:${PORT}/api/agentic-status`);
    
    // Try to start agentic system
    console.log('🔄 Attempting to start Agentic system...');
    await agenticBridge.startAgenticSystem();
});

module.exports = app;
