/**
 * Enhanced Agentic Chatbot Integration - LangGraph Version
 * Advanced autonomous AI assistant with workflow capabilities
 */

class EnhancedAgenticChatbotClient {
    constructor(config = {}) {
        this.config = {
            // Primary LangGraph API
            primary: {
                baseURL: 'http://localhost:5001',
                endpoints: {
                    chat: '/chat',
                    status: '/status',
                    tools: '/tools',
                    session: '/session'
                },
                timeout: 30000, // Increased for LangGraph workflows
                retries: 3
            },
            
            // Fallback API
            fallback: {
                baseURL: 'http://localhost:5003',
                endpoints: {
                    chat: '/chat/send',
                    health: '/health',
                    status: '/admin/status'
                },
                timeout: 10000,
                retries: 2
            },
            
            // UI Configuration
            ui: {
                avatar: '🤖',
                typingSpeed: 50,
                maxRetries: 3,
                sessionTimeout: 3600000, // 1 hour
                enableTypingIndicator: true,
                enableSound: false,
                theme: 'dark',
                showConfidenceScore: true,
                showSuggestedActions: true,
                showWorkflowStatus: true
            },
            
            // Session Management
            session: {
                autoGenerate: true,
                prefix: 'enhanced_session',
                storageKey: 'enhanced_agentic_chatbot_session'
            },
            
            // Error Handling
            errorHandling: {
                showUserFriendlyErrors: true,
                logErrors: true,
                fallbackMessage: "I'm having trouble connecting right now. Please try again in a moment.",
                retryMessage: "Let me try that again..."
            },
            
            // LangGraph specific
            langgraph: {
                enableWorkflows: true,
                showWorkflowSteps: true,
                enableStatePersistence: true,
                enableMultiAgent: true,
                enableFeedbackLoops: true
            },
            
            ...config
        };
        
        this.currentSession = null;
        this.isConnected = false;
        this.retryCount = 0;
        this.usingFallback = false;
        this.workflowHistory = [];
        this.userPreferences = {};
        this.conversationContext = {};
    }
    
    /**
     * Initialize the enhanced agentic chatbot client
     */
    async initialize() {
        try {
            console.log('🚀 Initializing Enhanced Agentic Chatbot Client...');
            
            // Check primary LangGraph connection
            const primaryStatus = await this.checkConnection(this.config.primary);
            if (primaryStatus) {
                this.isConnected = true;
                this.usingFallback = false;
                console.log('✅ Connected to Enhanced Agentic Chatbot (LangGraph)');
                
                // Load user preferences and context
                await this.loadUserPreferences();
                await this.loadConversationContext();
                
                return true;
            }
            
            // Fallback to basic chatbot
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
     * Send a message to the enhanced agentic chatbot
     */
    async sendMessage(message, sessionId = null, options = {}) {
        if (!this.isConnected) {
            throw new Error('Chatbot not connected');
        }
        
        const apiConfig = this.usingFallback ? this.config.fallback : this.config.primary;
        
        try {
            // Generate session ID if not provided
            if (!sessionId) {
                sessionId = this.generateSessionId();
            }
            
            // Prepare enhanced payload for LangGraph
            const payload = {
                message: message,
                session_id: sessionId,
                user_id: options.userId || 'website_user',
                context: {
                    user_type: 'portfolio_visitor',
                    source: 'enhanced_website_chatbot',
                    preferences: this.userPreferences,
                    conversation_context: this.conversationContext,
                    workflow_options: {
                        enable_memory: this.config.langgraph.enableStatePersistence,
                        enable_multi_agent: this.config.langgraph.enableMultiAgent,
                        enable_feedback_loops: this.config.langgraph.enableFeedbackLoops
                    }
                },
                options: {
                    show_workflow_steps: this.config.langgraph.showWorkflowSteps,
                    show_confidence_score: this.config.ui.showConfidenceScore,
                    show_suggested_actions: this.config.ui.showSuggestedActions
                }
            };
            
            console.log('🤖 Sending message to Enhanced Agentic Chatbot:', message);
            
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
            
            // Update workflow history
            if (result.metadata && result.metadata.workflow_step) {
                this.workflowHistory.push({
                    step: result.metadata.workflow_step,
                    intent: result.metadata.intent,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Update conversation context
            this.updateConversationContext(message, result.response, result.metadata);
            
            return {
                success: true,
                response: result.response,
                sessionId: sessionId,
                metadata: result.metadata || {},
                confidenceScore: result.confidence_score || 0.8,
                suggestedActions: result.suggested_actions || [],
                workflowStatus: result.workflow_status || 'completed',
                usingFallback: this.usingFallback,
                langgraphFeatures: {
                    workflowSteps: result.metadata?.workflow_step || 0,
                    intent: result.metadata?.intent || 'unknown',
                    toolsUsed: result.metadata?.tools_used || [],
                    stateful: this.config.langgraph.enableStatePersistence
                }
            };
            
        } catch (error) {
            console.error('Send message error:', error);
            
            // Retry with fallback if using primary
            if (!this.usingFallback && this.retryCount < this.config.primary.retries) {
                this.retryCount++;
                console.log(`Retrying with fallback (attempt ${this.retryCount})`);
                this.usingFallback = true;
                return await this.sendMessage(message, sessionId, options);
            }
            
            return {
                success: false,
                error: error.message,
                fallbackMessage: this.config.errorHandling.fallbackMessage,
                retryMessage: this.config.errorHandling.retryMessage
            };
        }
    }
    
    /**
     * Get system status with enhanced information
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
                    status: status,
                    enhancedFeatures: {
                        langgraph: !this.usingFallback,
                        workflows: this.config.langgraph.enableWorkflows,
                        stateful: this.config.langgraph.enableStatePersistence,
                        multiAgent: this.config.langgraph.enableMultiAgent,
                        feedbackLoops: this.config.langgraph.enableFeedbackLoops
                    },
                    sessionInfo: {
                        currentSession: this.currentSession,
                        workflowHistory: this.workflowHistory,
                        userPreferences: this.userPreferences
                    }
                };
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
        
        return { connected: false };
    }
    
    /**
     * Get available tools and capabilities
     */
    async getTools() {
        if (!this.isConnected || this.usingFallback) {
            return [];
        }
        
        try {
            const response = await fetch(`${this.config.primary.baseURL}/tools`);
            if (response.ok) {
                const tools = await response.json();
                return tools.tools || [];
            }
        } catch (error) {
            console.error('Tools fetch error:', error);
        }
        
        return [];
    }
    
    /**
     * Get session information
     */
    async getSession(sessionId = null) {
        if (!this.isConnected || this.usingFallback) {
            return null;
        }
        
        const targetSession = sessionId || this.currentSession;
        if (!targetSession) {
            return null;
        }
        
        try {
            const response = await fetch(`${this.config.primary.baseURL}/session/${targetSession}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Session fetch error:', error);
        }
        
        return null;
    }
    
    /**
     * Load user preferences from localStorage
     */
    async loadUserPreferences() {
        try {
            const stored = localStorage.getItem('agentic_user_preferences');
            if (stored) {
                this.userPreferences = JSON.parse(stored);
            } else {
                this.userPreferences = {
                    theme: 'dark',
                    language: 'en',
                    response_style: 'friendly',
                    show_workflow_steps: true,
                    show_confidence_scores: true,
                    enable_suggestions: true
                };
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
            this.userPreferences = {};
        }
    }
    
    /**
     * Save user preferences to localStorage
     */
    async saveUserPreferences(preferences) {
        try {
            this.userPreferences = { ...this.userPreferences, ...preferences };
            localStorage.setItem('agentic_user_preferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }
    
    /**
     * Load conversation context
     */
    async loadConversationContext() {
        try {
            const stored = localStorage.getItem('agentic_conversation_context');
            if (stored) {
                this.conversationContext = JSON.parse(stored);
            } else {
                this.conversationContext = {
                    topics_discussed: [],
                    user_interests: [],
                    last_interaction: null,
                    conversation_flow: 'initial'
                };
            }
        } catch (error) {
            console.error('Error loading conversation context:', error);
            this.conversationContext = {};
        }
    }
    
    /**
     * Update conversation context
     */
    updateConversationContext(message, response, metadata) {
        try {
            // Update topics discussed
            if (metadata && metadata.intent) {
                if (!this.conversationContext.topics_discussed.includes(metadata.intent)) {
                    this.conversationContext.topics_discussed.push(metadata.intent);
                }
            }
            
            // Update last interaction
            this.conversationContext.last_interaction = new Date().toISOString();
            
            // Update conversation flow
            if (metadata && metadata.workflow_step) {
                this.conversationContext.conversation_flow = `step_${metadata.workflow_step}`;
            }
            
            // Save to localStorage
            localStorage.setItem('agentic_conversation_context', JSON.stringify(this.conversationContext));
        } catch (error) {
            console.error('Error updating conversation context:', error);
        }
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
        this.workflowHistory = [];
        this.conversationContext = {};
        localStorage.removeItem(this.config.session.storageKey);
        localStorage.removeItem('agentic_conversation_context');
    }
    
    /**
     * Get workflow history
     */
    getWorkflowHistory() {
        return this.workflowHistory;
    }
    
    /**
     * Get user preferences
     */
    getUserPreferences() {
        return this.userPreferences;
    }
    
    /**
     * Get conversation context
     */
    getConversationContext() {
        return this.conversationContext;
    }
}

/**
 * Enhanced Agentic Chatbot Widget with LangGraph Integration
 */
class EnhancedAgenticChatbotWidget {
    constructor(config = {}) {
        this.config = {
            ...config
        };
        
        this.client = new EnhancedAgenticChatbotClient(this.config);
        this.isInitialized = false;
        this.isVisible = false;
        this.isTyping = false;
        this.messageQueue = [];
        this.workflowSteps = [];
        
        // DOM elements
        this.widget = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.typingIndicator = null;
        this.workflowIndicator = null;
        this.confidenceIndicator = null;
        this.suggestionsContainer = null;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Initialize the enhanced chatbot widget
     */
    async init() {
        try {
            console.log('🤖 Initializing Enhanced Agentic Chatbot Widget...');
            
            // Initialize the API client
            const connected = await this.client.initialize();
            if (!connected) {
                console.error('❌ Failed to connect to enhanced chatbot API');
                return;
            }
            
            // Create the widget HTML
            this.createWidget();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Show welcome message
            await this.showWelcomeMessage();
            
            this.isInitialized = true;
            console.log('✅ Enhanced Agentic Chatbot Widget initialized successfully');
            
        } catch (error) {
            console.error('❌ Widget initialization error:', error);
        }
    }
    
    /**
     * Create the enhanced chatbot widget HTML
     */
    createWidget() {
        // Create main widget container
        this.widget = document.createElement('div');
        this.widget.id = 'enhanced-agentic-chatbot-widget';
        this.widget.className = 'enhanced-agentic-chatbot-widget';
        this.widget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            height: 600px;
            background: rgba(0, 0, 0, 0.95);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
            flex-direction: column;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 238, 0.3);
            font-family: 'Poppins', sans-serif;
            color: #fff;
        `;
        
        // Create header with enhanced styling
        const header = document.createElement('div');
        header.className = 'chatbot-header';
        header.style.cssText = `
            background: linear-gradient(135deg, #00ffee, #00ccbb);
            color: #000;
            padding: 15px;
            border-radius: 15px 15px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
        `;
        
        const title = document.createElement('h3');
        title.textContent = '🤖 Enhanced Agentic AI';
        title.style.margin = '0';
        title.style.fontSize = '1.1rem';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.className = 'chatbot-close';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: #000;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        `;
        
        closeButton.addEventListener('click', () => this.hide());
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create workflow indicator
        this.workflowIndicator = document.createElement('div');
        this.workflowIndicator.className = 'workflow-indicator';
        this.workflowIndicator.style.cssText = `
            display: none;
            padding: 8px 15px;
            background: rgba(0, 255, 238, 0.1);
            border-left: 3px solid #00ffee;
            font-size: 0.8rem;
            color: #00ffee;
        `;
        
        // Create messages container
        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'chatbot-messages';
        this.messagesContainer.style.cssText = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 400px;
        `;
        
        // Create typing indicator
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'typing-indicator';
        this.typingIndicator.style.cssText = `
            display: none;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
            font-size: 0.9rem;
            color: #ccc;
        `;
        this.typingIndicator.innerHTML = '🤖 AI is thinking...';
        
        // Create confidence indicator
        this.confidenceIndicator = document.createElement('div');
        this.confidenceIndicator.className = 'confidence-indicator';
        this.confidenceIndicator.style.cssText = `
            display: none;
            padding: 5px 10px;
            background: rgba(0, 255, 238, 0.1);
            border-radius: 10px;
            font-size: 0.7rem;
            color: #00ffee;
            align-self: flex-start;
            margin-top: 5px;
        `;
        
        // Create suggestions container
        this.suggestionsContainer = document.createElement('div');
        this.suggestionsContainer.className = 'suggestions-container';
        this.suggestionsContainer.style.cssText = `
            display: none;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.05);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        // Create input container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'chatbot-input';
        inputContainer.style.cssText = `
            padding: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 10px;
        `;
        
        // Create input field
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.placeholder = 'Type your message...';
        this.inputField.className = 'chatbot-input-field';
        this.inputField.style.cssText = `
            flex: 1;
            padding: 10px 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 0.9rem;
            outline: none;
        `;
        
        // Create send button
        this.sendButton = document.createElement('button');
        this.sendButton.innerHTML = '➤';
        this.sendButton.className = 'chatbot-send';
        this.sendButton.style.cssText = `
            background: #00ffee;
            color: #000;
            border: none;
            padding: 10px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        inputContainer.appendChild(this.inputField);
        inputContainer.appendChild(this.sendButton);
        
        // Create toggle button
        this.toggleButton = document.createElement('button');
        this.toggleButton.innerHTML = '🤖';
        this.toggleButton.className = 'enhanced-agentic-chatbot-toggle';
        this.toggleButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #00ffee, #00ccbb);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        // Assemble widget
        this.widget.appendChild(header);
        this.widget.appendChild(this.workflowIndicator);
        this.widget.appendChild(this.messagesContainer);
        this.widget.appendChild(this.typingIndicator);
        this.widget.appendChild(this.confidenceIndicator);
        this.widget.appendChild(this.suggestionsContainer);
        this.widget.appendChild(inputContainer);
        
        // Add to page
        document.body.appendChild(this.widget);
        document.body.appendChild(this.toggleButton);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Toggle button
        this.toggleButton.addEventListener('click', () => this.toggle());
        
        // Send button
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Input field
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    /**
     * Show welcome message
     */
    async showWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: "Hello! I'm your Enhanced Agentic AI Assistant powered by LangGraph. I can handle complex workflows, maintain conversation context, and provide intelligent responses. How can I assist you today? 🚀",
            timestamp: new Date().toISOString(),
            enhanced: true
        };
        
        this.addMessage(welcomeMessage);
    }
    
    /**
     * Toggle widget visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Show widget
     */
    show() {
        this.widget.style.display = 'flex';
        this.toggleButton.style.display = 'none';
        this.isVisible = true;
        this.inputField.focus();
    }
    
    /**
     * Hide widget
     */
    hide() {
        this.widget.style.display = 'none';
        this.toggleButton.style.display = 'flex';
        this.isVisible = false;
    }
    
    /**
     * Send a message
     */
    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isTyping) return;
        
        // Clear input
        this.inputField.value = '';
        
        // Add user message
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        this.addMessage(userMessage);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send to enhanced agentic chatbot
            const result = await this.client.sendMessage(message);
            
            if (result.success) {
                // Add bot response
                const botMessage = {
                    type: 'bot',
                    content: result.response,
                    timestamp: new Date().toISOString(),
                    metadata: result.metadata,
                    confidenceScore: result.confidenceScore,
                    suggestedActions: result.suggestedActions,
                    workflowStatus: result.workflowStatus,
                    langgraphFeatures: result.langgraphFeatures,
                    enhanced: true
                };
                this.addMessage(botMessage);
                
                // Show workflow steps if available
                if (result.langgraphFeatures && result.langgraphFeatures.workflowSteps > 0) {
                    this.showWorkflowSteps(result.langgraphFeatures);
                }
                
                // Show confidence score if available
                if (result.confidenceScore) {
                    this.showConfidenceScore(result.confidenceScore);
                }
                
                // Show suggested actions if available
                if (result.suggestedActions && result.suggestedActions.length > 0) {
                    this.showSuggestedActions(result.suggestedActions);
                }
                
            } else {
                // Show error message
                const errorMessage = {
                    type: 'bot',
                    content: result.fallbackMessage || 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date().toISOString(),
                    isError: true
                };
                this.addMessage(errorMessage);
            }
            
        } catch (error) {
            console.error('Send message error:', error);
            
            const errorMessage = {
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString(),
                isError: true
            };
            this.addMessage(errorMessage);
        }
        
        // Hide typing indicator
        this.hideTypingIndicator();
    }
    
    /**
     * Add a message to the chat
     */
    addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        messageElement.style.cssText = `
            padding: 10px 15px;
            border-radius: 15px;
            max-width: 80%;
            word-wrap: break-word;
            animation: fadeIn 0.3s ease;
        `;
        
        if (message.type === 'user') {
            messageElement.style.cssText += `
                background: #00ffee;
                color: #000;
                align-self: flex-end;
                border-bottom-right-radius: 5px;
            `;
        } else {
            messageElement.style.cssText += `
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                align-self: flex-start;
                border-bottom-left-radius: 5px;
            `;
            
            if (message.isError) {
                messageElement.style.background = 'rgba(255, 0, 0, 0.2)';
            }
            
            if (message.enhanced) {
                messageElement.style.borderLeft = '3px solid #00ffee';
            }
        }
        
        messageElement.textContent = message.content;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    /**
     * Show workflow steps
     */
    showWorkflowSteps(langgraphFeatures) {
        if (!this.config.ui.showWorkflowStatus) return;
        
        const steps = langgraphFeatures.workflowSteps;
        const intent = langgraphFeatures.intent;
        
        this.workflowIndicator.innerHTML = `🔄 Workflow Step ${steps} | Intent: ${intent}`;
        this.workflowIndicator.style.display = 'block';
        
        setTimeout(() => {
            this.workflowIndicator.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Show confidence score
     */
    showConfidenceScore(score) {
        if (!this.config.ui.showConfidenceScore) return;
        
        const percentage = Math.round(score * 100);
        this.confidenceIndicator.innerHTML = `🎯 Confidence: ${percentage}%`;
        this.confidenceIndicator.style.display = 'block';
        
        setTimeout(() => {
            this.confidenceIndicator.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Show suggested actions
     */
    showSuggestedActions(actions) {
        if (!this.config.ui.showSuggestedActions || !actions.length) return;
        
        this.suggestionsContainer.innerHTML = '';
        this.suggestionsContainer.style.display = 'block';
        
        const title = document.createElement('div');
        title.textContent = '💡 Suggested Actions:';
        title.style.cssText = `
            font-size: 0.8rem;
            color: #00ffee;
            margin-bottom: 5px;
        `;
        this.suggestionsContainer.appendChild(title);
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action;
            button.style.cssText = `
                background: rgba(0, 255, 238, 0.1);
                border: 1px solid #00ffee;
                color: #00ffee;
                padding: 5px 10px;
                margin: 2px;
                border-radius: 10px;
                font-size: 0.7rem;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('click', () => {
                this.inputField.value = action;
                this.sendMessage();
            });
            
            this.suggestionsContainer.appendChild(button);
        });
        
        setTimeout(() => {
            this.suggestionsContainer.style.display = 'none';
        }, 10000);
    }
    
    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }
    
    /**
     * Scroll to bottom of messages
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    /**
     * Get widget status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            visible: this.isVisible,
            connected: this.client.isConnected,
            usingFallback: this.client.usingFallback,
            sessionId: this.client.getCurrentSession(),
            workflowHistory: this.client.getWorkflowHistory(),
            userPreferences: this.client.getUserPreferences(),
            conversationContext: this.client.getConversationContext()
        };
    }
}

// Initialize when script is loaded
let enhancedAgenticChatbotWidget = null;

// Auto-initialize if config is available
if (typeof AGENTIC_CHATBOT_CONFIG !== 'undefined') {
    enhancedAgenticChatbotWidget = new EnhancedAgenticChatbotWidget();
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnhancedAgenticChatbotClient, EnhancedAgenticChatbotWidget };
} else {
    window.EnhancedAgenticChatbotClient = EnhancedAgenticChatbotClient;
    window.EnhancedAgenticChatbotWidget = EnhancedAgenticChatbotWidget;
}
