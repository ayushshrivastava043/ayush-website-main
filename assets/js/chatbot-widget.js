/**
 * 🚀 PORTABLE CHATBOT WIDGET
 * 
 * This is a completely portable chatbot widget that can be integrated
 * into any website with just a few lines of code.
 * 
 * Features:
 * - Any avatar type (robot, alien, ninja, assistant, etc.)
 * - Any position on screen
 * - Customizable colors and themes
 * - No external dependencies
 * - Works on any website
 * 
 * Usage:
 * <script src="chatbot-widget.js"></script>
 * <script>
 *   new ChatbotWidget({
 *     avatarType: 'robot',
 *     position: 'bottom-right'
 *   });
 * </script>
 */

(function() {
    'use strict';
    
    class ChatbotWidget {
        constructor(options = {}) {
            const startTime = performance.now();
            console.log('🚀 [PERF] ChatbotWidget constructor started at:', startTime);
            
            // Default configuration
            this.config = {
                // Avatar Configuration
                avatarType: options.avatarType || 'assistant',
                avatarName: options.avatarName || 'AI Assistant',
                avatarImage: options.avatarImage || 'https://cdn.example.com/default-avatar.gif',
                avatarColor: options.avatarColor || '#00ffee',
                
                // Position Configuration
                position: options.position || 'bottom-right',
                offsetX: options.offsetX || 20,
                offsetY: options.offsetY || 20,
                
                // Theme Configuration
                theme: options.theme || 'dark',
                customCSS: options.customCSS || null,
                
                // Functionality
                apiEndpoint: options.apiEndpoint || null,
                welcomeMessage: options.welcomeMessage || 'Hello! How can I help you today? 🚀',
                placeholderText: options.placeholderText || 'Type your message...',
                
                // Callbacks
                onMessage: options.onMessage || null,
                onOpen: options.onOpen || null,
                onClose: options.onClose || null,
                
                // Advanced Options
                autoOpen: options.autoOpen || false,
                typingSpeed: options.typingSpeed || 50,
                bubbleTimeout: options.bubbleTimeout || 5000
            };
            
            const configTime = performance.now();
            console.log('🚀 [PERF] Config setup completed in:', configTime - startTime, 'ms');
            
            // Initialize the widget
            this.init();
        }
        
        init() {
            const initStartTime = performance.now();
            console.log('🚀 [PERF] Init started at:', initStartTime);
            
            this.createWidget();
            const createTime = performance.now();
            console.log('🚀 [PERF] createWidget completed in:', createTime - initStartTime, 'ms');
            
            this.injectStyles();
            const stylesTime = performance.now();
            console.log('🚀 [PERF] injectStyles completed in:', stylesTime - createTime, 'ms');
            
            this.bindEvents();
            const eventsTime = performance.now();
            console.log('🚀 [PERF] bindEvents completed in:', eventsTime - stylesTime, 'ms');
            
            this.showWelcomeMessage();
            const welcomeTime = performance.now();
            console.log('🚀 [PERF] showWelcomeMessage completed in:', welcomeTime - eventsTime, 'ms');
            
            // Thinking bubble system disabled for better performance
            console.log('🚀 [PERF] Total init time:', welcomeTime - initStartTime, 'ms');
            console.log('🚀 Chatbot initialized without thinking bubbles');
            
            // Auto-open if configured
            if (this.config.autoOpen) {
                setTimeout(() => this.toggleChat(), 2000);
            }
        }
        
        createWidget() {
            const createStartTime = performance.now();
            console.log('🚀 [PERF] createWidget started at:', createStartTime);
            
            // Create main container
            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'portable-chatbot-widget';
            
            const htmlGenStart = performance.now();
            widgetContainer.innerHTML = this.generateWidgetHTML();
            const htmlGenTime = performance.now();
            console.log('🚀 [PERF] HTML generation took:', htmlGenTime - htmlGenStart, 'ms');
            
            // Add to body
            const appendStart = performance.now();
            document.body.appendChild(widgetContainer);
            const appendTime = performance.now();
            console.log('🚀 [PERF] DOM append took:', appendTime - appendStart, 'ms');
            
            // Store references
            const refsStart = performance.now();
            this.elements = {
                container: document.getElementById('portable-chatbot-widget'),
                avatar: document.querySelector('.chatbot-avatar'),
                typingBox: document.getElementById('chatbotTypingBox'),
                input: document.getElementById('chatbotInput'),
                sendBtn: document.getElementById('chatbotSendBtn'),
                bubbleContainer: document.getElementById('chatbotBubbleContainer'),
                welcomeBubble: document.getElementById('chatbotWelcomeBubble'),

            };
            const refsTime = performance.now();
            console.log('🚀 [PERF] Element references took:', refsTime - refsStart, 'ms');
            
            // Debug element references
            console.log('🔍 Debug: Element references:');
            console.log('🔍 Container:', this.elements.container);
            console.log('🔍 Avatar:', this.elements.avatar);
            console.log('🔍 Typing Box:', this.elements.typingBox);
            console.log('🔍 Input:', this.elements.input);
            console.log('🔍 Send Button:', this.elements.sendBtn);
            console.log('🔍 Bubble Container:', this.elements.bubbleContainer);
            
            const totalCreateTime = performance.now();
            console.log('🚀 [PERF] Total createWidget time:', totalCreateTime - createStartTime, 'ms');
        }
        
        generateWidgetHTML() {
            const position = this.getPositionStyles();
            
            return `
                <div class="chatbot-avatar-container ${this.config.avatarType}-container" 
                     style="${position}">
                    
                    <!-- Avatar Image -->
                    <img src="${this.config.avatarImage}" 
                         class="chatbot-avatar ${this.config.avatarType}-avatar" 
                         alt="${this.config.avatarName}"
                         title="Click to chat with ${this.config.avatarName}"
                         loading="eager"
                         decoding="sync"
                         fetchpriority="high"
                         importance="high"
                         onload="console.log('🚀 [PERF] Avatar image loaded successfully'); this.style.opacity='1';"
                         onerror="console.error('❌ [PERF] Avatar image failed to load')"
                         onprogress="console.log('🚀 [PERF] Avatar loading progress...')">
                    
                    <!-- Chat Interface -->
                    <div id="chatbotTypingBox" class="chatbot-typing-box" style="display:none;">
                        <input type="text" 
                               id="chatbotInput" 
                               placeholder="${this.config.placeholderText}"
                               class="chatbot-input">
                        <button id="chatbotSendBtn" 
                                class="chatbot-send-btn">Send</button>
                    </div>
                    
                    <!-- Chat Bubbles -->
                    <div id="chatbotBubbleContainer" class="chatbot-bubble-container">
                        <div id="chatbotWelcomeBubble" class="chatbot-bubble welcome-bubble" style="display: none;">
                            <div class="bubble-text">${this.config.welcomeMessage}</div>
                        </div>

                    </div>
                </div>
            `;
        }
        
        getPositionStyles() {
            // Calculate 70% down from top (60% + 10%)
            const viewportHeight = window.innerHeight;
            const seventyPercentDown = Math.floor(viewportHeight * 0.7);
            
            const positions = {
                'bottom-right': `position:fixed;top:${seventyPercentDown}px;right:${this.config.offsetX}px;`,
                'bottom-left': `position:fixed;top:${seventyPercentDown}px;left:${this.config.offsetX}px;`,
                'top-right': `position:fixed;top:${this.config.offsetY}px;right:${this.config.offsetX}px;`,
                'top-left': `position:fixed;top:${this.config.offsetY}px;left:${this.config.offsetX}px;`,
                'center-right': `position:fixed;top:50%;right:${this.config.offsetX}px;transform:translateY(-50%);`,
                'center-left': `position:fixed;top:50%;left:${this.config.offsetX}px;transform:translateY(-50%);`
            };
            
            return positions[this.config.position] || positions['bottom-right'];
        }
        
        injectStyles() {
            const stylesStart = performance.now();
            console.log('🚀 [PERF] injectStyles started at:', stylesStart);
            
            const styleElement = document.createElement('style');
            const cssGenStart = performance.now();
            styleElement.textContent = this.generateCSS();
            const cssGenTime = performance.now();
            console.log('🚀 [PERF] CSS generation took:', cssGenTime - cssGenStart, 'ms');
            
            const appendStart = performance.now();
            document.head.appendChild(styleElement);
            const appendTime = performance.now();
            console.log('🚀 [PERF] CSS append took:', appendTime - appendStart, 'ms');
            
            const totalStylesTime = performance.now();
            console.log('🚀 [PERF] Total injectStyles time:', totalStylesTime - stylesStart, 'ms');
        }
        
        generateCSS() {
            return `
                .chatbot-avatar-container {
                    z-index: 999999;
                    pointer-events: auto;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    width: auto !important;
                    height: auto !important;
                    min-width: 0 !important;
                    min-height: 0 !important;
                    max-width: none !important;
                    max-height: none !important;
                    border-radius: 0 !important;
                    border-width: 0 !important;
                    border-style: none !important;
                    border-color: transparent !important;
                }
                
                .chatbot-avatar {
                    width: auto;
                    height: 200px;
                    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4));
                    transition: all 0.3s ease;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #333, #666) !important;
                    background-color: #333 !important;
                    background-image: none !important;
                    cursor: pointer !important;
                    pointer-events: auto !important;
                    user-select: none;
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                    opacity: 0.6;
                    position: relative;
                }
                
                .chatbot-avatar::before {
                    content: '🤖';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 48px;
                    opacity: 0.8;
                    z-index: 1;
                    animation: pulse 2s ease-in-out infinite;
                }
                
                .chatbot-avatar[src] {
                    opacity: 1;
                    background: transparent !important;
                    background-color: transparent !important;
                }
                
                .chatbot-avatar[src]::before {
                    display: none;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                }
                
                .chatbot-avatar:hover {
                    transform: scale(1.05);
                    filter: drop-shadow(0 12px 24px rgba(0,0,0,0.6));
                }
                
                .chatbot-typing-box {
                    position: absolute;
                    left: -50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #000000, #1a1a1a);
                    border-radius: 20px;
                    padding: 15px 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                    width: 300px;
                    backdrop-filter: blur(10px);
                    border: 2px solid #333;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.3s ease;
                    display: none;
                    gap: 8px;
                    align-items: center;
                    z-index: 999999;
                }
                
                .chatbot-typing-box.active {
                    opacity: 1;
                    transform: scale(1);
                }
                
                .chatbot-input {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 8px;
                    background: #333;
                    color: white;
                    font-size: 12px;
                    outline: none;
                    transition: all 0.3s ease;
                    pointer-events: auto !important;
                    user-select: text !important;
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    cursor: text !important;
                    z-index: 999999 !important;
                }
                
                .chatbot-input:focus {
                    background: #444;
                    box-shadow: 0 0 0 2px ${this.config.avatarColor}40;
                }
                
                .chatbot-send-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 8px;
                    background: ${this.config.avatarColor};
                    color: #000;
                    font-size: 12px;
                    cursor: pointer !important;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    min-width: 60px;
                    pointer-events: auto !important;
                    z-index: 999999 !important;
                    position: relative !important;
                }
                
                .chatbot-send-btn:hover {
                    background: ${this.adjustColor(this.config.avatarColor, 20)};
                    transform: scale(1.05);
                }
                
                .chatbot-bubble {
                    position: absolute;
                    bottom: 200px;
                    max-width: 300px;
                    padding: 15px 20px;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #000000, #1a1a1a);
                    border: 2px solid #333;
                    color: white;
                    font-size: 14px;
                    line-height: 1.4;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                    opacity: 1;
                    transform: scale(1);
                    transition: all 0.3s ease;
                    word-wrap: break-word;
                    z-index: 999997;
                }
                
                .chatbot-bubble.hidden {
                    opacity: 0;
                    transform: scale(0.8);
                }
                
                .chatbot-bubble.welcome-bubble {
                    right: 0px;
                    border-color: ${this.config.avatarColor};
                    background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.8));
                    z-index: 999996;
                    bottom: 200px;
                    display: none;
                }
                

                
                .chatbot-bubble.response-bubble {
                    right: 0px;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.7));
                }
                
                .bubble-text {
                    margin: 0;
                }
                
                /* Avatar-specific themes */
                .assistant-container .chatbot-avatar { 
                    filter: drop-shadow(0 8px 16px rgba(0,255,238,0.4)); 
                }
                
                .robot-container .chatbot-avatar { 
                    filter: drop-shadow(0 8px 16px rgba(255,107,107,0.4)); 
                }
                
                .alien-container .chatbot-avatar { 
                    filter: drop-shadow(0 8px 16px rgba(138,43,226,0.4)); 
                }
                
                .ninja-container .chatbot-avatar { 
                    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.6)); 
                }
                
                .shopping-container .chatbot-avatar { 
                    filter: drop-shadow(0 8px 16px rgba(34,197,94,0.4)); 
                }
                
                .writer-container .chatbot-avatar { 
                    filter: drop-shadow(0 8px 16px rgba(59,130,246,0.4)); 
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    .chatbot-avatar {
                        height: 150px;
                    }
                    
                    .chatbot-typing-box {
                        width: 250px;
                        bottom: -58px;
                    }
                    
                    .chatbot-bubble {
                        bottom: 150px;
                        max-width: 250px;
                    }
                }
                
                @media (max-width: 480px) {
                    .chatbot-avatar {
                        height: 120px;
                    }
                    
                    .chatbot-typing-box {
                        width: 200px;
                        bottom: -48px;
                        padding: 12px 15px;
                    }
                    
                    .chatbot-bubble {
                        bottom: 120px;
                        max-width: 200px;
                        font-size: 12px;
                        padding: 12px 15px;
                    }
                }
                
                /* Animation keyframes */
                @keyframes bubble-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-3px); }
                }
                
                @keyframes typing-indicator {
                    0%, 20% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .chatbot-bubble {
                    animation: bubble-float 3s ease-in-out infinite;
                }
                
                .typing-indicator {
                    animation: typing-indicator 1.5s ease-in-out infinite;
                }
            `;
        }
        
        bindEvents() {
            const eventsStart = performance.now();
            console.log('🚀 [PERF] bindEvents started at:', eventsStart);
            
            // Make it globally accessible
            window.portableChatbotInstance = this;
            
            console.log('🔍 Binding events...');
            console.log('🔍 Avatar element:', this.elements.avatar);
            
            // Add click event to avatar
            if (this.elements.avatar) {
                this.elements.avatar.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🚀 Avatar clicked!');
                    this.toggleChat();
                });
                console.log('✅ Avatar click event bound');
            } else {
                console.error('❌ Avatar element not found!');
            }
            
            // Add click event to send button
            console.log('🔍 Debug: Looking for send button element...');
            console.log('🔍 this.elements.sendBtn:', this.elements.sendBtn);
            console.log('🔍 document.getElementById("chatbotSendBtn"):', document.getElementById('chatbotSendBtn'));
            
            if (this.elements.sendBtn) {
                this.elements.sendBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🚀 Send button clicked!');
                    this.sendMessage();
                });
                console.log('✅ Send button click event bound');
            } else {
                console.error('❌ Send button element not found!');
                // Try to find it manually
                const manualSendBtn = document.getElementById('chatbotSendBtn');
                if (manualSendBtn) {
                    console.log('🔍 Found send button manually, binding event...');
                    manualSendBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log('🚀 Send button clicked (manual binding)!');
                        this.sendMessage();
                    });
                    console.log('✅ Send button click event bound manually');
                } else {
                    console.error('❌ Send button not found even manually!');
                }
            }
            
            // Add keyboard support
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.isChatOpen()) {
                    e.preventDefault();
                    console.log('🚀 Enter key pressed, sending message...');
                    this.sendMessage();
                }
            });
            
            // Add input field event listener
            if (this.elements.input) {
                console.log('✅ Input field found, adding event listeners...');
                
                // Add click event to test if input is clickable
                this.elements.input.addEventListener('click', (e) => {
                    console.log('🚀 Input field clicked!');
                    e.stopPropagation();
                });
                
                // Add focus event
                this.elements.input.addEventListener('focus', (e) => {
                    console.log('🚀 Input field focused!');
                });
                
                // Add input event to track typing
                this.elements.input.addEventListener('input', (e) => {
                    console.log('🚀 Input field value changed:', e.target.value);
                });
                
                this.elements.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🚀 Enter key pressed in input field...');
                        console.log('🔍 About to call sendMessage()...');
                        console.log('🔍 this.sendMessage type:', typeof this.sendMessage);
                        console.log('🔍 this object:', this);
                        
                        // Try calling the function directly
                        try {
                            console.log('🔍 Attempting to call sendMessage...');
                            
                            // Test if we can call a simple method
                            console.log('🔍 Testing simple method call...');
                            if (this.testMethod) {
                                this.testMethod();
                            } else {
                                console.log('🔍 Creating test method...');
                                this.testMethod = () => console.log('✅ Test method works!');
                                this.testMethod();
                            }
                            
                            // Now try sendMessage
                            this.sendMessage();
                            console.log('🔍 sendMessage() called successfully');
                        } catch (error) {
                            console.error('❌ Error calling sendMessage:', error);
                        }
                    }
                });
                
                // Also add keyup event as backup
                this.elements.input.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        console.log('🚀 Enter key released in input field...');
                    }
                });
                
                console.log('✅ Input field event listeners added');
            } else {
                console.error('❌ Input field not found!');
            }
            
            // Add touch support for mobile
            if ('ontouchstart' in window && this.elements.avatar) {
                this.elements.avatar.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.toggleChat();
                });
            }
            
            // Add resize listener to recalculate position
            window.addEventListener('resize', () => {
                if (this.elements.container) {
                    const viewportHeight = window.innerHeight;
                    const seventyPercentDown = Math.floor(viewportHeight * 0.7);
                    this.elements.container.style.top = `${seventyPercentDown}px`;
                    this.elements.container.style.bottom = 'auto';
                    console.log('🔄 Repositioned chatbot to 70% down from top');
                }
            });
            
            const totalEventsTime = performance.now();
            console.log('🚀 [PERF] Total bindEvents time:', totalEventsTime - eventsStart, 'ms');
            console.log('✅ All events bound successfully');
        }
        
        toggleChat() {
            // Prevent double-toggle
            if (this.isToggling) {
                console.log('🚫 Toggle already in progress, ignoring...');
                return;
            }
            
            this.isToggling = true;
            
            const typingBox = this.elements.typingBox;
            const welcomeBubble = this.elements.welcomeBubble;

            
            console.log('🚀 toggleChat called!');
            console.log('🔍 typingBox display:', typingBox.style.display);
            console.log('🔍 typingBox element:', typingBox);
            
            if (typingBox.style.display === 'none' || typingBox.style.display === '') {
                // Open chat
                console.log('🚀 Opening chat...');
                
                // Hide all bubbles
                welcomeBubble.style.visibility = 'hidden';
                welcomeBubble.style.opacity = '0';
                welcomeBubble.style.display = 'none';
                welcomeBubble.classList.add('hidden');
                

                
                // Show typing box with higher z-index
                typingBox.style.display = 'flex';
                typingBox.style.zIndex = '999999';
                setTimeout(() => typingBox.classList.add('active'), 50);
                
                // Focus input and ensure it's clickable
                console.log('🔍 Input element:', this.elements.input);
                console.log('🔍 Input disabled:', this.elements.input.disabled);
                console.log('🔍 Input readonly:', this.elements.input.readOnly);
                
                this.elements.input.focus();
                this.elements.input.style.pointerEvents = 'auto';
                this.elements.input.style.userSelect = 'text';
                this.elements.input.style.webkitUserSelect = 'text';
                
                if (this.config.onOpen) this.config.onOpen();
            } else {
                // Close chat
                console.log('🚀 Closing chat...');
                typingBox.classList.remove('active');
                setTimeout(() => {
                    typingBox.style.display = 'none';
                    // Keep all bubbles hidden when closing
                    welcomeBubble.style.display = 'none';
                    welcomeBubble.classList.add('hidden');

                }, 300);
                
                if (this.config.onClose) this.config.onClose();
            }
            
            // Reset toggle flag after a short delay
            setTimeout(() => {
                this.isToggling = false;
            }, 500);
        }
        
        sendMessage = () => {
            console.log('🚀 sendMessage function entered');
            console.log('🎯 FIRST LINE OF sendMessage EXECUTED!');
            const input = this.elements.input;
            console.log('🔍 Input element in sendMessage:', input);
            const message = input.value.trim();
            console.log('🚀 sendMessage called with:', message);
            
            if (message) {
                console.log('✅ Message is not empty, proceeding...');
                // Clear input
                input.value = '';
                console.log('✅ Input cleared');
                
                // Create response bubble
                console.log('🔍 About to call createResponseBubble with:', message);
                this.createResponseBubble(message);
                console.log('✅ createResponseBubble called');
                
                // Call custom message handler
                if (this.config.onMessage) {
                    console.log('🔍 Calling custom message handler...');
                    this.config.onMessage(message, this);
                    console.log('✅ Custom message handler called');
                }
            } else {
                console.log('⚠️ Empty message, not sending');
            }
        }
        
        createResponseBubble(message) {
            console.log('🚀 createResponseBubble called with:', message);
            const container = this.elements.bubbleContainer;
            console.log('🔍 Bubble container:', container);
            
            const bubble = document.createElement('div');
            bubble.className = 'chatbot-bubble response-bubble';
            bubble.style.zIndex = '999997';
            bubble.style.bottom = '200px';
            
            // Add typing indicator first
            bubble.innerHTML = '<div class="bubble-text typing-indicator">Typing...</div>';
            container.appendChild(bubble);
            console.log('✅ Bubble added to container');
            
            // Animate in
            setTimeout(() => bubble.classList.add('active'), 50);
            
            // Get real AI response with typing effect
            setTimeout(async () => {
                console.log('🔍 About to call generateResponse...');
                try {
                    const response = await this.generateResponse(message);
                    console.log('✅ generateResponse returned:', response);
                    this.typeResponse(bubble, response);
                } catch (error) {
                    console.error('❌ Error getting AI response:', error);
                    this.typeResponse(bubble, 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment. 🤖');
                }
            }, 1000);
            
            // Remove after timeout
            setTimeout(() => {
                bubble.classList.add('hidden');
                setTimeout(() => bubble.remove(), 300);
            }, this.config.bubbleTimeout);
        }
        
        typeResponse(bubble, response) {
            const textElement = bubble.querySelector('.bubble-text');
            textElement.innerHTML = '';
            textElement.classList.remove('typing-indicator');
            
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < response.length) {
                    textElement.innerHTML += response.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, this.config.typingSpeed);
                }
            };
            
            typeChar();
        }
        
        async generateResponse(message) {
            // Simple AI integration - connect to our backend server
            try {
                console.log('🤖 generateResponse called with:', message);
                console.log('🔍 About to fetch from http://localhost:5001/api/chat');
                
                const response = await fetch('http://localhost:5001/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message })
                });
                
                console.log('🔍 Fetch response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('🤖 Received response:', data);
                return data.response;
                
            } catch (error) {
                console.error('❌ AI response error:', error);
                return 'I apologize, but I\'m having trouble connecting to my brain right now. Please make sure the chatbot server is running on port 5001! 🤖';
            }
        }
        
        generateSmartResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // Smart keyword-based responses (temporary until AI integration)
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                return 'Hello! I\'m Ayush\'s AI Assistant. How can I help you today? 🚀';
            }
            
            if (lowerMessage.includes('portfolio') || lowerMessage.includes('project')) {
                return 'I can help you explore Ayush\'s portfolio! He has amazing projects in AI, project management, and business development. What specific area interests you? 💼';
            }
            
            if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
                return 'Ayush is passionate about AI! He works on AI sales tools, video generation, and API development. Would you like to know more about any specific AI project? 🤖';
            }
            
            if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
                return 'You can reach Ayush through his portfolio contact section or LinkedIn. He\'s always open to discussing exciting opportunities! 📧';
            }
            
            if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
                return 'Ayush has diverse experience in project management, business development, and AI implementation. He\'s worked with telecom, edtech, and various industries. What would you like to know? 💪';
            }
            
            // Default intelligent response
            return `That's an interesting question about "${message}"! As Ayush's AI assistant, I can help you learn more about his work, projects, or expertise. What would you like to explore? 🎯`;
        }
        
        // OpenAI Integration (uncomment and add your API key)
        async callOpenAI(message) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.openaiApiKey || 'YOUR_API_KEY_HERE'}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Ayush\'s AI Assistant. Help visitors learn about Ayush\'s portfolio, projects, and expertise. Be friendly, professional, and helpful.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 150
                })
            });
            
            const data = await response.json();
            return data.choices[0].message.content;
        }
        
        // Claude Integration (uncomment and add your API key)
        async callClaude(message) {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.claudeApiKey || 'YOUR_API_KEY_HERE'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 150,
                    messages: [
                        {
                            role: 'user',
                            content: `You are Ayush's AI Assistant. Help visitors learn about Ayush's portfolio, projects, and expertise. Be friendly, professional, and helpful. User message: ${message}`
                        }
                    ]
                })
            });
            
            const data = await response.json();
            return data.content[0].text;
        }
        
        isChatOpen() {
            return this.elements.typingBox.style.display !== 'none';
        }
        
        adjustColor(color, amount) {
            // Simple color adjustment for hover effects
            return color;
        }
        
        showWelcomeMessage() {
            // Welcome message is hidden by default
            // Only show when explicitly needed
        }
        

        
        // Public API methods
        open() { 
            if (!this.isChatOpen()) this.toggleChat(); 
        }
        
        close() { 
            if (this.isChatOpen()) this.toggleChat(); 
        }
        
        sendMessage(text) { 
            if (text) {
                this.elements.input.value = text;
                this.sendMessage();
            }
        }
        
        updateConfig(newConfig) {
            Object.assign(this.config, newConfig);
            // Re-render if needed
            this.updateWidget();
        }
        
        updateWidget() {
            // Update widget appearance based on new config
            if (this.elements.avatar) {
                this.elements.avatar.src = this.config.avatarImage;
                this.elements.avatar.alt = this.config.avatarName;
                this.elements.avatar.title = `Click to chat with ${this.config.avatarName}`;
            }
        }
        
        destroy() {
            // Remove widget from DOM
            if (this.elements.container && this.elements.container.parentNode) {
                this.elements.container.parentNode.removeChild(this.elements.container);
            }
            // Remove global reference
            delete window.portableChatbotInstance;
        }
        
        // Test function to manually test Enter key
        testEnterKey() {
            console.log('🧪 Testing Enter key functionality...');
            if (this.elements.input) {
                console.log('✅ Input field found, testing Enter key...');
                this.elements.input.value = 'Test message from Enter key';
                console.log('📝 Set test message:', this.elements.input.value);
                
                // Simulate Enter key press
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                
                this.elements.input.dispatchEvent(enterEvent);
                console.log('🚀 Enter key event dispatched!');
            } else {
                console.error('❌ Input field not found for testing!');
            }
        }
        
        // Test function to manually test send message
        testSendMessage() {
            console.log('🧪 Testing send message functionality...');
            if (this.elements.input) {
                this.elements.input.value = 'Test message from manual send';
                this.sendMessage();
            } else {
                console.error('❌ Input field not found for testing!');
            }
        }
        

    }
    
    // Make it globally accessible
    if (typeof window !== 'undefined') {
        window.ChatbotWidget = ChatbotWidget;
        window.PortableChatbotWidget = ChatbotWidget; // Alternative name
        console.log('🚀 ChatbotWidget class registered globally:', typeof ChatbotWidget);
    }
    
    // Auto-initialize if no options provided (optional) - DISABLED FOR MANUAL INITIALIZATION
    // if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    //     // Wait for DOM to be ready
    //     if (document.readyState === 'loading') {
    //         document.addEventListener('DOMContentLoaded', () => {
    //             // Auto-initialize with default settings if no manual initialization
    //             if (!window.portableChatbotInstance) {
    //                 console.log('🚀 Auto-initializing portable chatbot widget...');
    //                 new ChatbotWidget();
    //             }
    //         });
    //     } else {
    //         // DOM already ready
    //         if (!window.portableChatbotInstance) {
    //             console.log('🚀 Auto-initializing portable chatbot widget...');
    //             new ChatbotWidget();
    //         }
    //     }
    // }
    
})();
