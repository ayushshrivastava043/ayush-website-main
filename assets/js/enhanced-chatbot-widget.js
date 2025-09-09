/**
 * 🚀 ENHANCED AGENTIC CHATBOT WIDGET - LangGraph Integration
 * 
 * This is an enhanced version of the portable chatbot widget that integrates
 * with the new LangGraph-based agentic chatbot system.
 * 
 * Features:
 * - LangGraph workflow visualization
 * - Stateful conversations with memory
 * - Multi-agent system capabilities
 * - Confidence scoring and suggestions
 * - Enhanced UI with workflow indicators
 * - Backward compatibility with existing system
 * 
 * Usage:
 * <script src="enhanced-chatbot-widget.js"></script>
 * <script>
 *   new EnhancedChatbotWidget({
 *     avatarType: 'robot',
 *     position: 'bottom-right',
 *     enableLangGraph: true
 *   });
 * </script>
 */

(function() {
    'use strict';
    
    class EnhancedChatbotWidget {
        constructor(options = {}) {
            const startTime = performance.now();
            console.log('🚀 [PERF] EnhancedChatbotWidget constructor started at:', startTime);
            
            // Enhanced configuration with LangGraph features
            this.config = {
                // Avatar Configuration
                avatarType: options.avatarType || 'assistant',
                avatarName: options.avatarName || 'Enhanced AI Assistant',
                avatarImage: options.avatarImage || 'assets/relaxed-chatbot-final.gif',
                avatarColor: options.avatarColor || '#00ffee',
                
                // Position Configuration
                position: options.position || 'bottom-right',
                offsetX: options.offsetX || 20,
                offsetY: options.offsetY || 20,
                
                // Theme Configuration
                theme: options.theme || 'dark',
                customCSS: options.customCSS || null,
                
                // Enhanced LangGraph Features
                enableLangGraph: options.enableLangGraph !== false, // Default true
                showWorkflowSteps: options.showWorkflowSteps !== false, // Default true
                showConfidenceScore: options.showConfidenceScore !== false, // Default true
                showSuggestedActions: options.showSuggestedActions !== false, // Default true
                enableStatePersistence: options.enableStatePersistence !== false, // Default true
                
                // API Configuration
                apiEndpoint: options.apiEndpoint || null,
                fallbackEndpoint: options.fallbackEndpoint || 'http://localhost:5003/chat/send',
                enhancedEndpoint: options.enhancedEndpoint || 'http://localhost:5001/chat',
                
                // Functionality
                autoStart: options.autoStart !== false, // Default true
                enableSound: options.enableSound || false,
                enableTypingIndicator: options.enableTypingIndicator !== false, // Default true
                enableAnimations: options.enableAnimations !== false, // Default true
                
                // Performance
                maxMessages: options.maxMessages || 50,
                messageTimeout: options.messageTimeout || 30000,
                retryAttempts: options.retryAttempts || 3,
                
                // UI Configuration
                widgetSize: options.widgetSize || { width: 400, height: 600 },
                borderRadius: options.borderRadius || 15,
                shadowIntensity: options.shadowIntensity || 0.5,
                
                // LangGraph Specific
                workflowTimeout: options.workflowTimeout || 30000,
                enableMultiAgent: options.enableMultiAgent !== false, // Default true
                enableFeedbackLoops: options.enableFeedbackLoops !== false, // Default true
                
                ...options
            };
            
            // State management
            this.isInitialized = false;
            this.isVisible = false;
            this.isTyping = false;
            this.isConnected = false;
            this.usingEnhancedAPI = false;
            this.currentSession = null;
            this.messageQueue = [];
            this.workflowHistory = [];
            this.userPreferences = {};
            this.conversationContext = {};
            
            // DOM elements
            this.widget = null;
            this.toggleButton = null;
            this.messagesContainer = null;
            this.inputField = null;
            this.sendButton = null;
            this.typingIndicator = null;
            this.workflowIndicator = null;
            this.confidenceIndicator = null;
            this.suggestionsContainer = null;
            
            // Performance tracking
            this.performanceMetrics = {
                initializationTime: 0,
                messageResponseTime: 0,
                workflowExecutionTime: 0,
                totalMessages: 0,
                successfulMessages: 0,
                failedMessages: 0
            };
            
            console.log('🚀 [PERF] Configuration loaded in:', performance.now() - startTime, 'ms');
            
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
            const initStartTime = performance.now();
            console.log('🤖 Initializing Enhanced Agentic Chatbot Widget...');
            
            try {
                // Check API connectivity
                await this.checkAPIConnectivity();
                
                // Create the widget HTML
                this.createWidget();
                
                // Set up event listeners
                this.setupEventListeners();
                
                // Load user preferences and context
                await this.loadUserPreferences();
                await this.loadConversationContext();
                
                // Show welcome message
                await this.showWelcomeMessage();
                
                this.isInitialized = true;
                this.performanceMetrics.initializationTime = performance.now() - initStartTime;
                
                console.log('✅ Enhanced Agentic Chatbot Widget initialized successfully');
                console.log('🚀 [PERF] Total initialization time:', this.performanceMetrics.initializationTime, 'ms');
                
                // Auto-start if enabled
                if (this.config.autoStart) {
                    this.show();
                }
                
            } catch (error) {
                console.error('❌ Widget initialization error:', error);
                this.showFallbackMessage('Failed to initialize enhanced chatbot. Using fallback mode.');
            }
        }
        
        /**
         * Check API connectivity for both enhanced and fallback endpoints
         */
        async checkAPIConnectivity() {
            console.log('🔍 Checking API connectivity...');
            
            // Check enhanced LangGraph API
            if (this.config.enableLangGraph) {
                try {
                    const response = await fetch(`${this.config.enhancedEndpoint.replace('/chat', '/status')}`, {
                        method: 'GET',
                        timeout: 5000
                    });
                    
                    if (response.ok) {
                        this.isConnected = true;
                        this.usingEnhancedAPI = true;
                        console.log('✅ Connected to Enhanced Agentic Chatbot (LangGraph)');
                        return;
                    }
                } catch (error) {
                    console.log('⚠️ Enhanced API not available:', error.message);
                }
            }
            
            // Fallback to basic chatbot API
            try {
                const response = await fetch(`${this.config.fallbackEndpoint.replace('/chat/send', '/health')}`, {
                    method: 'GET',
                    timeout: 5000
                });
                
                if (response.ok) {
                    this.isConnected = true;
                    this.usingEnhancedAPI = false;
                    console.log('⚠️ Using fallback chatbot API');
                    return;
                }
            } catch (error) {
                console.log('⚠️ Fallback API not available:', error.message);
            }
            
            console.log('❌ No chatbot API available - will use mock responses');
            this.isConnected = false;
        }
        
        /**
         * Create the enhanced chatbot widget HTML
         */
        createWidget() {
            console.log('🎨 Creating enhanced chatbot widget with original avatar system...');
            
            // Create main widget container - RESTORED ORIGINAL AVATAR SYSTEM
            this.widget = document.createElement('div');
            this.widget.id = 'enhanced-agentic-chatbot-widget';
            this.widget.className = 'enhanced-agentic-chatbot-widget';
            
            // Use original avatar positioning system
            const position = this.getPositionStyles();
            this.widget.style.cssText = position;
            
            // Generate the original avatar-based HTML
            this.widget.innerHTML = this.generateAvatarHTML();
            
            // Add to DOM
            document.body.appendChild(this.widget);
            
            // Store element references for the original avatar system
            this.elements = {
                container: this.widget,
                avatar: this.widget.querySelector('.chatbot-avatar'),
                typingBox: this.widget.querySelector('#enhancedChatbotTypingBox'),
                input: this.widget.querySelector('#enhancedChatbotInput'),
                sendBtn: this.widget.querySelector('#enhancedChatbotSendBtn'),
                bubbleContainer: this.widget.querySelector('#enhancedChatbotBubbleContainer'),
                welcomeBubble: this.widget.querySelector('#enhancedChatbotWelcomeBubble'),
                langgraphIndicator: this.widget.querySelector('.langgraph-enhancement-indicator'),
                workflowSteps: this.widget.querySelector('.workflow-steps'),
                confidenceIndicator: this.widget.querySelector('.confidence-indicator'),
                suggestedActions: this.widget.querySelector('.suggested-actions')
            };
            
            console.log('✅ Enhanced chatbot widget created successfully with original avatar system');
            
            // Add LangGraph indicator
            const langgraphIndicator = document.createElement('div');
            langgraphIndicator.className = 'langgraph-indicator';
            langgraphIndicator.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(0, 0, 0, 0.2);
                color: #000;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 0.6rem;
                font-weight: bold;
            `;
            langgraphIndicator.textContent = this.usingEnhancedAPI ? 'LangGraph' : 'Fallback';
            
            const title = document.createElement('h3');
            title.textContent = `🤖 ${this.config.avatarName}`;
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
            header.appendChild(langgraphIndicator);
            
            // Create workflow indicator
            this.workflowIndicator = document.createElement('div');
            this.workflowIndicator.className = 'workflow-indicator';
            this.workflowIndicator.style.cssText = `
                display: none;
                padding: 8px 15px;
                background: rgba(0, 255, 238, 0.1);
                border-left: 3px solid ${this.config.avatarColor};
                font-size: 0.8rem;
                color: ${this.config.avatarColor};
                animation: pulse 2s infinite;
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
                color: ${this.config.avatarColor};
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
                transition: border-color 0.3s ease;
            `;
            
            // Create send button
            this.sendButton = document.createElement('button');
            this.sendButton.innerHTML = '➤';
            this.sendButton.className = 'chatbot-send';
            this.sendButton.style.cssText = `
                background: ${this.config.avatarColor};
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
            
            // Create enhanced toggle button
            this.toggleButton = document.createElement('button');
            this.toggleButton.innerHTML = '🤖';
            this.toggleButton.className = 'enhanced-agentic-chatbot-toggle';
            this.toggleButton.style.cssText = `
                position: fixed;
                bottom: ${this.config.offsetY}px;
                right: ${this.config.offsetX}px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, ${this.config.avatarColor}, #00ccbb);
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
                animation: ${this.config.enableAnimations ? 'pulse 2s infinite' : 'none'};
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
            
            // Add CSS animations
            this.addAnimations();
            
            console.log('✅ Enhanced chatbot widget created successfully');
        }
        
        /**
         * Add CSS animations for enhanced user experience
         */
        addAnimations() {
            if (!this.config.enableAnimations) return;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                
                .enhanced-agentic-chatbot-widget {
                    animation: slideIn 0.3s ease-out;
                }
                
                .message {
                    animation: fadeIn 0.3s ease;
                }
                
                .workflow-indicator {
                    animation: pulse 2s infinite;
                }
            `;
            document.head.appendChild(style);
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
            
            // Input field focus effects
            this.inputField.addEventListener('focus', () => {
                this.inputField.style.borderColor = this.config.avatarColor;
            });
            
            this.inputField.addEventListener('blur', () => {
                this.inputField.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });
            
            // Send button hover effects
            this.sendButton.addEventListener('mouseenter', () => {
                this.sendButton.style.transform = 'scale(1.05)';
            });
            
            this.sendButton.addEventListener('mouseleave', () => {
                this.sendButton.style.transform = 'scale(1)';
            });
        }
        
        /**
         * Load user preferences from localStorage
         */
        async loadUserPreferences() {
            try {
                const stored = localStorage.getItem('enhanced_agentic_user_preferences');
                if (stored) {
                    this.userPreferences = JSON.parse(stored);
                } else {
                    this.userPreferences = {
                        theme: this.config.theme,
                        language: 'en',
                        response_style: 'friendly',
                        show_workflow_steps: this.config.showWorkflowSteps,
                        show_confidence_scores: this.config.showConfidenceScore,
                        enable_suggestions: this.config.showSuggestedActions
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
                localStorage.setItem('enhanced_agentic_user_preferences', JSON.stringify(this.userPreferences));
            } catch (error) {
                console.error('Error saving user preferences:', error);
            }
        }
        
        /**
         * Load conversation context
         */
        async loadConversationContext() {
            try {
                const stored = localStorage.getItem('enhanced_agentic_conversation_context');
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
         * Show welcome message
         */
        async showWelcomeMessage() {
            const welcomeMessage = {
                type: 'bot',
                content: this.usingEnhancedAPI 
                    ? "Hello! I'm your Enhanced Agentic AI Assistant powered by LangGraph. I can handle complex workflows, maintain conversation context, and provide intelligent responses. How can I assist you today? 🚀"
                    : "Hello! I'm your AI Assistant. I can help you with questions about Ayush's portfolio and projects. How can I assist you today? 🤖",
                timestamp: new Date().toISOString(),
                enhanced: this.usingEnhancedAPI
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
            
            const messageStartTime = performance.now();
            
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
                let result;
                
                if (this.usingEnhancedAPI) {
                    // Use enhanced LangGraph API
                    result = await this.sendToEnhancedAPI(message);
                } else if (this.isConnected) {
                    // Use fallback API
                    result = await this.sendToFallbackAPI(message);
                } else {
                    // Use mock response
                    result = this.generateMockResponse(message);
                }
                
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
                        enhanced: this.usingEnhancedAPI
                    };
                    this.addMessage(botMessage);
                    
                    // Show enhanced features if available
                    if (this.usingEnhancedAPI && result.langgraphFeatures) {
                        if (result.langgraphFeatures.workflowSteps > 0) {
                            this.showWorkflowSteps(result.langgraphFeatures);
                        }
                        
                        if (result.confidenceScore) {
                            this.showConfidenceScore(result.confidenceScore);
                        }
                        
                        if (result.suggestedActions && result.suggestedActions.length > 0) {
                            this.showSuggestedActions(result.suggestedActions);
                        }
                    }
                    
                    this.performanceMetrics.successfulMessages++;
                } else {
                    // Show error message
                    const errorMessage = {
                        type: 'bot',
                        content: result.fallbackMessage || 'Sorry, I encountered an error. Please try again.',
                        timestamp: new Date().toISOString(),
                        isError: true
                    };
                    this.addMessage(errorMessage);
                    this.performanceMetrics.failedMessages++;
                }
                
                this.performanceMetrics.messageResponseTime = performance.now() - messageStartTime;
                this.performanceMetrics.totalMessages++;
                
            } catch (error) {
                console.error('Send message error:', error);
                
                const errorMessage = {
                    type: 'bot',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date().toISOString(),
                    isError: true
                };
                this.addMessage(errorMessage);
                this.performanceMetrics.failedMessages++;
            }
            
            // Hide typing indicator
            this.hideTypingIndicator();
        }
        
        /**
         * Send message to enhanced LangGraph API
         */
        async sendToEnhancedAPI(message) {
            const sessionId = this.currentSession || this.generateSessionId();
            
            const payload = {
                message: message,
                session_id: sessionId,
                user_id: 'website_user',
                context: {
                    user_type: 'portfolio_visitor',
                    source: 'enhanced_website_chatbot',
                    preferences: this.userPreferences,
                    conversation_context: this.conversationContext,
                    workflow_options: {
                        enable_memory: this.config.enableStatePersistence,
                        enable_multi_agent: this.config.enableMultiAgent,
                        enable_feedback_loops: this.config.enableFeedbackLoops
                    }
                },
                options: {
                    show_workflow_steps: this.config.showWorkflowSteps,
                    show_confidence_score: this.config.showConfidenceScore,
                    show_suggested_actions: this.config.showSuggestedActions
                }
            };
            
            const response = await fetch(this.config.enhancedEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                timeout: this.config.workflowTimeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Store session ID
            this.currentSession = sessionId;
            
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
                langgraphFeatures: {
                    workflowSteps: result.metadata?.workflow_step || 0,
                    intent: result.metadata?.intent || 'unknown',
                    toolsUsed: result.metadata?.tools_used || [],
                    stateful: this.config.enableStatePersistence
                }
            };
        }
        
        /**
         * Send message to fallback API
         */
        async sendToFallbackAPI(message) {
            const sessionId = this.currentSession || this.generateSessionId();
            
            const payload = {
                message: message,
                session_id: sessionId,
                user_id: 'website_user'
            };
            
            const response = await fetch(this.config.fallbackEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                timeout: this.config.messageTimeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            this.currentSession = sessionId;
            
            return {
                success: true,
                response: result.response || result.message,
                sessionId: sessionId,
                metadata: {},
                confidenceScore: 0.7,
                suggestedActions: [],
                workflowStatus: 'completed'
            };
        }
        
        /**
         * Generate mock response for offline mode
         */
        generateMockResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            let response = "I'm currently offline, but I can still help you with basic information about Ayush's portfolio! ";
            
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                response += "Hello! I'm Ayush's AI Assistant. I can tell you about his AI projects, experience, and skills. What would you like to know?";
            } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('project')) {
                response += "Ayush has amazing projects in AI, project management, and business development. He works on AI sales tools, video generation, and API development.";
            } else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
                response += "Ayush is passionate about AI! He works on AI sales tools, video generation, and API development. He has experience with various AI frameworks and tools.";
            } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
                response += "You can reach Ayush through his portfolio contact section or LinkedIn. He's always open to discussing exciting opportunities!";
            } else {
                response += "That's an interesting question! I can help you learn more about Ayush's work, projects, or expertise. What would you like to explore?";
            }
            
            return {
                success: true,
                response: response,
                sessionId: this.generateSessionId(),
                metadata: { intent: 'offline_response' },
                confidenceScore: 0.6,
                suggestedActions: ['Tell me about your portfolio', 'What AI projects have you worked on?', 'How can I contact you?'],
                workflowStatus: 'completed'
            };
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
                localStorage.setItem('enhanced_agentic_conversation_context', JSON.stringify(this.conversationContext));
            } catch (error) {
                console.error('Error updating conversation context:', error);
            }
        }
        
        /**
         * Show workflow steps
         */
        showWorkflowSteps(langgraphFeatures) {
            if (!this.config.showWorkflowSteps) return;
            
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
            if (!this.config.showConfidenceScore) return;
            
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
            if (!this.config.showSuggestedActions || !actions.length) return;
            
            this.suggestionsContainer.innerHTML = '';
            this.suggestionsContainer.style.display = 'block';
            
            const title = document.createElement('div');
            title.textContent = '💡 Suggested Actions:';
            title.style.cssText = `
                font-size: 0.8rem;
                color: ${this.config.avatarColor};
                margin-bottom: 5px;
            `;
            this.suggestionsContainer.appendChild(title);
            
            actions.forEach(action => {
                const button = document.createElement('button');
                button.textContent = action;
                button.style.cssText = `
                    background: rgba(0, 255, 238, 0.1);
                    border: 1px solid ${this.config.avatarColor};
                    color: ${this.config.avatarColor};
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
                    background: ${this.config.avatarColor};
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
                    messageElement.style.borderLeft = `3px solid ${this.config.avatarColor}`;
                }
            }
            
            messageElement.textContent = message.content;
            
            this.messagesContainer.appendChild(messageElement);
            this.scrollToBottom();
            
            // Limit message history
            const messages = this.messagesContainer.querySelectorAll('.message');
            if (messages.length > this.config.maxMessages) {
                messages[0].remove();
            }
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
         * Generate a session ID
         */
        generateSessionId() {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            return `enhanced_session_${timestamp}_${random}`;
        }
        
        /**
         * Show fallback message
         */
        showFallbackMessage(message) {
            const fallbackMessage = {
                type: 'bot',
                content: message,
                timestamp: new Date().toISOString(),
                isError: true
            };
            this.addMessage(fallbackMessage);
        }
        
        /**
         * Get widget status
         */
        getStatus() {
            return {
                initialized: this.isInitialized,
                visible: this.isVisible,
                connected: this.isConnected,
                usingEnhancedAPI: this.usingEnhancedAPI,
                sessionId: this.currentSession,
                workflowHistory: this.workflowHistory,
                userPreferences: this.userPreferences,
                conversationContext: this.conversationContext,
                performanceMetrics: this.performanceMetrics
            };
        }
        
        /**
         * Get performance metrics
         */
        getPerformanceMetrics() {
            return this.performanceMetrics;
        }
        
        /**
         * Clear conversation history
         */
        clearHistory() {
            this.messagesContainer.innerHTML = '';
            this.workflowHistory = [];
            this.conversationContext = {};
            localStorage.removeItem('enhanced_agentic_conversation_context');
        }
        
        /**
         * Update configuration
         */
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            console.log('Configuration updated:', this.config);
        }
        
        /**
         * Get position styles for avatar placement (from original system)
         */
        getPositionStyles() {
            // Calculate 70% down from top (original positioning)
            const viewportHeight = window.innerHeight;
            const seventyPercentDown = Math.floor(viewportHeight * 0.7);
            
            const positions = {
                'bottom-right': `position:fixed;top:${seventyPercentDown}px;right:${this.config.offsetX}px;z-index:999999;`,
                'bottom-left': `position:fixed;top:${seventyPercentDown}px;left:${this.config.offsetX}px;z-index:999999;`,
                'top-right': `position:fixed;top:${this.config.offsetY}px;right:${this.config.offsetX}px;z-index:999999;`,
                'top-left': `position:fixed;top:${this.config.offsetY}px;left:${this.config.offsetX}px;z-index:999999;`,
                'center-right': `position:fixed;top:50%;right:${this.config.offsetX}px;transform:translateY(-50%);z-index:999999;`,
                'center-left': `position:fixed;top:50%;left:${this.config.offsetX}px;transform:translateY(-50%);z-index:999999;`
            };
            
            return positions[this.config.position] || positions['bottom-right'];
        }
        
        /**
         * Generate avatar-based HTML (from original system)
         */
        generateAvatarHTML() {
            return `
                <div class="chatbot-avatar-container ${this.config.avatarType}-container">
                    
                    <!-- Enhanced Avatar Image with LangGraph indicator -->
                    <img src="${this.config.avatarImage}" 
                         class="chatbot-avatar ${this.config.avatarType}-avatar enhanced-avatar" 
                         alt="${this.config.avatarName}"
                         title="Click to chat with ${this.config.avatarName} (LangGraph Enhanced)"
                         loading="eager"
                         decoding="sync"
                         fetchpriority="high"
                         importance="high"
                         onload="console.log('🚀 [PERF] Enhanced Avatar image loaded successfully'); this.style.opacity='1';"
                         onerror="console.error('❌ [PERF] Enhanced Avatar image failed to load')">
                    
                    <!-- LangGraph Enhancement Indicator -->
                    <div class="langgraph-enhancement-indicator">
                        <span class="langgraph-badge">LangGraph</span>
                        <span class="workflow-indicator">🔄</span>
                    </div>
                    
                    <!-- Chat Interface -->
                    <div id="enhancedChatbotTypingBox" class="chatbot-typing-box enhanced-typing-box" style="display:none;">
                        <div class="enhanced-input-container">
                            <input type="text" 
                                   id="enhancedChatbotInput" 
                                   placeholder="${this.config.placeholderText}"
                                   class="chatbot-input enhanced-input">
                            <button id="enhancedChatbotSendBtn" 
                                    class="chatbot-send-btn enhanced-send-btn">Send</button>
                        </div>
                        ${this.config.showWorkflowSteps ? '<div class="workflow-steps"></div>' : ''}
                        ${this.config.showConfidenceScore ? '<div class="confidence-indicator"></div>' : ''}
                    </div>
                    
                    <!-- Chat Bubbles -->
                    <div id="enhancedChatbotBubbleContainer" class="chatbot-bubble-container enhanced-bubble-container">
                        <div id="enhancedChatbotWelcomeBubble" class="chatbot-bubble welcome-bubble enhanced-welcome-bubble" style="display: none;">
                            <div class="bubble-text">${this.config.welcomeMessage}</div>
                            ${this.config.showSuggestedActions ? '<div class="suggested-actions"></div>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Export for use in other files
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EnhancedChatbotWidget;
    } else {
        // Browser environment
        window.EnhancedChatbotWidget = EnhancedChatbotWidget;
        
        // Auto-initialize with default configuration
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.enhancedChatbotWidget) {
                window.enhancedChatbotWidget = new EnhancedChatbotWidget({
                    avatarType: 'assistant',
                    avatarName: 'Enhanced AI Assistant',
                    avatarColor: '#00ffee',
                    position: 'bottom-right',
                    enableLangGraph: true,
                    showWorkflowSteps: true,
                    showConfidenceScore: true,
                    showSuggestedActions: true
                });
            }
        });
    }
    
})();
