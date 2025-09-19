#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { EventEmitter } = require('events');

// Visitor tracking configuration
const VISITOR_CONFIG = {
    logFile: path.join(__dirname, '..', 'logs', 'visitors.json'),
    maxVisitors: 1000,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    trackUserAgent: true,
    trackReferer: true,
    trackIP: true,
    trackPages: true
};

// Check if WebSocket is available
let WebSocket;
try {
    WebSocket = require('ws');
} catch (err) {
    console.log('⚠️  WebSocket module not found. WebSocket features will be disabled.');
    console.log('   To enable WebSocket features, run: npm install ws');
}

// Unified Server Configuration
const CONFIG = {
    // Main website server
    website: {
        port: 4000,
        enabled: true,
        description: "Main website server"
    },
    // AI Assistant server (HTTP + WebSocket)
    aiAssistant: {
        port: 8000,
        enabled: true,
        description: "AI Assistant with WebSocket support"
    },
    // WebSocket only server
    websocket: {
        port: 8001,
        enabled: false,
        description: "WebSocket server for real-time updates"
    },
    // Alternative simple server
    simple: {
        port: 8080,
        enabled: false,
        description: "Simple HTTP server (Python alternative)"
    },
    // Global settings
    global: {
        maxConnections: 100,
        timeout: 30000,
        keepAlive: true,
        compression: true,
        cors: true
    }
};

// Try to load config from file if it exists
try {
    const configPath = path.join(__dirname, 'server-config.json');
    if (fs.existsSync(configPath)) {
        const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (fileConfig.servers) {
            Object.assign(CONFIG, fileConfig);
        }
    }
} catch (err) {
    console.log('⚠️  Could not load server-config.json, using default configuration');
}

// Unified Server Manager
class UnifiedServer extends EventEmitter {
    constructor() {
        super();
        this.servers = new Map();
        this.websocketServers = new Map();
        this.connections = new Map();
        this.visitors = new Map();
        this.stats = {
            totalRequests: 0,
            activeConnections: 0,
            errors: 0,
            startTime: Date.now(),
            servers: {},
            visitors: {
                total: 0,
                unique: 0,
                today: 0,
                thisWeek: 0,
                thisMonth: 0
            }
        };
        
        // Initialize stats for each server type
        Object.keys(CONFIG).forEach(key => {
            if (key !== 'global') {
                this.stats.servers[key] = {
                    requests: 0,
                    errors: 0,
                    startTime: null
                };
            }
        });

        // Load existing visitor data
        this.loadVisitorData();
        
        // Setup visitor cleanup interval
        setInterval(() => {
            this.cleanupExpiredVisitors();
        }, 5 * 60 * 1000); // Every 5 minutes
    }

    // Load visitor data from file
    loadVisitorData() {
        try {
            if (fs.existsSync(VISITOR_CONFIG.logFile)) {
                const data = fs.readFileSync(VISITOR_CONFIG.logFile, 'utf8');
                const visitorData = JSON.parse(data);
                
                // Restore visitor sessions
                if (visitorData.visitors) {
                    Object.entries(visitorData.visitors).forEach(([id, visitor]) => {
                        this.visitors.set(id, visitor);
                    });
                }
                
                // Restore stats
                if (visitorData.stats) {
                    this.stats.visitors = { ...this.stats.visitors, ...visitorData.stats };
                }
                
                console.log(`📊 Loaded ${this.visitors.size} visitor sessions`);
            }
        } catch (err) {
            console.log('⚠️  Could not load visitor data:', err.message);
        }
    }

    // Save visitor data to file
    saveVisitorData() {
        try {
            // Ensure logs directory exists
            const logsDir = path.dirname(VISITOR_CONFIG.logFile);
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }

            const data = {
                visitors: Object.fromEntries(this.visitors),
                stats: this.stats.visitors,
                lastUpdated: new Date().toISOString()
            };

            fs.writeFileSync(VISITOR_CONFIG.logFile, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error('❌ Could not save visitor data:', err.message);
        }
    }

    // Track visitor
    trackVisitor(req, res, page = '/') {
        const ip = this.getClientIP(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const referer = req.headers.referer || 'Direct';
        const timestamp = new Date();
        
        // Generate visitor ID (IP + User Agent hash)
        const visitorId = this.generateVisitorId(ip, userAgent);
        
        // Check if visitor exists
        let visitor = this.visitors.get(visitorId);
        
        if (!visitor) {
            // New visitor
            visitor = {
                id: visitorId,
                ip: VISITOR_CONFIG.trackIP ? ip : 'hidden',
                firstVisit: timestamp,
                lastVisit: timestamp,
                totalVisits: 1,
                pages: [page],
                userAgent: VISITOR_CONFIG.trackUserAgent ? userAgent : 'hidden',
                referer: VISITOR_CONFIG.trackReferer ? referer : 'hidden',
                sessions: [{
                    start: timestamp,
                    end: timestamp,
                    pages: [page],
                    duration: 0
                }]
            };
            
            this.visitors.set(visitorId, visitor);
            this.stats.visitors.unique++;
            this.stats.visitors.today++;
            this.stats.visitors.thisWeek++;
            this.stats.visitors.thisMonth++;
            
            console.log(`👤 New visitor: ${ip} (${userAgent.split(' ')[0]})`);
        } else {
            // Existing visitor
            visitor.lastVisit = timestamp;
            visitor.totalVisits++;
            
            // Add page if not already visited
            if (VISITOR_CONFIG.trackPages && !visitor.pages.includes(page)) {
                visitor.pages.push(page);
            }
            
            // Update current session
            const currentSession = visitor.sessions[visitor.sessions.length - 1];
            if (currentSession && (timestamp - currentSession.start) < VISITOR_CONFIG.sessionTimeout) {
                currentSession.end = timestamp;
                currentSession.duration = timestamp - currentSession.start;
                if (VISITOR_CONFIG.trackPages && !currentSession.pages.includes(page)) {
                    currentSession.pages.push(page);
                }
            } else {
                // New session
                visitor.sessions.push({
                    start: timestamp,
                    end: timestamp,
                    pages: [page],
                    duration: 0
                });
            }
            
            this.stats.visitors.today++;
        }
        
        this.stats.visitors.total++;
        
        // Save visitor data periodically
        if (this.stats.visitors.total % 10 === 0) {
            this.saveVisitorData();
        }
        
        return visitor;
    }

    // Generate visitor ID
    generateVisitorId(ip, userAgent) {
        const crypto = require('crypto');
        const hash = crypto.createHash('md5');
        hash.update(ip + userAgent);
        return hash.digest('hex').substring(0, 16);
    }

    // Get client IP
    getClientIP(req) {
        return req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               'unknown';
    }

    // Cleanup expired visitors
    cleanupExpiredVisitors() {
        const now = Date.now();
        let cleaned = 0;
        
        this.visitors.forEach((visitor, id) => {
            if (now - visitor.lastVisit.getTime() > VISITOR_CONFIG.sessionTimeout) {
                this.visitors.delete(id);
                cleaned++;
            }
        });
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} expired visitor sessions`);
            this.saveVisitorData();
        }
    }

    // Get visitor analytics
    getVisitorAnalytics() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        let todayVisits = 0;
        let weekVisits = 0;
        let monthVisits = 0;
        let totalSessions = 0;
        let avgSessionDuration = 0;
        let topPages = {};
        let userAgents = {};
        let referers = {};
        
        this.visitors.forEach(visitor => {
            // Count visits by period
            if (visitor.lastVisit >= today) todayVisits++;
            if (visitor.lastVisit >= thisWeek) weekVisits++;
            if (visitor.lastVisit >= thisMonth) monthVisits++;
            
            // Count sessions and duration
            totalSessions += visitor.sessions.length;
            let totalDuration = 0;
            visitor.sessions.forEach(session => {
                totalDuration += session.duration;
            });
            avgSessionDuration += totalDuration;
            
            // Count pages
            visitor.pages.forEach(page => {
                topPages[page] = (topPages[page] || 0) + 1;
            });
            
            // Count user agents
            const browser = this.parseUserAgent(visitor.userAgent);
            userAgents[browser] = (userAgents[browser] || 0) + 1;
            
            // Count referers
            const referer = visitor.referer === 'Direct' ? 'Direct' : 'External';
            referers[referer] = (referers[referer] || 0) + 1;
        });
        
        avgSessionDuration = totalSessions > 0 ? avgSessionDuration / totalSessions : 0;
        
        return {
            summary: {
                totalVisitors: this.visitors.size,
                totalVisits: this.stats.visitors.total,
                todayVisits,
                weekVisits,
                monthVisits,
                totalSessions,
                avgSessionDuration: Math.round(avgSessionDuration / 1000) // seconds
            },
            topPages: Object.entries(topPages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10),
            userAgents: Object.entries(userAgents)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10),
            referers: Object.entries(referers)
                .sort(([,a], [,b]) => b - a),
            recentVisitors: Array.from(this.visitors.values())
                .sort((a, b) => b.lastVisit - a.lastVisit)
                .slice(0, 20)
                .map(v => ({
                    id: v.id,
                    ip: v.ip,
                    firstVisit: v.firstVisit,
                    lastVisit: v.lastVisit,
                    totalVisits: v.totalVisits,
                    pages: v.pages.length,
                    userAgent: this.parseUserAgent(v.userAgent)
                }))
        };
    }

    // Parse user agent to get browser info
    parseUserAgent(userAgent) {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        return 'Other';
    }

    // Initialize the unified server
    async init() {
        console.log('🚀 Initializing Unified Server...');
        console.log('📋 Configuration:');
        
        // Display configuration
        Object.entries(CONFIG).forEach(([key, config]) => {
            if (key !== 'global') {
                const status = config.enabled ? '✅' : '❌';
                console.log(`   ${status} ${config.description}: Port ${config.port}`);
            }
        });
        
        // Check for existing processes
        await this.killConflictingProcesses();
        
        // Setup graceful shutdown
        this.setupGracefulShutdown();
        
        // Start enabled servers
        await this.startEnabledServers();
        
        console.log('✅ Unified Server initialized successfully!');
        this.displayStatus();
    }

    // Kill any conflicting processes
    async killConflictingProcesses() {
        const { exec } = require('child_process');
        const util = require('util');
        const execAsync = util.promisify(exec);

        const portsToCheck = Object.values(CONFIG)
            .filter(config => config.port && config.enabled)
            .map(config => config.port);
        
        console.log('🔧 Checking for conflicting processes...');
        
        for (const port of portsToCheck) {
            try {
                const { stdout } = await execAsync(`lsof -ti:${port}`);
                if (stdout.trim()) {
                    const pids = stdout.trim().split('\n');
                    for (const pid of pids) {
                        try {
                            await execAsync(`kill -9 ${pid}`);
                            console.log(`🔪 Killed process ${pid} on port ${port}`);
                        } catch (err) {
                            console.log(`⚠️  Could not kill process ${pid}: ${err.message}`);
                        }
                    }
                }
            } catch (err) {
                // Port is free, which is good
            }
        }
    }

    // Start all enabled servers
    async startEnabledServers() {
        const startPromises = [];

        if (CONFIG.website.enabled) {
            startPromises.push(this.startWebsiteServer());
        }

        if (CONFIG.aiAssistant.enabled) {
            startPromises.push(this.startAIAssistantServer());
        }

        if (CONFIG.websocket.enabled && WebSocket) {
            startPromises.push(this.startWebSocketServer());
        }

        if (CONFIG.simple.enabled) {
            startPromises.push(this.startSimpleServer());
        }

        await Promise.all(startPromises);
    }

    // Start main website server
    async startWebsiteServer() {
        const config = CONFIG.website;
        
        if (await this.isPortAvailable(config.port)) {
            const server = http.createServer((req, res) => {
                this.handleWebsiteRequest(req, res);
            });

            // Configure server
            server.maxConnections = CONFIG.global.maxConnections;
            server.keepAliveTimeout = CONFIG.global.timeout;
            server.headersTimeout = CONFIG.global.timeout;

            // Setup connection tracking
            server.on('connection', (socket) => {
                this.trackConnection(socket, 'website');
            });

            server.on('error', (err) => {
                this.handleServerError(err, 'website');
            });

            // Start server
            server.listen(config.port, () => {
                this.servers.set('website', server);
                this.stats.servers.website.startTime = Date.now();
                
                console.log(`🌐 Website server running at http://localhost:${config.port}/`);
                console.log(`📁 Serving files from: ${path.resolve(__dirname, '..')}`);
                console.log(`📄 Main file: ${path.resolve(__dirname, '../index.html')}`);
                
                this.emit('serverStarted', { port: config.port, type: 'website' });
            });

        } else {
            console.error(`❌ Port ${config.port} is not available for website server`);
        }
    }

    // Start AI Assistant server
    async startAIAssistantServer() {
        const config = CONFIG.aiAssistant;
        
        if (await this.isPortAvailable(config.port)) {
            const server = http.createServer((req, res) => {
                this.handleAIAssistantRequest(req, res);
            });

            // Configure server
            server.maxConnections = CONFIG.global.maxConnections;
            server.keepAliveTimeout = CONFIG.global.timeout;
            server.headersTimeout = CONFIG.global.timeout;

            // Setup connection tracking
            server.on('connection', (socket) => {
                this.trackConnection(socket, 'aiAssistant');
            });

            server.on('error', (err) => {
                this.handleServerError(err, 'aiAssistant');
            });

            // Start server
            server.listen(config.port, () => {
                this.servers.set('aiAssistant', server);
                this.stats.servers.aiAssistant.startTime = Date.now();
                
                console.log(`🤖 AI Assistant server running at http://localhost:${config.port}/`);
                console.log(`💬 Chat API available at http://localhost:${config.port}/api/chat`);
                console.log(`🏥 Health check at http://localhost:${config.port}/health`);
                
                this.emit('serverStarted', { port: config.port, type: 'aiAssistant' });
            });

        } else {
            console.error(`❌ Port ${config.port} is not available for AI Assistant server`);
        }
    }

    // Handle AI Assistant requests
    handleAIAssistantRequest(req, res) {
        this.stats.totalRequests++;
        this.stats.servers.aiAssistant.requests++;
        
        // Add CORS headers if enabled
        if (CONFIG.global.cors) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const url = req.url;
        const method = req.method;

        // Health check endpoint
        if (url === '/health' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'healthy', 
                server: 'aiAssistant',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }));
            return;
        }

        // Visitor analytics endpoint
        if (url === '/api/analytics' && method === 'GET') {
            const analytics = this.getVisitorAnalytics();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                analytics,
                timestamp: new Date().toISOString()
            }));
            return;
        }

        // Chat API endpoint
        if (url === '/api/chat' && method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const { message, session_id } = JSON.parse(body);
                    
                    // Generate a simple AI response
                    const response = this.generateAIResponse(message);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        response: response,
                        session_id: session_id || `session_${Date.now()}`,
                        timestamp: new Date().toISOString()
                    }));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid request format' }));
                }
            });
            return;
        }

        // Default response for other endpoints
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }

    // Generate AI response
    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Simple response logic based on keywords
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! 👋 I'm your AI assistant. How can I help you today?";
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            return "I can tell you about various projects including FinBot AI, API Engine, AI Video Series, and more! What would you like to know?";
        }
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
            return "My skills include AI/ML, Financial Technology, Data Analytics, IoT, and more. Which area interests you?";
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return "You can reach me through email, WhatsApp, or check out my portfolio for more details!";
        }
        
        if (lowerMessage.includes('help')) {
            return "I'm here to help! Ask me about projects, skills, contact information, or anything else you'd like to know.";
        }
        
        // Default response
        return "That's interesting! I'm here to help you learn about my projects, skills, and experience. What would you like to explore?";
    }

    // Handle website requests
    handleWebsiteRequest(req, res) {
        this.stats.totalRequests++;
        this.stats.servers.website.requests++;
        
        // Track visitor
        const page = req.url === '/' ? '/index.html' : req.url;
        this.trackVisitor(req, res, page);
        
        // Add CORS headers if enabled
        if (CONFIG.global.cors) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // Parse URL and decode it properly
        let url = decodeURIComponent(req.url);
        
        // Remove query parameters from URL for file serving
        if (url.includes('?')) {
            url = url.split('?')[0];
        }

        if (url === '/') {
            url = '/index.html';
        }

        // Security: Prevent directory traversal
        if (url.includes('..')) {
            this.sendError(res, 403, 'Forbidden');
            return;
        }

        // Get file path - look in parent directory (Website root)
        const currentDir = path.resolve(__dirname, '..');
        let filePath = path.join(currentDir, url);
        
        // If file not found in current directory, try other directories
        if (!fs.existsSync(filePath)) {
            // Try assets directory
            if (url.startsWith('/assets/')) {
                filePath = path.resolve(__dirname, '..', url.substring(1));
            }
            // Try projects directory
            else if (url.startsWith('/projects/')) {
                filePath = path.resolve(__dirname, '..', url.substring(1));
            }
            // Try tools directory
            else if (url.startsWith('/tools/')) {
                filePath = path.resolve(__dirname, '..', url.substring(1));
            }
            // Try pages directory
            else if (url.startsWith('/pages/')) {
                filePath = path.resolve(__dirname, '..', url.substring(1));
            }
        }
        
        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`File not found: ${filePath}`);
                this.sendError(res, 404, 'File not found');
                return;
            }

            // Get file stats
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    this.sendError(res, 500, 'Internal server error');
                    return;
                }

                // Check if it's a directory
                if (stats.isDirectory()) {
                    this.sendError(res, 403, 'Directory access not allowed');
                    return;
                }

                // Serve the file
                this.serveFile(req, res, filePath, stats);
            });
        });
    }



    // Serve a file with proper headers
    serveFile(req, res, filePath, stats) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.pdf': 'application/pdf',
            '.txt': 'text/plain'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // Set headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Last-Modified', stats.mtime.toUTCString());
        res.setHeader('Cache-Control', 'public, max-age=3600');

        // Handle range requests for large files
        const range = req.headers.range;
        if (range && stats.size > 0) {
            this.handleRangeRequest(req, res, filePath, stats);
            return;
        }

        // Stream the file
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);

        stream.on('error', (err) => {
            console.error('Error streaming file:', err);
            if (!res.headersSent) {
                this.sendError(res, 500, 'Error reading file');
            }
        });
    }

    // Handle range requests
    handleRangeRequest(req, res, filePath, stats) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        const chunksize = (end - start) + 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stats.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize
        });

        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
    }

    // Track connections
    trackConnection(socket, serverType) {
        const connectionId = `${serverType}-${Date.now()}-${Math.random()}`;
        this.connections.set(connectionId, { socket, serverType, startTime: Date.now() });
        this.stats.activeConnections++;

        socket.on('close', () => {
            this.connections.delete(connectionId);
            this.stats.activeConnections--;
        });
    }

    // Check if port is available
    async isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.close();
                resolve(true);
            });
            server.on('error', () => {
                resolve(false);
            });
        });
    }

    // Send error response
    sendError(res, statusCode, message) {
        this.stats.errors++;
        res.writeHead(statusCode, { 'Content-Type': 'text/html' });
        res.end(`<h1>${statusCode} - ${message}</h1>`);
    }

    // Handle server errors
    handleServerError(err, serverType) {
        console.error(`Server error on ${serverType}:`, err);
        this.stats.errors++;
        this.stats.servers[serverType].errors++;
    }

    // Setup graceful shutdown
    setupGracefulShutdown() {
        const shutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
            
            // Close all servers
            this.servers.forEach((server, name) => {
                console.log(`🔒 Closing ${name} server...`);
                server.close();
            });

            // Close all WebSocket servers
            this.websocketServers.forEach((wss, name) => {
                console.log(`🔒 Closing ${name} WebSocket server...`);
                wss.close();
            });

            // Close all connections
            this.connections.forEach((conn, id) => {
                console.log(`🔒 Closing connection ${id}...`);
                conn.socket.destroy();
            });

            console.log('✅ All servers and connections closed.');
            process.exit(0);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }

    // Display server status
    displayStatus() {
        console.log('\n📊 Server Status:');
        console.log('================');
        
        Object.entries(CONFIG).forEach(([key, config]) => {
            if (key !== 'global') {
                const status = config.enabled ? '✅' : '❌';
                const server = this.servers.get(key);
                const wss = this.websocketServers.get(key);
                const isRunning = server || wss;
                const runningStatus = isRunning ? '🟢 Running' : '🔴 Stopped';
                
                console.log(`${status} ${config.description}:`);
                console.log(`   Port: ${config.port}`);
                console.log(`   Status: ${runningStatus}`);
                
                if (this.stats.servers[key]) {
                    const stats = this.stats.servers[key];
                    if (stats.startTime) {
                        const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
                        console.log(`   Uptime: ${uptime}s`);
                        console.log(`   Requests: ${stats.requests}`);
                        console.log(`   Errors: ${stats.errors}`);
                    }
                }
                console.log('');
            }
        });
        
        console.log(`🌐 Total Requests: ${this.stats.totalRequests}`);
        console.log(`🔌 Active Connections: ${this.stats.activeConnections}`);
        console.log(`❌ Total Errors: ${this.stats.errors}`);
    }
}

// Main execution
async function main() {
    const server = new UnifiedServer();
    
    try {
        await server.init();
        
        // Display status every 30 seconds
        setInterval(() => {
            server.displayStatus();
        }, 30000);
        
    } catch (error) {
        console.error('❌ Failed to start unified server:', error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = { UnifiedServer, CONFIG }; 