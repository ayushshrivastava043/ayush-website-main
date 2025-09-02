/**
 * Agentic Chatbot Configuration for Website Integration
 * Connects to the standalone agentic chatbot system
 */

const AGENTIC_CHATBOT_CONFIG = {
    // Primary agentic chatbot API (standalone system)
    primary: {
        baseURL: 'http://localhost:5001',
        endpoints: {
            chat: '/chat',
            status: '/status',
            tools: '/tools',
            session: '/session'
        },
        timeout: 10000,
        retries: 3
    },
    
    // Fallback mock chatbot API
    fallback: {
        baseURL: 'http://localhost:5003',
        endpoints: {
            chat: '/chat/send',
            health: '/health',
            status: '/admin/status'
        },
        timeout: 5000,
        retries: 2
    },
    
    // Agentic system (avatar portal)
    agenticSystem: {
        baseURL: 'http://localhost:5002',
        endpoints: {
            home: '/',
            api: '/api'
        }
    },
    
    // UI Configuration
    ui: {
        avatar: '🤖',
        typingSpeed: 50,
        maxRetries: 3,
        sessionTimeout: 300000, // 5 minutes
        enableTypingIndicator: true,
        enableSound: false,
        theme: 'dark'
    },
    
    // Session Management
    session: {
        autoGenerate: true,
        prefix: 'website_session',
        storageKey: 'agentic_chatbot_session'
    },
    
    // Error Handling
    errorHandling: {
        showUserFriendlyErrors: true,
        logErrors: true,
        fallbackMessage: "I'm having trouble connecting right now. Please try again in a moment."
    }
};

/**
 * Agentic Chatbot API Client
 */
class AgenticChatbotClient {
    constructor(config = AGENTIC_CHATBOT_CONFIG) {
        this.config = config;
        this.currentSession = null;
        this.isConnected = false;
        this.retryCount = 0;
        this.usingFallback = false;
    }
    
    /**
     * Initialize the chatbot client
     */
    async initialize() {
        try {
            // Check primary connection
            const primaryStatus = await this.checkConnection(this.config.primary);
            if (primaryStatus) {
                this.isConnected = true;
                this.usingFallback = false;
                console.log('✅ Connected to primary agentic chatbot');
                return true;
            }
            
            // Fallback to mock chatbot
            const fallbackStatus = await this.checkConnection(this.config.fallback);
            if (fallbackStatus) {
                this.isConnected = true;
                this.usingFallback = true;
                console.log('⚠️ Using fallback chatbot API');
                return true;
            }
            
            console.error('❌ No chatbot API available');
            return false;
            
        } catch (error) {
            console.error('Initialization error:', error);
            return false;
        }
    }
    
    /**
     * Check connection to an API
     */
    async checkConnection(apiConfig) {
        try {
            const response = await fetch(`${apiConfig.baseURL}/status`, {
                method: 'GET',
                timeout: apiConfig.timeout
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Send a message to the chatbot
     */
    async sendMessage(message, sessionId = null) {
        if (!this.isConnected) {
            throw new Error('Chatbot not connected');
        }
        
        const apiConfig = this.usingFallback ? this.config.fallback : this.config.primary;
        
        try {
            // Generate session ID if not provided
            if (!sessionId) {
                sessionId = this.generateSessionId();
            }
            
            const payload = {
                message: message,
                session_id: sessionId
            };
            
            const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.chat}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                timeout: apiConfig.timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Store session ID
            this.currentSession = sessionId;
            localStorage.setItem(this.config.session.storageKey, sessionId);
            
            return {
                success: true,
                response: result.response || result.message,
                sessionId: sessionId,
                metadata: result.metadata || {},
                usingFallback: this.usingFallback
            };
            
        } catch (error) {
            console.error('Send message error:', error);
            
            // Retry with fallback if using primary
            if (!this.usingFallback && this.retryCount < this.config.primary.retries) {
                this.retryCount++;
                console.log(`Retrying with fallback (attempt ${this.retryCount})`);
                this.usingFallback = true;
                return await this.sendMessage(message, sessionId);
            }
            
            return {
                success: false,
                error: error.message,
                fallbackMessage: this.config.errorHandling.fallbackMessage
            };
        }
    }
    
    /**
     * Get system status
     */
    async getStatus() {
        if (!this.isConnected) {
            return { connected: false };
        }
        
        const apiConfig = this.usingFallback ? this.config.fallback : this.config.primary;
        
        try {
            const response = await fetch(`${apiConfig.baseURL}/status`);
            if (response.ok) {
                const status = await response.json();
                return {
                    connected: true,
                    usingFallback: this.usingFallback,
                    status: status
                };
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
        
        return { connected: false };
    }
    
    /**
     * Get available tools
     */
    async getTools() {
        if (!this.isConnected || this.usingFallback) {
            return [];
        }
        
        try {
            const response = await fetch(`${this.config.primary.baseURL}/tools`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Tools fetch error:', error);
        }
        
        return [];
    }
    
    /**
     * Generate a session ID
     */
    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `${this.config.session.prefix}_${timestamp}_${random}`;
    }
    
    /**
     * Get current session ID
     */
    getCurrentSession() {
        if (this.currentSession) {
            return this.currentSession;
        }
        
        const stored = localStorage.getItem(this.config.session.storageKey);
        if (stored) {
            this.currentSession = stored;
            return stored;
        }
        
        return null;
    }
    
    /**
     * Clear current session
     */
    clearSession() {
        this.currentSession = null;
        localStorage.removeItem(this.config.session.storageKey);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AGENTIC_CHATBOT_CONFIG, AgenticChatbotClient };
} else {
    // Browser environment
    window.AGENTIC_CHATBOT_CONFIG = AGENTIC_CHATBOT_CONFIG;
    window.AgenticChatbotClient = AgenticChatbotClient;
}
