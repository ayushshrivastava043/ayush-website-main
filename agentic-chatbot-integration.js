/**
 * Agentic Chatbot Integration for Website
 * Enhanced chatbot widget with agentic capabilities
 */

class AgenticChatbotWidget {
    constructor(config = {}) {
        this.config = {
            ...AGENTIC_CHATBOT_CONFIG,
            ...config
        };
        
        this.client = new AgenticChatbotClient(this.config);
        this.isInitialized = false;
        this.isVisible = false;
        this.isTyping = false;
        this.messageQueue = [];
        
        // DOM elements
        this.widget = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.typingIndicator = null;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Initialize the chatbot widget
     */
    async init() {
        try {
            console.log('🤖 Initializing Agentic Chatbot Widget...');
            
            // Initialize the API client
            const connected = await this.client.initialize();
            if (!connected) {
                console.error('❌ Failed to connect to chatbot API');
                return;
            }
            
            // Create the widget HTML
            this.createWidget();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Show welcome message
            await this.showWelcomeMessage();
            
            this.isInitialized = true;
            console.log('✅ Agentic Chatbot Widget initialized successfully');
            
        } catch (error) {
            console.error('❌ Widget initialization error:', error);
        }
    }
    
    /**
     * Create the chatbot widget HTML
     */
    createWidget() {
        // Create main widget container
        this.widget = document.createElement('div');
        this.widget.id = 'agentic-chatbot-widget';
        this.widget.className = 'agentic-chatbot-widget';
        this.widget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: rgba(0, 0, 0, 0.95);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
            flex-direction: column;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: 'Poppins', sans-serif;
            color: #fff;
        `;
        
        // Create header
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
        title.textContent = '🤖 Agentic AI Assistant';
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
            max-height: 350px;
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
        this.toggleButton.className = 'agentic-chatbot-toggle';
        this.toggleButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #00ffee;
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
        this.widget.appendChild(this.messagesContainer);
        this.widget.appendChild(this.typingIndicator);
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
        
        // Close button (already set up in createWidget)
    }
    
    /**
     * Show welcome message
     */
    async showWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: "Hello! I'm your Agentic AI Assistant. I can help you with complex tasks, answer questions, and provide intelligent responses. How can I assist you today? 🚀",
            timestamp: new Date().toISOString()
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
            // Send to agentic chatbot
            const result = await this.client.sendMessage(message);
            
            if (result.success) {
                // Add bot response
                const botMessage = {
                    type: 'bot',
                    content: result.response,
                    timestamp: new Date().toISOString(),
                    metadata: result.metadata
                };
                this.addMessage(botMessage);
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
        }
        
        messageElement.textContent = message.content;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
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
            sessionId: this.client.getCurrentSession()
        };
    }
}

// Initialize when script is loaded
let agenticChatbotWidget = null;

// Auto-initialize if config is available
if (typeof AGENTIC_CHATBOT_CONFIG !== 'undefined') {
    agenticChatbotWidget = new AgenticChatbotWidget();
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgenticChatbotWidget;
} else {
    window.AgenticChatbotWidget = AgenticChatbotWidget;
}
