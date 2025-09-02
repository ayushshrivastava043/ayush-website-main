const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple AI response logic
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Keyword-based responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm Ayush's AI Assistant. How can I help you today? 🚀";
    }
    
    if (lowerMessage.includes('how are you')) {
        return "I'm doing great! Thanks for asking. I'm here to help you with any questions you might have! 😊";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return "I'm here to help! I can assist with questions about Ayush's projects, provide information, or just chat. What would you like to know? 🤖";
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
        return "Ayush has worked on many exciting projects! From AI applications to web development, there's a lot to explore. Would you like to know about any specific area? 💼";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
        return "AI is fascinating! I'm an AI assistant myself. Ayush has worked on various AI projects including chatbots, machine learning models, and automation tools. 🤖";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
        return "You can reach Ayush through his portfolio website or LinkedIn. I'm sure he'd love to hear from you! 📧";
    }
    
    if (lowerMessage.includes('thank')) {
        return "You're welcome! I'm happy to help. Is there anything else you'd like to know? 😊";
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return "Goodbye! It was nice chatting with you. Feel free to come back anytime! 👋";
    }
    
    // Default responses
    const defaultResponses = [
        "That's an interesting question! Let me think about that... 🤔",
        "I'd be happy to help with that! Could you tell me more? 📝",
        "That's a great point! I'm here to assist you with any information you need. 🚀",
        "I understand what you're asking. Let me provide some helpful information! 💡",
        "Thanks for sharing that! I'm here to help answer your questions. 🤖"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Chat endpoint
app.post('/api/chat', (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        console.log('🤖 Received message:', message);
        
        // Simulate some processing time
        setTimeout(() => {
            const response = generateAIResponse(message);
            console.log('🤖 Sending response:', response);
            res.json({ response });
        }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
        
    } catch (error) {
        console.error('❌ Error processing message:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            response: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment. 🤖'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Chatbot server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
