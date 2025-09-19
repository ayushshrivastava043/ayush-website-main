/**
 * Simple Visitor Tracker for Ayush Portal
 * Tracks page views, session duration, and user interactions
 */

class VisitorTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.pageViews = 0;
        this.interactions = 0;
        this.isActive = true;
        
        // Track page view
        this.trackPageView();
        
        // Track user interactions
        this.trackInteractions();
        
        // Track session duration
        this.trackSessionDuration();
        
        // Track page visibility
        this.trackPageVisibility();
        
        console.log('📊 Visitor tracker initialized');
    }

    // Generate unique session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Track page view
    trackPageView() {
        this.pageViews++;
        const pageData = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        // Send to server (optional)
        this.sendToServer('/api/track-page', pageData);
        
        console.log('📄 Page view tracked:', pageData);
    }

    // Track user interactions
    trackInteractions() {
        const events = ['click', 'scroll', 'keypress', 'mousemove'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.interactions++;
                
                // Throttle interaction tracking
                if (this.interactions % 10 === 0) {
                    this.sendToServer('/api/track-interaction', {
                        sessionId: this.sessionId,
                        interactions: this.interactions,
                        timestamp: new Date().toISOString()
                    });
                }
            }, { passive: true });
        });
    }

    // Track session duration
    trackSessionDuration() {
        setInterval(() => {
            const duration = Date.now() - this.startTime;
            
            // Send duration update every 30 seconds
            if (duration % 30000 < 1000) {
                this.sendToServer('/api/track-duration', {
                    sessionId: this.sessionId,
                    duration: duration,
                    pageViews: this.pageViews,
                    interactions: this.interactions,
                    timestamp: new Date().toISOString()
                });
            }
        }, 1000);
    }

    // Track page visibility
    trackPageVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                console.log('📊 User left page');
            } else {
                this.isActive = true;
                console.log('📊 User returned to page');
            }
        });
    }

    // Send data to server (DISABLED - No tracking server running)
    async sendToServer(endpoint, data) {
        // Tracking disabled - no server running on port 8000
        // console.log('📊 Tracking data (not sent):', { endpoint, data });
        return; // Skip tracking for now
        
        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                console.warn('⚠️ Failed to send tracking data:', response.status);
            }
        } catch (error) {
            console.warn('⚠️ Tracking data not sent:', error.message);
        }
    }

    // Get current session data
    getSessionData() {
        return {
            sessionId: this.sessionId,
            duration: Date.now() - this.startTime,
            pageViews: this.pageViews,
            interactions: this.interactions,
            isActive: this.isActive
        };
    }

    // Track custom event
    trackEvent(eventName, data = {}) {
        const eventData = {
            sessionId: this.sessionId,
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        this.sendToServer('/api/track-event', eventData);
        console.log('📊 Custom event tracked:', eventData);
    }

    // Track chat interaction
    trackChatInteraction(message, response) {
        this.trackEvent('chat_interaction', {
            message: message,
            response: response,
            messageLength: message.length
        });
    }

    // Track project click
    trackProjectClick(projectName) {
        this.trackEvent('project_click', {
            project: projectName
        });
    }

    // Track skill click
    trackSkillClick(skillName) {
        this.trackEvent('skill_click', {
            skill: skillName
        });
    }
}

// Initialize visitor tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global tracker instance
    window.visitorTracker = new VisitorTracker();
    
    // Add tracking to existing elements
    addTrackingToElements();
});

// Add tracking to existing elements
function addTrackingToElements() {
    // Track project clicks
    const projectButtons = document.querySelectorAll('[data-project]');
    projectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectName = button.getAttribute('data-project');
            window.visitorTracker.trackProjectClick(projectName);
        });
    });

    // Track skill clicks
    const skillButtons = document.querySelectorAll('[data-skill]');
    skillButtons.forEach(button => {
        button.addEventListener('click', () => {
            const skillName = button.getAttribute('data-skill');
            window.visitorTracker.trackSkillClick(skillName);
        });
    });

    // Track navigation clicks
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.getAttribute('href');
            window.visitorTracker.trackEvent('navigation_click', {
                section: section
            });
        });
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorTracker;
}
