# 🚀 Chatbot Beta - Project Structure

## 📁 **Root Directory Structure**

```
chatbot_beta/
├── 🐍 Python Files
│   ├── tester_dashboard.py          # Main Flask Application
│   ├── requirements.txt             # Python Dependencies
│   └── .env                        # Environment Variables
│
├── 🎨 Assets
│   ├── images/                      # Static Images
│   ├── gifs/                        # Animated GIFs
│   ├── css/                         # Stylesheets
│   └── js/                          # JavaScript Files
│
├── 🔧 Backend
│   ├── templates/                   # HTML Templates
│   ├── static/                      # Static Files
│   └── modules/                     # Python Modules
│
├── 🎯 Frontend
│   ├── html/                        # HTML Files
│   ├── components/                   # React Components
│   └── dashboard/                    # Dashboard Files
│
├── ⚙️ Configs
│   ├── yaml/                        # YAML Configuration Files
│   ├── json/                         # JSON Configuration Files
│   └── templates/                    # Configuration Templates
│
├── 🧠 Core
│   ├── ai/                          # AI Logic
│   ├── chatbot/                     # Chatbot Engine
│   └── nlp/                         # Natural Language Processing
│
├── 📚 Utils
│   ├── helpers/                      # Helper Functions
│   ├── validators/                   # Data Validation
│   └── converters/                   # Data Converters
│
├── 📖 Docs
│   ├── api/                         # API Documentation
│   ├── guides/                       # User Guides
│   └── examples/                     # Code Examples
│
├── 🧪 Tests
│   ├── unit/                         # Unit Tests
│   ├── integration/                  # Integration Tests
│   └── fixtures/                     # Test Data
│
└── 📜 Scripts
    ├── setup.sh                      # Setup Script
    ├── deploy.sh                     # Deployment Script
    └── backup.sh                     # Backup Script
```

## 🎯 **Key Components**

### **1. Main Application (`tester_dashboard.py`)**
- **Purpose**: Flask web server for chatbot testing dashboard
- **Features**: YAML config management, AI integration, file uploads
- **Port**: 5001 (configurable)

### **2. Configuration Management**
- **YAML Files**: Bot responses, use cases, user fields
- **Environment**: API keys, database settings
- **Templates**: Pre-built configuration templates

### **3. AI Integration**
- **Gemini API**: Google's AI model integration
- **OpenAI API**: Alternative AI provider
- **Custom Logic**: Use case extraction, action recognition

### **4. Frontend Dashboard**
- **VS Code Style**: Professional code editor interface
- **Real-time Updates**: Live configuration editing
- **File Management**: Upload, download, backup, restore

## 🚀 **Quick Start**

### **Installation**
```bash
cd chatbot_beta
pip install -r requirements.txt
```

### **Configuration**
```bash
cp .env.template .env
# Edit .env with your API keys
```

### **Run Application**
```bash
python tester_dashboard.py
```

### **Access Dashboard**
- **URL**: http://localhost:5001
- **Features**: Full chatbot testing and configuration

## 🔧 **Development Workflow**

1. **Edit Configs**: Modify YAML files in `configs/`
2. **Test Changes**: Use dashboard to test bot responses
3. **AI Integration**: Test with real AI models
4. **Deploy**: Use scripts in `scripts/` folder

## 📊 **File Organization**

- **Backend Logic**: Python files in root and `backend/`
- **Frontend Assets**: HTML, CSS, JS in `frontend/`
- **Configuration**: YAML files in `configs/`
- **Documentation**: Markdown files in `docs/`
- **Utilities**: Helper scripts in `utils/`

## 🎨 **Customization**

- **Themes**: Modify CSS in `assets/css/`
- **Templates**: Edit HTML in `frontend/`
- **Logic**: Update Python files in root and `backend/`
- **Configs**: Modify YAML files in `configs/`

---

**Project**: Chatbot Beta v1.0  
**Created**: August 20, 2025  
**Status**: Active Development  
**Maintainer**: Ayush Shrivastava

