/**
 * 🚀 ENHANCED AGENTIC CHATBOT WIDGET - OPTIMIZED VERSION
 * 
 * Optimized for better performance and faster loading
 */

(function() {
    'use strict';
    
    class EnhancedAgenticChatbotWidget {
        constructor(options = {}) {
            // Optimized configuration
            this.config = {
                avatarType: options.avatarType || 'assistant',
                avatarName: options.avatarName || 'Enhanced AI Assistant',
                avatarImage: options.avatarImage || 'assets/chatbot-avatar-optimized.webp',
                avatarColor: options.avatarColor || '#00ffee',
                position: options.position || 'bottom-right',
                offsetX: options.offsetX || 120,
                offsetY: options.offsetY || 20,
                theme: options.theme || 'dark',
                enableLangGraph: options.enableLangGraph !== false,
                enhancedEndpoint: options.enhancedEndpoint || 'http://localhost:5001/chat',
                fallbackEndpoint: options.fallbackEndpoint || 'http://localhost:5003/chat/send',
                autoOpen: options.autoOpen || false,
                typingSpeed: options.typingSpeed || 50,
                bubbleTimeout: options.bubbleTimeout || 4000
            };
            
            this.init();
        }
        
        init() {
            this.createWidget();
            this.injectStyles();
            this.bindEvents();
            this.showWelcomeMessage();
            console.log('🚀 Enhanced Agentic Chatbot initialized!');
        }
        
        createWidget() {
            const widgetHTML = `
                <div class="enhanced-chatbot-widget">
                    <div class="chatbot-avatar-container">
                        <img src="${this.config.avatarImage}" 
                             class="chatbot-avatar assistant-avatar enhanced-avatar" 
                             alt="${this.config.avatarName}" 
                             title="Click to chat with ${this.config.avatarName} (LangGraph Enhanced)"
                             loading="lazy"
                             decoding="async">
                    </div>
                    <div class="chatbot-typing-box" style="display: none;">
                        <input type="text" class="chatbot-input" placeholder="Type your message...">
                        <button class="chatbot-send-btn">Send</button>
                    </div>
                </div>
            `;
            
            const container = document.getElementById('chatbot-widget') || document.body;
            container.insertAdjacentHTML('beforeend', widgetHTML);
            
            this.elements = {
                widget: container.querySelector('.enhanced-chatbot-widget'),
                avatar: container.querySelector('.chatbot-avatar'),
                typingBox: container.querySelector('.chatbot-typing-box'),
                input: container.querySelector('.chatbot-input'),
                sendBtn: container.querySelector('.chatbot-send-btn')
            };
            
            this.positionWidget();
        }
        
        positionWidget() {
            if (!this.elements.widget) return;
            
            const styles = this.getPositionStyles();
            Object.assign(this.elements.widget.style, styles);
        }
        
        getPositionStyles() {
            const isLeft = this.config.position.includes('left');
            const isRight = this.config.position.includes('right');
            const isTop = this.config.position.includes('top');
            const isBottom = this.config.position.includes('bottom');
            
            return {
                position: 'fixed',
                [isLeft ? 'left' : 'right']: `${this.config.offsetX}px`,
                [isTop ? 'top' : 'bottom']: `${this.config.offsetY}px`,
                zIndex: '9999',
                transform: 'none'
            };
        }
        
        injectStyles() {
            if (document.getElementById('enhanced-chatbot-styles')) return;
            
            const styles = `
                <style id="enhanced-chatbot-styles">
                    .enhanced-chatbot-widget {
                        position: fixed;
                        z-index: 9999;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    
                    .chatbot-avatar-container {
                        position: relative;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    }
                    
                    .chatbot-avatar {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        border: 3px solid ${this.config.avatarColor};
                        box-shadow: 0 4px 20px rgba(0, 255, 238, 0.3);
                        transition: all 0.3s ease;
                        object-fit: cover;
                    }
                    
                    .chatbot-avatar:hover {
                        transform: scale(1.1);
                        box-shadow: 0 6px 25px rgba(0, 255, 238, 0.5);
                    }
                    
                    .chatbot-typing-box {
                        position: absolute;
                        bottom: -60px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.9);
                        border: 1px solid ${this.config.avatarColor};
                        border-radius: 25px;
                        padding: 10px 15px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        min-width: 250px;
                        backdrop-filter: blur(10px);
                    }
                    
                    .chatbot-input {
                        flex: 1;
                        background: transparent;
                        border: none;
                        color: white;
                        outline: none;
                        font-size: 14px;
                        padding: 5px;
                    }
                    
                    .chatbot-send-btn {
                        background: ${this.config.avatarColor};
                        border: none;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: black;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    }
                    
                    .chatbot-send-btn:hover {
                        transform: scale(1.1);
                        box-shadow: 0 2px 10px rgba(0, 255, 238, 0.5);
                    }
                    
                    .chatbot-bubble {
                        position: absolute;
                        bottom: calc(40vh + 80px);
                        left: 20px;
                        max-width: 300px;
                        background: rgba(0, 0, 0, 0.9);
                        border: 1px solid ${this.config.avatarColor};
                        border-radius: 20px;
                        padding: 15px 20px;
                        color: white;
                        font-size: 14px;
                        line-height: 1.4;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                        opacity: 0;
                        transform: scaleY(0.1) scaleX(0.6);
                        transition: all 0.3s ease;
                        z-index: 10000;
                    }
                    
                    .chatbot-bubble.visible {
                        opacity: 1;
                        transform: scale(1);
                    }
                    
                    .bubble-text {
                        margin: 0;
                    }
                    
                    .typing-indicator {
                        color: ${this.config.avatarColor};
                        font-style: italic;
                    }
                    
                    @media (max-width: 768px) {
                        .chatbot-avatar {
                            width: 60px;
                            height: 60px;
                        }
                        
                        .chatbot-typing-box {
                            min-width: 200px;
                            bottom: -50px;
                        }
                        
                        .chatbot-bubble {
                            max-width: 250px;
                            left: 10px;
                        }
                    }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        bindEvents() {
            if (!this.elements.avatar) return;
            
            // Avatar click to toggle typing box
            this.elements.avatar.addEventListener('click', () => {
                this.toggleTypingBox();
            });
            
            // Send button click
            if (this.elements.sendBtn) {
                this.elements.sendBtn.addEventListener('click', () => {
                    this.sendMessage();
                });
            }
            
            // Enter key in input
            if (this.elements.input) {
                this.elements.input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });
            }
        }
        
        toggleTypingBox() {
            if (!this.elements.typingBox) return;
            
            const isVisible = this.elements.typingBox.style.display !== 'none';
            this.elements.typingBox.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible && this.elements.input) {
                this.elements.input.focus();
            }
        }
        
        async sendMessage() {
            const input = this.elements.input;
            if (!input || !input.value.trim()) return;
            
            const message = input.value.trim();
            input.value = '';
            
            this.showTypingBubble();
            
            try {
                const response = await this.sendToBackend(message);
                this.showResponseBubble(response);
            } catch (error) {
                this.showErrorBubble();
            }
        }
        
        async sendToBackend(message) {
            const response = await fetch(this.config.enhancedEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_id: 'website_user',
                    session_id: 'website_session'
                })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data.response || 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
        }
        
        showTypingBubble() {
            this.createBubble('Enhanced AI is thinking...', 'typing-indicator');
        }
        
        showResponseBubble(response) {
            this.createBubble(response);
        }
        
        showErrorBubble() {
            this.createBubble('I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.');
        }
        
        createBubble(text, className = '') {
            const bubble = document.createElement('div');
            bubble.className = `chatbot-bubble ${className}`;
            bubble.innerHTML = `<div class="bubble-text">${text}</div>`;
            
            document.body.appendChild(bubble);
            
            // Show bubble
            setTimeout(() => {
                bubble.classList.add('visible');
            }, 100);
            
            // Hide bubble after timeout
            setTimeout(() => {
                bubble.classList.remove('visible');
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.parentNode.removeChild(bubble);
                    }
                }, 300);
            }, this.config.bubbleTimeout);
        }
        
        showWelcomeMessage() {
            if (this.config.autoOpen) {
                this.toggleTypingBox();
            }
        }
    }
    
    // Register globally
    window.EnhancedAgenticChatbotWidget = EnhancedAgenticChatbotWidget;
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.initializeEnhancedChatbot) {
                window.initializeEnhancedChatbot();
            }
        });
    } else {
        if (window.initializeEnhancedChatbot) {
            window.initializeEnhancedChatbot();
        }
    }
    
})();
