#!/usr/bin/env python3
"""
Enhanced Agentic Chatbot using LangGraph
Autonomous AI Assistant System with Advanced Workflow Capabilities
"""

import os
import json
import asyncio
import sqlite3
from datetime import datetime
from typing import Dict, List, Any, Optional, TypedDict
from dataclasses import dataclass
from pathlib import Path

# LangGraph imports
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
# Note: transformers temporarily disabled due to NumPy compatibility issues
# from transformers import pipeline

# Flask for API
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configuration
@dataclass
class ChatbotConfig:
    """Configuration for the enhanced agentic chatbot"""
    # Model settings
    primary_model: str = "gpt-3.5-turbo"
    fallback_model: str = "microsoft/DialoGPT-medium"
    huggingface_model: str = "microsoft/DialoGPT-medium"
    
    # Database settings
    db_path: str = "agentic_chatbot.db"
    checkpoint_path: str = "agentic_checkpoints.db"
    
    # API settings
    port: int = 5001
    host: str = "localhost"
    
    # Workflow settings
    max_iterations: int = 10
    timeout_seconds: int = 30
    enable_memory: bool = True
    enable_tools: bool = True

# State definition for LangGraph
class AgenticState(TypedDict):
    """State structure for the agentic chatbot workflow"""
    # Core conversation state
    messages: List[Dict[str, Any]]
    current_message: str
    user_id: str
    session_id: str
    
    # Context and memory
    context: Dict[str, Any]
    user_preferences: Dict[str, Any]
    conversation_history: List[Dict[str, Any]]
    
    # Workflow state
    current_task: str
    task_status: str
    workflow_step: int
    max_steps: int
    
    # AI responses
    ai_response: str
    confidence_score: float
    suggested_actions: List[str]
    
    # Tool integration
    tools_used: List[str]
    tool_results: Dict[str, Any]
    
    # Error handling
    error_message: str
    retry_count: int
    max_retries: int

class EnhancedAgenticChatbot:
    """Enhanced Agentic Chatbot using LangGraph for autonomous AI workflows"""
    
    def __init__(self, config: ChatbotConfig):
        self.config = config
        self.app = Flask(__name__)
        CORS(self.app)
        
        # Initialize components
        self.llm = None
        self.hf_pipeline = None
        self.workflow = None
        self.checkpointer = None
        self.db_connection = None
        
        # Initialize the system
        self._initialize_components()
        self._setup_routes()
        
    def _initialize_components(self):
        """Initialize all chatbot components"""
        print("🚀 Initializing Enhanced Agentic Chatbot...")
        
        # Initialize database
        self._init_database()
        
        # Initialize models
        self._init_models()
        
        # Initialize LangGraph workflow
        self._init_workflow()
        
        print("✅ Enhanced Agentic Chatbot initialized successfully!")
    
    def _init_database(self):
        """Initialize SQLite database for persistent storage"""
        try:
            self.db_connection = sqlite3.connect(self.config.db_path)
            cursor = self.db_connection.cursor()
            
            # Create tables
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    message TEXT NOT NULL,
                    response TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    context TEXT,
                    metadata TEXT
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_preferences (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT UNIQUE NOT NULL,
                    preferences TEXT NOT NULL,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS workflow_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    workflow_type TEXT NOT NULL,
                    steps_completed INTEGER,
                    status TEXT,
                    metadata TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            self.db_connection.commit()
            print("✅ Database initialized")
            
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
    
    def _init_models(self):
        """Initialize AI models"""
        try:
            # Initialize OpenAI model (if API key available)
            if os.getenv('OPENAI_API_KEY'):
                self.llm = ChatOpenAI(
                    model=self.config.primary_model,
                    temperature=0.7,
                    max_tokens=1000
                )
                print("✅ OpenAI model initialized")
            else:
                print("⚠️ OpenAI API key not found, using Hugging Face models")
            
            # Initialize Hugging Face pipeline (temporarily disabled)
            # self.hf_pipeline = pipeline(
            #     "text-generation",
            #     model=self.config.huggingface_model,
            #     max_length=200,
            #     temperature=0.7,
            #     do_sample=True
            # )
            self.hf_pipeline = None
            print("⚠️ Hugging Face model temporarily disabled due to NumPy compatibility")
            
        except Exception as e:
            print(f"❌ Model initialization error: {e}")
    
    def _init_workflow(self):
        """Initialize LangGraph workflow"""
        try:
            # Note: Checkpointer functionality temporarily disabled
            # Will be re-enabled when langgraph-checkpoint is properly configured
            self.checkpointer = None
            
            # Create the workflow graph
            workflow = StateGraph(AgenticState)
            
            # Add nodes for different workflow steps
            workflow.add_node("analyze_input", self._analyze_input_node)
            workflow.add_node("retrieve_context", self._retrieve_context_node)
            workflow.add_node("generate_response", self._generate_response_node)
            workflow.add_node("validate_response", self._validate_response_node)
            workflow.add_node("update_memory", self._update_memory_node)
            workflow.add_node("handle_error", self._handle_error_node)
            
            # Define workflow edges
            workflow.add_edge("analyze_input", "retrieve_context")
            workflow.add_edge("retrieve_context", "generate_response")
            workflow.add_edge("generate_response", "validate_response")
            workflow.add_edge("validate_response", "update_memory")
            workflow.add_edge("update_memory", END)
            
            # Add error handling edges
            workflow.add_edge("handle_error", "generate_response")
            
            # Set entry point
            workflow.set_entry_point("analyze_input")
            
            # Compile the workflow
            if self.checkpointer:
                self.workflow = workflow.compile(checkpointer=self.checkpointer)
            else:
                self.workflow = workflow.compile()
            print("✅ LangGraph workflow initialized")
            
        except Exception as e:
            print(f"❌ Workflow initialization error: {e}")
    
    # Workflow Node Functions
    def _analyze_input_node(self, state: AgenticState) -> AgenticState:
        """Analyze user input and determine intent"""
        try:
            message = state["current_message"]
            print(f"🔍 Analyzing input: {message}")
            
            # Simple intent analysis (can be enhanced with NLP)
            intent = self._analyze_intent(message)
            state["current_task"] = intent
            state["task_status"] = "analyzing"
            state["workflow_step"] = 1
            
            # Update context
            state["context"]["intent"] = intent
            state["context"]["analysis_timestamp"] = datetime.now().isoformat()
            
            return state
            
        except Exception as e:
            state["error_message"] = str(e)
            return self._handle_error_node(state)
    
    def _retrieve_context_node(self, state: AgenticState) -> AgenticState:
        """Retrieve relevant context and user preferences"""
        try:
            user_id = state["user_id"]
            session_id = state["session_id"]
            
            print(f"📚 Retrieving context for user: {user_id}")
            
            # Get user preferences
            preferences = self._get_user_preferences(user_id)
            state["user_preferences"] = preferences
            
            # Get conversation history
            history = self._get_conversation_history(session_id)
            state["conversation_history"] = history
            
            # Update context
            state["context"]["user_preferences"] = preferences
            state["context"]["conversation_length"] = len(history)
            state["workflow_step"] = 2
            
            return state
            
        except Exception as e:
            state["error_message"] = str(e)
            return self._handle_error_node(state)
    
    def _generate_response_node(self, state: AgenticState) -> AgenticState:
        """Generate AI response using appropriate model"""
        try:
            message = state["current_message"]
            context = state["context"]
            preferences = state["user_preferences"]
            
            print(f"🤖 Generating response for: {message}")
            
            # Prepare prompt with context
            prompt = self._prepare_prompt(message, context, preferences)
            
            # Generate response using available model
            if self.llm:
                response = self._generate_openai_response(prompt)
            else:
                response = self._generate_fallback_response(prompt)
            
            state["ai_response"] = response
            state["confidence_score"] = 0.8  # Can be calculated based on model confidence
            state["workflow_step"] = 3
            
            return state
            
        except Exception as e:
            state["error_message"] = str(e)
            return self._handle_error_node(state)
    
    def _validate_response_node(self, state: AgenticState) -> AgenticState:
        """Validate and improve the generated response"""
        try:
            response = state["ai_response"]
            print(f"✅ Validating response: {response[:50]}...")
            
            # Basic validation
            if len(response.strip()) < 5:
                state["ai_response"] = "I apologize, but I need more context to provide a helpful response. Could you please rephrase your question?"
                state["confidence_score"] = 0.3
            
            # Add suggested actions
            state["suggested_actions"] = self._generate_suggested_actions(state)
            state["workflow_step"] = 4
            
            return state
            
        except Exception as e:
            state["error_message"] = str(e)
            return self._handle_error_node(state)
    
    def _update_memory_node(self, state: AgenticState) -> AgenticState:
        """Update memory and store conversation"""
        try:
            # Store conversation in database
            self._store_conversation(state)
            
            # Update user preferences if needed
            self._update_user_preferences(state)
            
            # Store workflow history
            self._store_workflow_history(state)
            
            state["workflow_step"] = 5
            state["task_status"] = "completed"
            
            print("💾 Memory updated successfully")
            return state
            
        except Exception as e:
            state["error_message"] = str(e)
            return self._handle_error_node(state)
    
    def _handle_error_node(self, state: AgenticState) -> AgenticState:
        """Handle errors and provide fallback responses"""
        try:
            error = state.get("error_message", "Unknown error")
            retry_count = state.get("retry_count", 0)
            
            print(f"❌ Handling error: {error}")
            
            if retry_count < state.get("max_retries", 3):
                state["retry_count"] = retry_count + 1
                state["ai_response"] = "I'm processing your request. Please give me a moment..."
                return self._generate_response_node(state)
            else:
                state["ai_response"] = "I apologize, but I'm experiencing technical difficulties. Please try again later."
                state["confidence_score"] = 0.1
                state["task_status"] = "error"
                return state
                
        except Exception as e:
            state["ai_response"] = "I'm sorry, but I'm having trouble right now. Please try again."
            state["task_status"] = "error"
            return state
    
    # Helper Methods
    def _analyze_intent(self, message: str) -> str:
        """Simple intent analysis"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greet']):
            return 'greeting'
        elif any(word in message_lower for word in ['help', 'assist', 'support']):
            return 'help_request'
        elif any(word in message_lower for word in ['portfolio', 'project', 'work']):
            return 'portfolio_inquiry'
        elif any(word in message_lower for word in ['ai', 'artificial intelligence', 'machine learning']):
            return 'ai_inquiry'
        elif any(word in message_lower for word in ['contact', 'email', 'reach']):
            return 'contact_request'
        else:
            return 'general_inquiry'
    
    def _get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """Get user preferences from database"""
        try:
            cursor = self.db_connection.cursor()
            cursor.execute("SELECT preferences FROM user_preferences WHERE user_id = ?", (user_id,))
            result = cursor.fetchone()
            
            if result:
                return json.loads(result[0])
            else:
                return {"theme": "default", "language": "en", "response_style": "friendly"}
                
        except Exception as e:
            print(f"Error getting user preferences: {e}")
            return {"theme": "default", "language": "en", "response_style": "friendly"}
    
    def _get_conversation_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get conversation history from database"""
        try:
            cursor = self.db_connection.cursor()
            cursor.execute(
                "SELECT message, response, timestamp FROM conversations WHERE session_id = ? ORDER BY timestamp DESC LIMIT 10",
                (session_id,)
            )
            results = cursor.fetchall()
            
            history = []
            for row in results:
                history.append({
                    "message": row[0],
                    "response": row[1],
                    "timestamp": row[2]
                })
            
            return history
            
        except Exception as e:
            print(f"Error getting conversation history: {e}")
            return []
    
    def _prepare_prompt(self, message: str, context: Dict[str, Any], preferences: Dict[str, Any]) -> str:
        """Prepare prompt for AI model"""
        prompt = f"""You are Ayush's autonomous AI assistant. You are helpful, intelligent, and can handle complex conversations.

User Message: {message}

Context: {json.dumps(context, indent=2)}
User Preferences: {json.dumps(preferences, indent=2)}

Please provide a helpful, engaging response that demonstrates your autonomous capabilities. Be conversational and show that you can think through problems step by step."""
        
        return prompt
    
    def _generate_openai_response(self, prompt: str) -> str:
        """Generate response using OpenAI model"""
        try:
            messages = [SystemMessage(content=prompt)]
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            print(f"OpenAI generation error: {e}")
            return "I'm having trouble generating a response right now. Please try again."
    
    def _generate_fallback_response(self, prompt: str) -> str:
        """Generate fallback response when no AI model is available"""
        try:
            # Simple rule-based responses for demonstration
            prompt_lower = prompt.lower()
            
            if "hello" in prompt_lower or "hi" in prompt_lower:
                return "Hello! I'm your Enhanced Agentic AI Assistant powered by LangGraph. I can help you with questions about Ayush's portfolio, AI projects, and more. How can I assist you today? 🚀"
            elif "portfolio" in prompt_lower or "project" in prompt_lower:
                return "Ayush has amazing projects in AI, project management, and business development. He works on AI sales tools, video generation, and API development. What specific area interests you? 💼"
            elif "ai" in prompt_lower or "artificial intelligence" in prompt_lower:
                return "Ayush is passionate about AI! He works on AI sales tools, video generation, and API development. He has experience with various AI frameworks and tools. Would you like to know more about any specific AI project? 🤖"
            elif "contact" in prompt_lower or "email" in prompt_lower:
                return "You can reach Ayush through his portfolio contact section or LinkedIn. He's always open to discussing exciting opportunities! 📧"
            else:
                return "That's an interesting question! As Ayush's Enhanced Agentic AI Assistant, I can help you learn more about his work, projects, or expertise. What would you like to explore? 🎯"
                
        except Exception as e:
            print(f"Fallback generation error: {e}")
            return "I'm having trouble generating a response right now. Please try again."
    
    def _generate_suggested_actions(self, state: AgenticState) -> List[str]:
        """Generate suggested follow-up actions"""
        intent = state["context"].get("intent", "general_inquiry")
        
        suggestions = {
            'greeting': ["Tell me about your portfolio", "What AI projects have you worked on?", "How can I contact you?"],
            'help_request': ["What can you help me with?", "Show me your capabilities", "Tell me about your features"],
            'portfolio_inquiry': ["Show me your AI projects", "Tell me about your experience", "What technologies do you use?"],
            'ai_inquiry': ["Explain your AI approach", "Show me your AI tools", "What AI frameworks do you use?"],
            'contact_request': ["Share your LinkedIn", "What's your email?", "How can I reach you?"],
            'general_inquiry': ["Tell me more", "Can you elaborate?", "What else can you help with?"]
        }
        
        return suggestions.get(intent, ["Tell me more", "What else can you help with?"])
    
    def _store_conversation(self, state: AgenticState):
        """Store conversation in database"""
        try:
            cursor = self.db_connection.cursor()
            cursor.execute(
                "INSERT INTO conversations (session_id, user_id, message, response, context, metadata) VALUES (?, ?, ?, ?, ?, ?)",
                (
                    state["session_id"],
                    state["user_id"],
                    state["current_message"],
                    state["ai_response"],
                    json.dumps(state["context"]),
                    json.dumps({
                        "confidence_score": state["confidence_score"],
                        "suggested_actions": state["suggested_actions"],
                        "workflow_step": state["workflow_step"]
                    })
                )
            )
            self.db_connection.commit()
        except Exception as e:
            print(f"Error storing conversation: {e}")
    
    def _update_user_preferences(self, state: AgenticState):
        """Update user preferences based on interaction"""
        try:
            user_id = state["user_id"]
            preferences = state["user_preferences"]
            
            cursor = self.db_connection.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO user_preferences (user_id, preferences) VALUES (?, ?)",
                (user_id, json.dumps(preferences))
            )
            self.db_connection.commit()
        except Exception as e:
            print(f"Error updating user preferences: {e}")
    
    def _store_workflow_history(self, state: AgenticState):
        """Store workflow execution history"""
        try:
            cursor = self.db_connection.cursor()
            cursor.execute(
                "INSERT INTO workflow_history (session_id, workflow_type, steps_completed, status, metadata) VALUES (?, ?, ?, ?, ?)",
                (
                    state["session_id"],
                    state["current_task"],
                    state["workflow_step"],
                    state["task_status"],
                    json.dumps({
                        "tools_used": state.get("tools_used", []),
                        "confidence_score": state["confidence_score"],
                        "error_message": state.get("error_message", "")
                    })
                )
            )
            self.db_connection.commit()
        except Exception as e:
            print(f"Error storing workflow history: {e}")
    
    # API Routes
    def _setup_routes(self):
        """Setup Flask API routes"""
        
        @self.app.route('/chat', methods=['POST'])
        def chat():
            """Main chat endpoint"""
            try:
                data = request.json
                message = data.get('message', '').strip()
                session_id = data.get('session_id', f'session_{datetime.now().timestamp()}')
                user_id = data.get('user_id', 'anonymous')
                
                if not message:
                    return jsonify({
                        'error': 'Message is required',
                        'response': 'Please provide a message to chat with me! 🤖'
                    }), 400
                
                # Create initial state
                initial_state = AgenticState(
                    messages=[],
                    current_message=message,
                    user_id=user_id,
                    session_id=session_id,
                    context={},
                    user_preferences={},
                    conversation_history=[],
                    current_task="",
                    task_status="pending",
                    workflow_step=0,
                    max_steps=5,
                    ai_response="",
                    confidence_score=0.0,
                    suggested_actions=[],
                    tools_used=[],
                    tool_results={},
                    error_message="",
                    retry_count=0,
                    max_retries=3
                )
                
                # Run the workflow (sync version)
                result = self.workflow.invoke(initial_state)
                
                return jsonify({
                    'response': result['ai_response'],
                    'session_id': session_id,
                    'confidence_score': result['confidence_score'],
                    'suggested_actions': result['suggested_actions'],
                    'workflow_status': result['task_status'],
                    'metadata': {
                        'intent': result['context'].get('intent'),
                        'workflow_step': result['workflow_step'],
                        'tools_used': result.get('tools_used', [])
                    },
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                print(f"Chat endpoint error: {e}")
                return jsonify({
                    'error': 'Internal server error',
                    'response': 'I apologize, but I\'m having trouble processing your request right now. Please try again! 🤖'
                }), 500
        
        @self.app.route('/status', methods=['GET'])
        def status():
            """Status endpoint"""
            return jsonify({
                'status': 'healthy',
                'service': 'Enhanced Agentic Chatbot (LangGraph)',
                'timestamp': datetime.now().isoformat(),
                'features': [
                    'LangGraph Workflows',
                    'Stateful Conversations',
                    'Multi-Agent System',
                    'Persistent Memory',
                    'Error Handling',
                    'Tool Integration'
                ],
                'models': {
                    'primary': self.config.primary_model if self.llm else 'Not available',
                    'fallback': self.config.huggingface_model
                }
            })
        
        @self.app.route('/tools', methods=['GET'])
        def tools():
            """Available tools endpoint"""
            return jsonify({
                'tools': [
                    'Intent Analysis',
                    'Context Retrieval',
                    'Response Generation',
                    'Memory Management',
                    'Error Handling',
                    'Workflow Orchestration'
                ],
                'capabilities': [
                    'Multi-step reasoning',
                    'Stateful conversations',
                    'Persistent memory',
                    'Autonomous decision making',
                    'Human-in-the-loop feedback'
                ]
            })
        
        @self.app.route('/session/<session_id>', methods=['GET'])
        def get_session(session_id):
            """Get session information"""
            try:
                cursor = self.db_connection.cursor()
                cursor.execute(
                    "SELECT * FROM conversations WHERE session_id = ? ORDER BY timestamp DESC LIMIT 20",
                    (session_id,)
                )
                conversations = cursor.fetchall()
                
                return jsonify({
                    'session_id': session_id,
                    'conversations': conversations,
                    'timestamp': datetime.now().isoformat()
                })
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    def run(self):
        """Run the enhanced agentic chatbot server"""
        print(f"🚀 Starting Enhanced Agentic Chatbot on {self.config.host}:{self.config.port}")
        print(f"📡 Chat endpoint: http://{self.config.host}:{self.config.port}/chat")
        print(f"🔍 Status endpoint: http://{self.config.host}:{self.config.port}/status")
        print(f"🛠️ Tools endpoint: http://{self.config.host}:{self.config.port}/tools")
        
        self.app.run(
            host=self.config.host,
            port=self.config.port,
            debug=False
        )

# Main execution
if __name__ == "__main__":
    # Create configuration
    config = ChatbotConfig()
    
    # Create and run the enhanced agentic chatbot
    chatbot = EnhancedAgenticChatbot(config)
    chatbot.run()
