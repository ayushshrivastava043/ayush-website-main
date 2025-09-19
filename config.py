# Configuration for AI Portal
# Port Strategy: 3030 (Frontend), 3040 (Backend) - Chrome Safe!

class Config:
    """Base configuration class"""
    HOST = '0.0.0.0'
    PORT = 3030  # Frontend - Chrome Safe!
    DEBUG = True
    SECRET_KEY = 'your-secret-key-here'
    
    # Database configuration
    DATABASE_URI = 'sqlite:///ai_portal.db'
    
    # API configuration
    API_VERSION = 'v1'
    API_PREFIX = '/api'
    
    # Theme configuration
    DEFAULT_THEME = 'space'
    AVAILABLE_THEMES = ['space', 'ocean', 'forest', 'sky']
    
    # Port allocation
    FRONTEND_PORT = 3030  # Main portal - Chrome Safe!
    BACKEND_PORT = 3040   # Future backend services - Chrome Safe!
    
    # Security
    CORS_ORIGINS = ['http://localhost:3030', 'http://127.0.0.1:3030']
    
    # Logging
    LOG_LEVEL = 'INFO'
    LOG_FILE = 'ai_portal.log'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = 'WARNING'
    SECRET_KEY = 'production-secret-key-change-this'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    DATABASE_URI = 'sqlite:///test_ai_portal.db'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}






