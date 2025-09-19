# 📊 Visitor Tracking System Guide

## 🎯 Overview

This guide explains how to use the comprehensive visitor tracking system implemented in your Ayush Portal. The system tracks website visitors, their behavior, and provides detailed analytics.

## 🚀 Features

### ✅ **What's Tracked:**
- **Unique Visitors**: IP-based visitor identification
- **Page Views**: Which pages visitors access
- **Session Duration**: How long visitors stay
- **User Agents**: Browser and device information
- **Referrers**: Where visitors come from
- **Interactions**: Clicks, scrolls, and user engagement
- **Chat Usage**: AI Assistant interactions
- **Project Clicks**: Which projects visitors explore

### 📈 **Analytics Provided:**
- Real-time visitor statistics
- Daily, weekly, monthly visit counts
- Top pages and popular content
- Browser and device statistics
- Traffic source analysis
- Session duration metrics
- Recent visitor activity

## 🛠️ **How to Use**

### **1. View Analytics Dashboard**
Open your browser and go to:
```
http://localhost:4000/visitor-dashboard.html
```

This provides a beautiful, real-time dashboard with:
- 📊 Summary statistics
- 👥 Recent visitors list
- 📄 Top pages
- 🌐 Browser statistics
- 🔗 Traffic sources

### **2. Command Line Analytics**
Run the analytics script from your terminal:
```bash
cd ayush_portal
node scripts/view-analytics.js
```

This gives you a detailed text-based report with:
- Visitor statistics
- Recent visitor details
- Top pages
- Browser breakdown
- Session metrics

### **3. API Endpoint**
Access raw analytics data via API:
```bash
curl http://localhost:8000/api/analytics
```

Returns JSON data with all visitor information.

## 📁 **File Structure**

```
ayush_portal/
├── server/
│   └── unified-server.js          # Enhanced with visitor tracking
├── assets/js/
│   └── visitor-tracker.js         # Client-side tracking
├── logs/
│   └── visitors.json              # Visitor data storage
├── scripts/
│   └── view-analytics.js          # CLI analytics tool
├── visitor-dashboard.html         # Web dashboard
└── VISITOR_TRACKING_GUIDE.md      # This guide
```

## 🔧 **Configuration**

### **Server Configuration**
Edit `server/unified-server.js` to modify tracking behavior:

```javascript
const VISITOR_CONFIG = {
    logFile: path.join(__dirname, '..', 'logs', 'visitors.json'),
    maxVisitors: 1000,                    // Maximum visitors to store
    sessionTimeout: 30 * 60 * 1000,       // 30 minutes
    trackUserAgent: true,                 // Track browser info
    trackReferer: true,                   // Track traffic sources
    trackIP: true,                        // Track IP addresses
    trackPages: true                      // Track page views
};
```

### **Client Configuration**
The visitor tracker automatically initializes when your website loads. You can customize tracking by modifying `assets/js/visitor-tracker.js`.

## 📊 **Data Storage**

### **Visitor Data Format**
```json
{
  "visitors": {
    "visitor_id": {
      "id": "abc123",
      "ip": "192.168.1.1",
      "firstVisit": "2025-01-13T10:00:00.000Z",
      "lastVisit": "2025-01-13T12:00:00.000Z",
      "totalVisits": 5,
      "pages": ["/", "/projects", "/skills"],
      "userAgent": "Mozilla/5.0...",
      "referer": "https://google.com",
      "sessions": [...]
    }
  },
  "stats": {
    "total": 150,
    "unique": 45,
    "today": 12,
    "thisWeek": 35,
    "thisMonth": 120
  }
}
```

## 🎨 **Customization**

### **Add Custom Tracking**
```javascript
// Track custom events
window.visitorTracker.trackEvent('button_click', {
    button: 'contact',
    location: 'header'
});

// Track project interactions
window.visitorTracker.trackProjectClick('FinBot AI');

// Track skill interactions
window.visitorTracker.trackSkillClick('Machine Learning');
```

### **Modify Dashboard**
Edit `visitor-dashboard.html` to:
- Change colors and styling
- Add new metrics
- Customize layout
- Add charts and graphs

## 🔒 **Privacy & Security**

### **Data Protection**
- IP addresses are hashed for privacy
- User agents are anonymized
- No personal information is stored
- Data is stored locally on your server

### **GDPR Compliance**
- No cookies are used
- No personal data collection
- Visitors can opt-out by disabling JavaScript
- Data retention is configurable

## 🚨 **Troubleshooting**

### **Common Issues**

**1. No visitor data appearing**
- Check if server is running
- Verify logs directory exists
- Check browser console for errors

**2. Dashboard not loading**
- Ensure server is running on port 8000
- Check CORS settings
- Verify API endpoint accessibility

**3. Analytics script not working**
- Check Node.js installation
- Verify file permissions
- Ensure logs directory exists

### **Debug Commands**
```bash
# Check server status
curl http://localhost:8000/health

# Check analytics endpoint
curl http://localhost:8000/api/analytics

# View raw visitor data
cat logs/visitors.json | jq
```

## 📈 **Performance**

### **Optimization Tips**
- Data is saved every 10 visitors
- Expired sessions are cleaned every 5 minutes
- Memory usage is optimized for 1000 visitors
- Database operations are asynchronous

### **Monitoring**
- Check server logs for tracking errors
- Monitor disk space for visitor data
- Watch memory usage with large visitor counts

## 🔄 **Maintenance**

### **Regular Tasks**
1. **Check analytics daily** - Review visitor trends
2. **Clean old data** - Remove expired sessions
3. **Backup data** - Save visitor logs periodically
4. **Update tracking** - Add new events as needed

### **Data Backup**
```bash
# Backup visitor data
cp logs/visitors.json logs/visitors-backup-$(date +%Y%m%d).json

# Restore from backup
cp logs/visitors-backup-20250113.json logs/visitors.json
```

## 🎯 **Use Cases**

### **For Website Owners**
- Understand visitor behavior
- Track popular content
- Monitor traffic sources
- Measure engagement

### **For Developers**
- Debug user interactions
- Optimize page performance
- Test new features
- Monitor errors

### **For Marketers**
- Track campaign effectiveness
- Measure conversion rates
- Analyze user journeys
- Identify popular content

## 🚀 **Advanced Features**

### **Real-time Updates**
- Dashboard refreshes every 30 seconds
- Live visitor notifications
- Real-time session tracking

### **Export Data**
```javascript
// Export visitor data
const data = await fetch('http://localhost:8000/api/analytics');
const analytics = await data.json();
console.log(analytics);
```

### **Integration**
- Works with existing analytics tools
- Compatible with Google Analytics
- Supports custom tracking events

## 📞 **Support**

If you encounter any issues:
1. Check this guide first
2. Review server logs
3. Test with curl commands
4. Verify file permissions
5. Check browser console

## 🎉 **Conclusion**

Your visitor tracking system is now fully operational! You can:
- ✅ Track all website visitors
- ✅ View real-time analytics
- ✅ Monitor user behavior
- ✅ Export data for analysis
- ✅ Customize tracking events

**Happy tracking!** 📊✨
