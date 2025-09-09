#!/usr/bin/env python3
"""
Enhanced Agentic Chatbot Configuration
LangGraph-based autonomous AI assistant configuration
"""

import os
from dataclasses import dataclass
from typing import Dict, List, Any, Optional

@dataclass
class ModelConfig:
    """AI Model configuration"""
    # Primary models
    openai_model: str = "gpt-3.5-turbo"
    openai_api_key: Optional[str] = None
    
    # Hugging Face models
    huggingface_model: str = "microsoft/DialoGPT-medium"
    huggingface_api_key: Optional[str] = None
    
    # Model parameters
    temperature: float = 0.7
    max_tokens: int = 1000
    max_length: int = 200
    do_sample: bool = True

@dataclass
class WorkflowConfig:
    """LangGraph workflow configuration"""
    # Workflow settings
    max_iterations: int = 10
    timeout_seconds: int = 30
    enable_memory: bool = True
    enable_tools: bool = True
    enable_feedback_loops: bool = True
    
    # State management
    checkpoint_enabled: bool = True
    state_persistence: bool = True
    session_timeout: int = 3600  # 1 hour
    
    # Error handling
    max_retries: int = 3
    retry_delay: float = 1.0
    fallback_enabled: bool = True

@dataclass
class DatabaseConfig:
    """Database configuration"""
    # SQLite settings
    db_path: str = "agentic_chatbot.db"
    checkpoint_path: str = "agentic_checkpoints.db"
    
    # Connection settings
    connection_timeout: int = 30
    max_connections: int = 10
    
    # Table settings
    max_conversation_history: int = 1000
    cleanup_interval: int = 86400  # 24 hours

@dataclass
class APIConfig:
    """API configuration"""
    # Server settings
    host: str = "localhost"
    port: int = 5001
    debug: bool = False
    
    # CORS settings
    cors_origins: List[str] = None
    cors_methods: List[str] = None
    cors_headers: List[str] = None
    
    # Rate limiting
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # 1 hour
    
    def __post_init__(self):
        if self.cors_origins is None:
            self.cors_origins = ["*"]
        if self.cors_methods is None:
            self.cors_methods = ["GET", "POST", "PUT", "DELETE"]
        if self.cors_headers is None:
            self.cors_headers = ["Content-Type", "Authorization"]

@dataclass
class UIConfig:
    """User Interface configuration"""
    # Widget settings
    widget_enabled: bool = True
    widget_position: str = "bottom-right"
    widget_size: Dict[str, int] = None
    
    # Theme settings
    theme: str = "dark"
    primary_color: str = "#00ffee"
    secondary_color: str = "#00ccbb"
    background_color: str = "rgba(0, 0, 0, 0.95)"
    
    # Animation settings
    typing_speed: int = 50
    animation_duration: float = 0.3
    enable_sound: bool = False
    
    def __post_init__(self):
        if self.widget_size is None:
            self.widget_size = {"width": 350, "height": 500}

@dataclass
class ToolConfig:
    """Tool integration configuration"""
    # Available tools
    tools_enabled: List[str] = None
    
    # Tool settings
    tool_timeout: int = 30
    tool_retries: int = 2
    tool_cache_enabled: bool = True
    
    # External APIs
    external_apis: Dict[str, Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.tools_enabled is None:
            self.tools_enabled = [
                "intent_analysis",
                "context_retrieval",
                "response_generation",
                "memory_management",
                "error_handling",
                "workflow_orchestration"
            ]
        
        if self.external_apis is None:
            self.external_apis = {
                "openai": {
                    "base_url": "https://api.openai.com/v1",
                    "timeout": 30
                },
                "huggingface": {
                    "base_url": "https://api-inference.huggingface.co",
                    "timeout": 30
                }
            }

@dataclass
class SecurityConfig:
    """Security configuration"""
    # Authentication
    auth_enabled: bool = False
    auth_token: Optional[str] = None
    
    # Input validation
    input_validation: bool = True
    max_input_length: int = 1000
    allowed_characters: str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?@#$%^&*()_+-=[]{}|;':\",./<>?`~"
    
    # Rate limiting
    rate_limit_enabled: bool = True
    max_requests_per_minute: int = 60
    max_requests_per_hour: int = 1000
    
    # Content filtering
    content_filter_enabled: bool = True
    blocked_keywords: List[str] = None
    
    def __post_init__(self):
        if self.blocked_keywords is None:
            self.blocked_keywords = [
                "spam", "scam", "phishing", "malware",
                "hack", "exploit", "vulnerability"
            ]

class EnhancedAgenticConfig:
    """Main configuration class for Enhanced Agentic Chatbot"""
    
    def __init__(self):
        # Load from environment variables
        self._load_from_env()
        
        # Initialize configuration sections
        self.model = ModelConfig()
        self.workflow = WorkflowConfig()
        self.database = DatabaseConfig()
        self.api = APIConfig()
        self.ui = UIConfig()
        self.tools = ToolConfig()
        self.security = SecurityConfig()
        
        # Apply environment overrides
        self._apply_env_overrides()
    
    def _load_from_env(self):
        """Load configuration from environment variables"""
        self.env_config = {
            # Model settings
            "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
            "HUGGINGFACE_API_KEY": os.getenv("HUGGINGFACE_API_KEY"),
            "OPENAI_MODEL": os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
            "HUGGINGFACE_MODEL": os.getenv("HUGGINGFACE_MODEL", "microsoft/DialoGPT-medium"),
            
            # Server settings
            "HOST": os.getenv("HOST", "localhost"),
            "PORT": int(os.getenv("PORT", "5001")),
            "DEBUG": os.getenv("DEBUG", "False").lower() == "true",
            
            # Database settings
            "DB_PATH": os.getenv("DB_PATH", "agentic_chatbot.db"),
            "CHECKPOINT_PATH": os.getenv("CHECKPOINT_PATH", "agentic_checkpoints.db"),
            
            # Security settings
            "AUTH_TOKEN": os.getenv("AUTH_TOKEN"),
            "RATE_LIMIT_ENABLED": os.getenv("RATE_LIMIT_ENABLED", "True").lower() == "true",
        }
    
    def _apply_env_overrides(self):
        """Apply environment variable overrides to configuration"""
        # Model overrides
        if self.env_config["OPENAI_API_KEY"]:
            self.model.openai_api_key = self.env_config["OPENAI_API_KEY"]
        if self.env_config["HUGGINGFACE_API_KEY"]:
            self.model.huggingface_api_key = self.env_config["HUGGINGFACE_API_KEY"]
        if self.env_config["OPENAI_MODEL"]:
            self.model.openai_model = self.env_config["OPENAI_MODEL"]
        if self.env_config["HUGGINGFACE_MODEL"]:
            self.model.huggingface_model = self.env_config["HUGGINGFACE_MODEL"]
        
        # API overrides
        self.api.host = self.env_config["HOST"]
        self.api.port = self.env_config["PORT"]
        self.api.debug = self.env_config["DEBUG"]
        
        # Database overrides
        self.database.db_path = self.env_config["DB_PATH"]
        self.database.checkpoint_path = self.env_config["CHECKPOINT_PATH"]
        
        # Security overrides
        if self.env_config["AUTH_TOKEN"]:
            self.security.auth_token = self.env_config["AUTH_TOKEN"]
            self.security.auth_enabled = True
        self.security.rate_limit_enabled = self.env_config["RATE_LIMIT_ENABLED"]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary"""
        return {
            "model": {
                "openai_model": self.model.openai_model,
                "huggingface_model": self.model.huggingface_model,
                "temperature": self.model.temperature,
                "max_tokens": self.model.max_tokens,
                "max_length": self.model.max_length,
                "do_sample": self.model.do_sample
            },
            "workflow": {
                "max_iterations": self.workflow.max_iterations,
                "timeout_seconds": self.workflow.timeout_seconds,
                "enable_memory": self.workflow.enable_memory,
                "enable_tools": self.workflow.enable_tools,
                "enable_feedback_loops": self.workflow.enable_feedback_loops,
                "checkpoint_enabled": self.workflow.checkpoint_enabled,
                "state_persistence": self.workflow.state_persistence,
                "session_timeout": self.workflow.session_timeout,
                "max_retries": self.workflow.max_retries,
                "retry_delay": self.workflow.retry_delay,
                "fallback_enabled": self.workflow.fallback_enabled
            },
            "database": {
                "db_path": self.database.db_path,
                "checkpoint_path": self.database.checkpoint_path,
                "connection_timeout": self.database.connection_timeout,
                "max_connections": self.database.max_connections,
                "max_conversation_history": self.database.max_conversation_history,
                "cleanup_interval": self.database.cleanup_interval
            },
            "api": {
                "host": self.api.host,
                "port": self.api.port,
                "debug": self.api.debug,
                "cors_origins": self.api.cors_origins,
                "cors_methods": self.api.cors_methods,
                "cors_headers": self.api.cors_headers,
                "rate_limit_enabled": self.api.rate_limit_enabled,
                "rate_limit_requests": self.api.rate_limit_requests,
                "rate_limit_window": self.api.rate_limit_window
            },
            "ui": {
                "widget_enabled": self.ui.widget_enabled,
                "widget_position": self.ui.widget_position,
                "widget_size": self.ui.widget_size,
                "theme": self.ui.theme,
                "primary_color": self.ui.primary_color,
                "secondary_color": self.ui.secondary_color,
                "background_color": self.ui.background_color,
                "typing_speed": self.ui.typing_speed,
                "animation_duration": self.ui.animation_duration,
                "enable_sound": self.ui.enable_sound
            },
            "tools": {
                "tools_enabled": self.tools.tools_enabled,
                "tool_timeout": self.tools.tool_timeout,
                "tool_retries": self.tools.tool_retries,
                "tool_cache_enabled": self.tools.tool_cache_enabled,
                "external_apis": self.tools.external_apis
            },
            "security": {
                "auth_enabled": self.security.auth_enabled,
                "input_validation": self.security.input_validation,
                "max_input_length": self.security.max_input_length,
                "allowed_characters": self.security.allowed_characters,
                "rate_limit_enabled": self.security.rate_limit_enabled,
                "max_requests_per_minute": self.security.max_requests_per_minute,
                "max_requests_per_hour": self.security.max_requests_per_hour,
                "content_filter_enabled": self.security.content_filter_enabled,
                "blocked_keywords": self.security.blocked_keywords
            }
        }
    
    def validate(self) -> bool:
        """Validate configuration"""
        try:
            # Validate model configuration
            if not self.model.openai_api_key and not self.model.huggingface_api_key:
                print("⚠️ Warning: No API keys configured. Using fallback mode.")
            
            # Validate database paths
            if not os.path.exists(os.path.dirname(self.database.db_path)):
                os.makedirs(os.path.dirname(self.database.db_path), exist_ok=True)
            
            if not os.path.exists(os.path.dirname(self.database.checkpoint_path)):
                os.makedirs(os.path.dirname(self.database.checkpoint_path), exist_ok=True)
            
            # Validate API configuration
            if self.api.port < 1 or self.api.port > 65535:
                raise ValueError("Invalid port number")
            
            # Validate workflow configuration
            if self.workflow.max_iterations < 1:
                raise ValueError("Max iterations must be at least 1")
            
            if self.workflow.timeout_seconds < 1:
                raise ValueError("Timeout must be at least 1 second")
            
            print("✅ Configuration validation passed")
            return True
            
        except Exception as e:
            print(f"❌ Configuration validation failed: {e}")
            return False
    
    def save_to_file(self, filepath: str):
        """Save configuration to file"""
        import json
        with open(filepath, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)
        print(f"✅ Configuration saved to {filepath}")
    
    def load_from_file(self, filepath: str):
        """Load configuration from file"""
        import json
        try:
            with open(filepath, 'r') as f:
                config_data = json.load(f)
            
            # Apply loaded configuration
            if "model" in config_data:
                for key, value in config_data["model"].items():
                    setattr(self.model, key, value)
            
            if "workflow" in config_data:
                for key, value in config_data["workflow"].items():
                    setattr(self.workflow, key, value)
            
            if "database" in config_data:
                for key, value in config_data["database"].items():
                    setattr(self.database, key, value)
            
            if "api" in config_data:
                for key, value in config_data["api"].items():
                    setattr(self.api, key, value)
            
            if "ui" in config_data:
                for key, value in config_data["ui"].items():
                    setattr(self.ui, key, value)
            
            if "tools" in config_data:
                for key, value in config_data["tools"].items():
                    setattr(self.tools, key, value)
            
            if "security" in config_data:
                for key, value in config_data["security"].items():
                    setattr(self.security, key, value)
            
            print(f"✅ Configuration loaded from {filepath}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to load configuration from {filepath}: {e}")
            return False

# Default configuration instance
DEFAULT_CONFIG = EnhancedAgenticConfig()

# Export for use in other modules
__all__ = [
    'ModelConfig',
    'WorkflowConfig', 
    'DatabaseConfig',
    'APIConfig',
    'UIConfig',
    'ToolConfig',
    'SecurityConfig',
    'EnhancedAgenticConfig',
    'DEFAULT_CONFIG'
]
