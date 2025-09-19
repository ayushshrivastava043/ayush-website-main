# Portal Setup Guide

## 🎯 Two Independent Portals

### 📁 Ayush Portal (Enhanced Version)
- **Location**: `/Users/ayush/AI_Projects/Website/ayush_portal/`
- **Ports**: 
  - Main Website: `http://localhost:4000`
  - AI Assistant: `http://localhost:8000`
- **Features**:
  - ✅ Enhanced chatbot with mouth-synced speech bubbles
  - ✅ Interactive dashboard with transparent backgrounds
  - ✅ Fixed spacing (180px margin-top)
  - ✅ Modern UI/UX improvements
  - ✅ White borders on chat bubbles
  - ✅ Avatar mouth synchronization
- **Launch**: `cd ayush_portal && ./start-website-server.sh`

### 📁 Priya Portal (Original Version)
- **Location**: `/Users/ayush/AI_Projects/Website/priya_portal/`
- **Ports**: 
  - Main Website: `http://localhost:4001`
  - AI Assistant: `http://localhost:8001`
- **Features**:
  - ✅ Original website layout
  - ✅ Original chatbot system
  - ✅ Original dashboard design
  - ✅ Backup/reference version
- **Launch**: `cd priya_portal && ./start-website-server.sh`

## 🚀 Quick Start

### Start Ayush Portal (Enhanced):
```bash
cd /Users/ayush/AI_Projects/Website/ayush_portal
./start-website-server.sh
```
Access at: `http://localhost:4000`

### Start Priya Portal (Original):
```bash
cd /Users/ayush/AI_Projects/Website/priya_portal
./start-website-server.sh
```
Access at: `http://localhost:4001`

## 📊 Server Status

Both portals can run simultaneously:
- **Ayush Portal**: Ports 4000 & 8000
- **Priya Portal**: Ports 4001 & 8001

## 🔧 Technical Details

### File Structure:
```
/Users/ayush/AI_Projects/Website/
├── ayush_portal/          # Enhanced version
│   ├── index.html         # Modern layout with dashboard
│   ├── assets/js/enhanced-chatbot-widget-fixed.js
│   ├── server/unified-server.js (ports 4000, 8000)
│   └── start-website-server.sh
├── priya_portal/          # Original version
│   ├── index.html         # Original layout
│   ├── assets/js/         # Original chatbot
│   ├── server/unified-server.js (ports 4001, 8001)
│   └── start-website-server.sh
```

### Key Differences:
- **Ports**: Different ports to avoid conflicts
- **Chatbot**: Enhanced vs Original system
- **Dashboard**: Interactive vs Static
- **Spacing**: Fixed vs Original layout

## 🎨 Development Notes

- Both portals are completely independent
- Can be developed separately
- No file conflicts between portals
- Each has its own server configuration
