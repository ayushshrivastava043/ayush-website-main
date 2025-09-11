/**
 * 🚀 ENHANCED AGENTIC CHATBOT WIDGET - PROPER 3D AVATAR SYSTEM
 * 
 * This implements the EXACT original 3D avatar system with LangGraph enhancements:
 * - 3D avatar without background (floating)
 * - Click avatar → opens typing box below avatar
 * - Chat bubbles appear in response
 * - Backend agentic bot handles AI processing
 * - LangGraph workflow visualization
 */

(function() {
    'use strict';
    
    class EnhancedAgenticChatbotWidget {
        constructor(options = {}) {
            // Optimized initialization - reduced logging for better performance
            
            // Default configuration - EXACT ORIGINAL SYSTEM
            this.config = {
                // Avatar Configuration (Original System)
                avatarType: options.avatarType || 'assistant',
                avatarName: options.avatarName || 'Enhanced AI Assistant',
                avatarImage: options.avatarImage || 'assets/chatbot-avatar-optimized.webp',
                avatarColor: options.avatarColor || '#00ffee',
                
                // Position Configuration (Original System - 70% down from top)
                position: options.position || 'bottom-right',
                offsetX: options.offsetX || 120,
                offsetY: options.offsetY || 20,
                
                // Theme Configuration (Original System)
                theme: options.theme || 'dark',
                customCSS: options.customCSS || null,
                
                // LangGraph Enhancements
                enableLangGraph: options.enableLangGraph !== false,
                showWorkflowSteps: options.showWorkflowSteps !== false,
                showConfidenceScore: options.showConfidenceScore !== false,
                showSuggestedActions: options.showSuggestedActions !== false,
                enableStatePersistence: options.enableStatePersistence !== false,
                enableMultiAgent: options.enableMultiAgent !== false,
                enableFeedbackLoops: options.enableFeedbackLoops !== false,
                
                // API Configuration
                enhancedEndpoint: options.enhancedEndpoint || 'http://localhost:5001/chat',
                fallbackEndpoint: options.fallbackEndpoint || 'http://localhost:5003/chat/send',
                
                // Functionality (Original System)
                welcomeMessage: options.welcomeMessage || 'Hello! I\'m your Enhanced Agentic AI Assistant powered by LangGraph. How can I help you today? 🚀',
                placeholderText: options.placeholderText || 'Type your message...',
                
                // Callbacks
                onMessage: options.onMessage || null,
                onOpen: options.onOpen || null,
                onClose: options.onClose || null,
                onWorkflowStep: options.onWorkflowStep || null,
                onError: options.onError || null,
                
                // Advanced Options (Original System)
                autoOpen: options.autoOpen || false,
                typingSpeed: options.typingSpeed || 50,
                bubbleTimeout: options.bubbleTimeout || 4000
            };
            
            // Config setup completed - optimized
            
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
            
            console.log('🚀 [PERF] Total init time:', welcomeTime - initStartTime, 'ms');
            console.log('🚀 Enhanced Agentic Chatbot initialized with proper 3D avatar system!');
            
            // Auto-open if configured
            if (this.config.autoOpen) {
                setTimeout(() => this.toggleChat(), 2000);
            }
        }
        
        createWidget() {
            const createStartTime = performance.now();
            console.log('🚀 [PERF] createWidget started at:', createStartTime);
            
            // Create main container - EXACT ORIGINAL SYSTEM
            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'enhanced-agentic-chatbot-widget';
            
            const htmlGenStart = performance.now();
            widgetContainer.innerHTML = this.generateWidgetHTML();
            const htmlGenTime = performance.now();
            console.log('🚀 [PERF] HTML generation took:', htmlGenTime - htmlGenStart, 'ms');
            
            // Add to body
            const appendStart = performance.now();
            document.body.appendChild(widgetContainer);
            const appendTime = performance.now();
            console.log('🚀 [PERF] DOM append took:', appendTime - appendStart, 'ms');
            
            // Store references - EXACT ORIGINAL SYSTEM
            this.elements = {
                container: document.getElementById('enhanced-agentic-chatbot-widget'),
                avatar: document.querySelector('.chatbot-avatar'),
                typingBox: document.getElementById('chatbotTypingBox'),
                input: document.getElementById('chatbotInput'),
                sendBtn: document.getElementById('chatbotSendBtn'),
                bubbleContainer: document.getElementById('chatbotBubbleContainer'),
                welcomeBubble: document.getElementById('chatbotWelcomeBubble'),
                langgraphIndicator: document.querySelector('.langgraph-enhancement-indicator'),
                workflowSteps: document.querySelector('.workflow-steps'),
                confidenceIndicator: document.querySelector('.confidence-indicator'),
                suggestedActions: document.querySelector('.suggested-actions')
            };
            
            const refsTime = performance.now();
            console.log('🚀 [PERF] Element references took:', refsTime - refsTime, 'ms');
            
            const totalCreateTime = performance.now();
            console.log('🚀 [PERF] Total createWidget time:', totalCreateTime - createStartTime, 'ms');
        }
        
        generateWidgetHTML() {
            const position = this.getPositionStyles();
            
            return `
                <div class="chatbot-avatar-container ${this.config.avatarType}-container enhanced-agentic-container" 
                     style="${position}">
                    
                    <!-- 3D Avatar Image - EXACT ORIGINAL SYSTEM -->
                    <img src="${this.config.avatarImage}" 
                         class="chatbot-avatar ${this.config.avatarType}-avatar enhanced-avatar" 
                         alt="${this.config.avatarName}"
                         title="Click to chat with ${this.config.avatarName} (LangGraph Enhanced)"
                         loading="eager"
                         decoding="sync"
                         fetchpriority="high"
                         importance="high"
                         onload="console.log('🚀 [PERF] Enhanced 3D Avatar image loaded successfully'); this.style.opacity='1';"
                         onerror="console.error('❌ [PERF] Enhanced 3D Avatar image failed to load')">
                    
                    <!-- LangGraph Enhancement Indicator - REMOVED to avoid covering avatar -->
                    
                    <!-- Chat Interface - EXACT ORIGINAL SYSTEM -->
                    <div id="chatbotTypingBox" class="chatbot-typing-box enhanced-typing-box" style="display:none;">
                        <input type="text" 
                               id="chatbotInput" 
                               placeholder="${this.config.placeholderText}"
                               class="chatbot-input enhanced-input">
                        <button id="chatbotSendBtn" 
                                class="chatbot-send-btn enhanced-send-btn">Send</button>
                        ${this.config.showWorkflowSteps ? '<div class="workflow-steps"></div>' : ''}
                        ${this.config.showConfidenceScore ? '<div class="confidence-indicator"></div>' : ''}
                    </div>
                    
                    <!-- Chat Bubbles - EXACT ORIGINAL SYSTEM -->
                    <div id="chatbotBubbleContainer" class="chatbot-bubble-container enhanced-bubble-container">
                        <div id="chatbotWelcomeBubble" class="chatbot-bubble welcome-bubble enhanced-welcome-bubble" style="display: none;">
                            <div class="bubble-text">${this.config.welcomeMessage}</div>
                            ${this.config.showSuggestedActions ? '<div class="suggested-actions"></div>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }
        
        getPositionStyles() {
            // Calculate 60% down from top (10% BELOW current 50% position)
            const viewportHeight = window.innerHeight;
            const sixtyPercentDown = Math.floor(viewportHeight * 0.6);
            
            const positions = {
                'bottom-right': `position:fixed;top:${sixtyPercentDown}px;right:${this.config.offsetX}px;`,
                'bottom-left': `position:fixed;top:${sixtyPercentDown}px;left:${this.config.offsetX}px;`,
                'top-right': `position:fixed;top:${this.config.offsetY}px;right:${this.config.offsetX}px;`,
                'top-left': `position:fixed;top:${this.config.offsetY}px;left:${this.config.offsetX}px;`,
                'center-right': `position:fixed;top:50%;right:${this.config.offsetX}px;transform:translateY(-50%);`,
                'center-left': `position:fixed;top:50%;left:${this.config.offsetX}px;transform:translateY(-50%);`
            };
            
            // Force LEFT side positioning (opposite side)
            return `position:fixed;top:${sixtyPercentDown}px;left:${this.config.offsetX}px;`;
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
                /* EXACT ORIGINAL 3D AVATAR SYSTEM STYLES */
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
                
                /* 3D AVATAR - EXACT ORIGINAL SYSTEM */
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
                
                /* LANGGRAPH ENHANCEMENT INDICATOR - REMOVED to avoid covering avatar */
                
                /* TYPING BOX - STATE-OF-THE-ART FIXED POSITIONING */
                .chatbot-typing-box {
                    position: fixed !important;
                    left: 20px !important;
                    bottom: calc(40vh - 264px) !important;
                    transform: none !important;
                    background: linear-gradient(135deg, #000000, #1a1a1a);
                    border-radius: 20px;
                    padding: 15px 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                    width: 300px;
                    backdrop-filter: blur(10px);
                    border: 2px solid #333;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: none;
                    gap: 8px;
                    align-items: center;
                    z-index: 999999;
                }
                
                .chatbot-typing-box.active {
                    opacity: 1;
                    transform: none !important;
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
                
                /* WORKFLOW STEPS INDICATOR */
                .workflow-steps {
                    margin-top: 8px;
                    padding: 8px;
                    background: rgba(0, 255, 238, 0.1);
                    border-radius: 8px;
                    font-size: 0.7rem;
                    color: ${this.config.avatarColor};
                    display: none;
                }
                
                .workflow-steps.active {
                    display: block;
                }
                
                /* CONFIDENCE INDICATOR */
                .confidence-indicator {
                    margin-top: 8px;
                    padding: 4px 8px;
                    background: rgba(0, 255, 238, 0.1);
                    border-radius: 12px;
                    font-size: 0.6rem;
                    color: ${this.config.avatarColor};
                    display: none;
                    text-align: center;
                }
                
                .confidence-indicator.active {
                    display: block;
                }
                
                /* CHAT BUBBLES - ENHANCED WITH DIFFERENT SIZES AND SHAPES */
                .chatbot-bubble {
                    position: fixed;
                    top: calc(60vh - 80px);
                    left: 10px;
                    max-width: 350px;
                    min-height: 40px;
                    height: auto;
                    padding: 18px 24px;
                    background: linear-gradient(135deg, #000000, #1a1a1a);
                    border: 2px solid #333;
                    color: white;
                    font-size: 14px;
                    line-height: 1.4;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                    opacity: 1;
                    transition: all 0.3s ease;
                    word-wrap: break-word;
                    z-index: 999997;
                    display: block;
                    overflow: visible;
                    border-radius: 20px;
                }
                
                /* SIMPLE BUBBLE APPEARANCE ANIMATION */
                @keyframes bubbleAppear {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                /* FALLBACK STATE - IF ANIMATION DOESN'T WORK */
                .chatbot-bubble.visible {
                    transform: scale(1) !important;
                    opacity: 1 !important;
                    top: calc(60vh - 80px) !important;
                }
                
                /* BUBBLE TEXT - START FROM BOTTOM */
                .chatbot-bubble .bubble-text {
                    display: block;
                    width: 100%;
                    min-height: 20px;
                    text-align: left;
                    vertical-align: bottom;
                }
                
                .chatbot-bubble .typing-indicator {
                    display: block;
                    width: 100%;
                    text-align: left;
                }
                
                /* ADVANCED COMIC-STYLE BUBBLE SIZES AND SHAPES */
                .chatbot-bubble.size-small {
                    max-width: 220px !important;
                    padding: 12px 18px !important;
                    font-size: 12px !important;
                    min-height: 50px;
                    line-height: 1.3;
                }
                
                .chatbot-bubble.size-medium {
                    max-width: 300px !important;
                    padding: 16px 22px !important;
                    font-size: 14px !important;
                    min-height: 60px;
                    line-height: 1.4;
                }
                
                .chatbot-bubble.size-large {
                    max-width: 360px !important;
                    padding: 20px 26px !important;
                    font-size: 15px !important;
                    min-height: 70px;
                    line-height: 1.4;
                }
                
                .chatbot-bubble.size-extra-large {
                    max-width: 420px !important;
                    padding: 24px 30px !important;
                    font-size: 16px !important;
                    min-height: 80px;
                    line-height: 1.5;
                }
                
                /* COMIC-STYLE SHAPES WITH ADVANCED CLIP-PATHS */
                .chatbot-bubble.shape-rounded {
                    border-radius: 25px 25px 25px 8px !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important;
                }
                
                .chatbot-bubble.shape-pill {
                    border-radius: 50px !important;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15) !important;
                }
                
                .chatbot-bubble.shape-square {
                    border-radius: 12px !important;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1) !important;
                }
                
                .chatbot-bubble.shape-hexagon {
                    border-radius: 0 !important;
                    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%) !important;
                    box-shadow: 0 5px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1) !important;
                }
                
                .chatbot-bubble.shape-speech {
                    border-radius: 25px 25px 25px 6px !important;
                    position: relative;
                    box-shadow: 0 6px 22px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15) !important;
                }
                
                .chatbot-bubble.shape-speech::after {
                    content: '';
                    position: absolute;
                    bottom: -12px;
                    left: 25px;
                    width: 0;
                    height: 0;
                    border-left: 12px solid transparent;
                    border-right: 12px solid transparent;
                    border-top: 12px solid #1a1a1a;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                }
                
                /* NEW COMIC-STYLE SHAPES */
                .chatbot-bubble.shape-cloud {
                    border-radius: 50px 50px 50px 50px / 60px 60px 60px 60px !important;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.2) !important;
                    position: relative;
                }
                
                .chatbot-bubble.shape-cloud::before {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 30px;
                    width: 20px;
                    height: 20px;
                    background: #1a1a1a;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                
                .chatbot-bubble.shape-cloud::after {
                    content: '';
                    position: absolute;
                    bottom: -12px;
                    left: 45px;
                    width: 15px;
                    height: 15px;
                    background: #1a1a1a;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                
                .chatbot-bubble.shape-explosion {
                    border-radius: 0 !important;
                    clip-path: polygon(50% 0%, 80% 20%, 100% 50%, 80% 80%, 50% 100%, 20% 80%, 0% 50%, 20% 20%) !important;
                    box-shadow: 0 7px 20px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15) !important;
                }
                
                .chatbot-bubble.shape-diamond {
                    border-radius: 0 !important;
                    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%) !important;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1) !important;
                }
                
                .chatbot-bubble.shape-heart {
                    border-radius: 0 !important;
                    clip-path: polygon(50% 85%, 15% 45%, 15% 15%, 50% 35%, 85% 15%, 85% 45%) !important;
                    box-shadow: 0 8px 22px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15) !important;
                }
                
                .chatbot-bubble.shape-star {
                    border-radius: 0 !important;
                    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) !important;
                    box-shadow: 0 7px 20px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15) !important;
                }
                
                .chatbot-bubble.shape-burst {
                    border-radius: 0 !important;
                    clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 90% 60%, 100% 100%, 50% 90%, 0% 100%, 10% 60%, 0% 35%, 20% 10%) !important;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.2) !important;
                }
                
                /* CLASSIC SPEECH BUBBLE SHAPE - FROM PROVIDED IMAGE */
                .chatbot-bubble.shape-classic-speech {
                    border-radius: 20px 20px 20px 5px !important;
                    position: relative;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15) !important;
                    background: linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a) !important;
                    overflow: visible !important;
                }
                
                .chatbot-bubble.shape-classic-speech::after {
                    content: '';
                    position: absolute;
                    top: -18px;
                    right: 25px;
                    width: 0;
                    height: 0;
                    border-left: 18px solid transparent;
                    border-right: 18px solid transparent;
                    border-bottom: 18px solid #1a1a1a;
                    z-index: 999998;
                    filter: drop-shadow(0 -4px 8px rgba(0,0,0,0.4));
                }
                
                /* COMIC-STYLE ANIMATIONS */
                .chatbot-bubble.comic-bounce {
                    animation: comicBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                .chatbot-bubble.comic-wiggle {
                    animation: comicWiggle 0.8s ease-in-out;
                }
                
                .chatbot-bubble.comic-pulse {
                    animation: comicPulse 1.2s ease-in-out infinite;
                }
                
                @keyframes comicBounce {
                    0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
                    50% { transform: scale(1.1) rotate(2deg); }
                    70% { transform: scale(0.9) rotate(-1deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                
                @keyframes comicWiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(3deg); }
                    75% { transform: rotate(-3deg); }
                }
                
                @keyframes comicPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                /* COMIC-STYLE GRADIENTS AND EFFECTS */
                .chatbot-bubble.comic-glow {
                    box-shadow: 0 0 20px rgba(0, 238, 255, 0.6), 0 6px 25px rgba(0,0,0,0.4) !important;
                    border: 2px solid rgba(0, 238, 255, 0.8) !important;
                }
                
                .chatbot-bubble.comic-shine {
                    background: linear-gradient(135deg, #000000, #1a1a1a, #2a2a2a, #1a1a1a, #000000) !important;
                    position: relative;
                    overflow: hidden;
                }
                
                .chatbot-bubble.comic-shine::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: shine 2s infinite;
                }
                
                @keyframes shine {
                    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }
                
                .chatbot-bubble.hidden {
                    opacity: 0;
                    transform: scale(0.8);
                }
                
                .chatbot-bubble.welcome-bubble {
                    left: 0px;
                    border-color: ${this.config.avatarColor};
                    background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.8));
                    z-index: 999996;
                    display: none;
                }
                
                .chatbot-bubble.response-bubble {
                    left: 0px;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.7));
                }
                
                .bubble-text {
                    margin: 0;
                }
                
                /* SUGGESTED ACTIONS */
                .suggested-actions {
                    margin-top: 10px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }
                
                .suggested-action {
                    padding: 4px 8px;
                    background: rgba(0, 255, 238, 0.2);
                    border: 1px solid ${this.config.avatarColor};
                    border-radius: 12px;
                    font-size: 0.7rem;
                    color: ${this.config.avatarColor};
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .suggested-action:hover {
                    background: rgba(0, 255, 238, 0.3);
                    transform: scale(1.05);
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
                        width: 250px !important;
                        left: 15px !important;
                        bottom: calc(40vh - 242px) !important;
                    }
                    
                    .chatbot-bubble {
                        bottom: calc(40vh + 80px);
                        max-width: 250px;
                    }
                }
                
                @media (max-width: 480px) {
                    .chatbot-avatar {
                        height: 120px;
                    }
                    
                    .chatbot-typing-box {
                        width: 200px !important;
                        left: 10px !important;
                        bottom: calc(40vh - 220px) !important;
                        padding: 12px 15px;
                    }
                    
                    .chatbot-bubble {
                        bottom: calc(40vh + 80px);
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
            window.enhancedAgenticChatbotInstance = this;
            
            console.log('🔍 Binding events...');
            console.log('🔍 Avatar element:', this.elements.avatar);
            
            // Add click event to avatar - EXACT ORIGINAL SYSTEM
            if (this.elements.avatar) {
                this.elements.avatar.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🚀 Enhanced 3D Avatar clicked!');
                    this.toggleChat();
                });
                console.log('✅ Enhanced 3D Avatar click event bound');
            } else {
                console.error('❌ Avatar element not found!');
            }
            
            // Add click event to send button
            if (this.elements.sendBtn) {
                this.elements.sendBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🚀 Enhanced Send button clicked!');
                    this.sendMessage();
                });
                console.log('✅ Enhanced Send button click event bound');
            } else {
                console.error('❌ Send button element not found!');
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
                console.log('✅ Enhanced Input field found, adding event listeners...');
                
                this.elements.input.addEventListener('click', (e) => {
                    console.log('🚀 Enhanced Input field clicked!');
                    e.stopPropagation();
                });
                
                this.elements.input.addEventListener('focus', (e) => {
                    console.log('🚀 Enhanced Input field focused!');
                });
                
                this.elements.input.addEventListener('input', (e) => {
                    console.log('🚀 Enhanced Input field value changed:', e.target.value);
                });
                
                this.elements.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🚀 Enter key pressed in enhanced input field...');
                        this.sendMessage();
                    }
                });
                
                console.log('✅ Enhanced Input field event listeners added');
            } else {
                console.error('❌ Enhanced Input field not found!');
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
                    const sixtyPercentDown = Math.floor(viewportHeight * 0.6);
                    this.elements.container.style.top = `${sixtyPercentDown}px`;
                    this.elements.container.style.left = `${this.config.offsetX}px`;
                    this.elements.container.style.right = 'auto';
                    this.elements.container.style.bottom = 'auto';
                    console.log('🔄 Repositioned enhanced chatbot to 60% down from top (10% below) on LEFT side');
                }
            });
            
            const totalEventsTime = performance.now();
            console.log('🚀 [PERF] Total bindEvents time:', totalEventsTime - eventsStart, 'ms');
            console.log('✅ All enhanced events bound successfully');
        }
        
        toggleChat() {
            // Prevent double-toggle
            if (this.isToggling) {
                console.log('🚫 Enhanced Toggle already in progress, ignoring...');
                return;
            }
            
            this.isToggling = true;
            
            const typingBox = this.elements.typingBox;
            const welcomeBubble = this.elements.welcomeBubble;
            
            console.log('🚀 Enhanced toggleChat called!');
            console.log('🔍 typingBox display:', typingBox.style.display);
            console.log('🔍 typingBox element:', typingBox);
            
            if (typingBox.style.display === 'none' || typingBox.style.display === '') {
                // Open chat - EXACT ORIGINAL SYSTEM
                console.log('🚀 Opening enhanced chat...');
                
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
                this.elements.input.focus();
                this.elements.input.style.pointerEvents = 'auto';
                this.elements.input.style.userSelect = 'text';
                this.elements.input.style.webkitUserSelect = 'text';
                
                if (this.config.onOpen) this.config.onOpen();
            } else {
                // Close chat
                console.log('🚀 Closing enhanced chat...');
                typingBox.classList.remove('active');
                setTimeout(() => {
                    typingBox.style.display = 'none';
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
            console.log('🚀 Enhanced sendMessage function entered');
            const input = this.elements.input;
            const message = input.value.trim();
            console.log('🚀 Enhanced sendMessage called with:', message);
            
            if (message) {
                console.log('✅ Enhanced Message is not empty, proceeding...');
                // Clear input
                input.value = '';
                console.log('✅ Enhanced Input cleared');
                
                // Create response bubble
                this.createResponseBubble(message);
                console.log('✅ Enhanced createResponseBubble called');
                
                // Call custom message handler
                if (this.config.onMessage) {
                    console.log('🔍 Calling enhanced custom message handler...');
                    this.config.onMessage(message, this);
                    console.log('✅ Enhanced custom message handler called');
                }
            } else {
                console.log('⚠️ Empty enhanced message, not sending');
            }
        }
        
        createResponseBubble(message) {
            console.log('🚀 Enhanced createResponseBubble called with:', message);
            const container = this.elements.bubbleContainer;
            console.log('🔍 Enhanced Bubble container:', container);
            
            // Advanced comic-style size and shape selection
            const sizes = ['size-medium'];
            const shapes = [
                'shape-speech'
            ];
            
            // Comic-style effects
            const effects = ['comic-shine'];
            
            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            
            const bubble = document.createElement('div');
            bubble.className = 'chatbot-bubble response-bubble enhanced-response-bubble';
            bubble.classList.add(randomSize);
            bubble.classList.add(randomShape);
            bubble.classList.add(randomEffect);
            bubble.style.zIndex = '999997';
            // Let CSS handle positioning naturally
            
            console.log('🎨 Applied bubble classes:', {
                size: randomSize,
                shape: randomShape,
                effect: randomEffect,
                allClasses: bubble.className
            });
            
            // Add typing indicator first
            bubble.innerHTML = '<div class="bubble-text typing-indicator">Enhanced AI is thinking...</div>';
            container.appendChild(bubble);
            console.log('✅ Comic-Style Bubble added with size:', randomSize, 'shape:', randomShape, 'effect:', randomEffect);
            console.log('🔍 Bubble classes:', bubble.className);
            
            // Animate in
            setTimeout(() => bubble.classList.add('active'), 50);
            
            // Add fallback class to ensure visibility
            setTimeout(() => {
                bubble.classList.add('visible');
            }, 100);
            
            // Get enhanced AI response with LangGraph features
            setTimeout(async () => {
                console.log('🔍 About to call enhanced generateResponse...');
                try {
                    const response = await this.generateEnhancedResponse(message);
                    console.log('✅ Enhanced generateResponse returned:', response);
                    this.typeEnhancedResponse(bubble, response);
                } catch (error) {
                    console.error('❌ Error getting enhanced AI response:', error);
                    this.typeEnhancedResponse(bubble, 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.');
                }
            }, 1000);
        }
        
        typeEnhancedResponse(bubble, response) {
            const textElement = bubble.querySelector('.bubble-text');
            textElement.innerHTML = '';
            textElement.classList.remove('typing-indicator');
            
            // Add simple appearance animation
            bubble.style.animation = 'bubbleAppear 0.3s ease-out forwards';
            
            // Split response into words for better typing effect
            const words = response.split(' ');
            let wordIndex = 0;
            
            const typeWord = () => {
                if (wordIndex < words.length) {
                    // Add word with space (except for last word)
                    const word = words[wordIndex] + (wordIndex < words.length - 1 ? ' ' : '');
                    textElement.innerHTML += word;
                    wordIndex++;
                    setTimeout(typeWord, this.config.typingSpeed * 3); // Slower for words
                } else {
                    // Message finished typing - start 4-second countdown
                    console.log('✅ Message finished typing, starting 4-second countdown');
                    setTimeout(() => {
                        bubble.classList.add('hidden');
                        setTimeout(() => bubble.remove(), 300);
                    }, this.config.bubbleTimeout);
                }
            };
            
            typeWord();
        }
        
        async generateEnhancedResponse(message) {
            // Enhanced AI integration with LangGraph
            try {
                console.log('🤖 Enhanced generateResponse called with:', message);
                console.log('🔍 About to fetch from enhanced endpoint:', this.config.enhancedEndpoint);
                
                const response = await fetch(this.config.enhancedEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message,
                        user_id: 'website_user',
                        session_id: `session_${Date.now()}`
                    })
                });
                
                console.log('🔍 Enhanced Fetch response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('🤖 Enhanced Received response:', data);
                
                // Show LangGraph features if available
                if (data.langgraph_features) {
                    this.showLangGraphFeatures(data);
                }
                
                return data.response || data.message || 'Enhanced response received!';
                
            } catch (error) {
                console.error('❌ Enhanced AI response error:', error);
                return 'I apologize, but I\'m having trouble connecting to my enhanced brain right now. Please make sure the enhanced chatbot server is running! 🤖';
            }
        }
        
        showLangGraphFeatures(data) {
            // Show workflow steps
            if (this.config.showWorkflowSteps && data.metadata && data.metadata.workflow_step) {
                const workflowSteps = this.elements.workflowSteps;
                if (workflowSteps) {
                    workflowSteps.textContent = `Workflow Step: ${data.metadata.workflow_step}`;
                    workflowSteps.classList.add('active');
                    setTimeout(() => workflowSteps.classList.remove('active'), 3000);
                }
            }
            
            // Show confidence score
            if (this.config.showConfidenceScore && data.confidence_score) {
                const confidenceIndicator = this.elements.confidenceIndicator;
                if (confidenceIndicator) {
                    confidenceIndicator.textContent = `Confidence: ${Math.round(data.confidence_score * 100)}%`;
                    confidenceIndicator.classList.add('active');
                    setTimeout(() => confidenceIndicator.classList.remove('active'), 3000);
                }
            }
            
            // Show suggested actions
            if (this.config.showSuggestedActions && data.suggested_actions) {
                const suggestedActions = this.elements.suggestedActions;
                if (suggestedActions && data.suggested_actions.length > 0) {
                    suggestedActions.innerHTML = data.suggested_actions.map(action => 
                        `<span class="suggested-action" onclick="window.enhancedAgenticChatbotInstance.sendSuggestedAction('${action}')">${action}</span>`
                    ).join('');
                }
            }
            
            // Call workflow step callback
            if (this.config.onWorkflowStep && data.metadata) {
                this.config.onWorkflowStep(data.metadata.workflow_step, data.metadata.intent);
            }
        }
        
        sendSuggestedAction(action) {
            console.log('🚀 Suggested action clicked:', action);
            if (this.elements.input) {
                this.elements.input.value = action;
                this.sendMessage();
            }
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
                this.elements.avatar.title = `Click to chat with ${this.config.avatarName} (LangGraph Enhanced)`;
            }
        }
        
        destroy() {
            // Remove widget from DOM
            if (this.elements.container && this.elements.container.parentNode) {
                this.elements.container.parentNode.removeChild(this.elements.container);
            }
            // Remove global reference
            delete window.enhancedAgenticChatbotInstance;
        }
    }
    
    // Make it globally accessible
    if (typeof window !== 'undefined') {
        window.EnhancedAgenticChatbotWidget = EnhancedAgenticChatbotWidget;
        console.log('🚀 Enhanced Agentic Chatbot Widget class registered globally:', typeof EnhancedAgenticChatbotWidget);
    }
    
})();
