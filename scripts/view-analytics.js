#!/usr/bin/env node

/**
 * Command-line tool to view visitor analytics
 * Usage: node scripts/view-analytics.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

function loadVisitorData() {
    const logFile = path.join(__dirname, '..', 'logs', 'visitors.json');
    
    if (!fs.existsSync(logFile)) {
        console.log(colorize('❌ No visitor data found. Make sure the server is running and has received some visitors.', 'red'));
        return null;
    }
    
    try {
        const data = fs.readFileSync(logFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(colorize('❌ Error reading visitor data:', 'red'), error.message);
        return null;
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

function displayAnalytics() {
    const data = loadVisitorData();
    if (!data) return;
    
    const visitors = data.visitors || {};
    const stats = data.stats || {};
    
    console.log(colorize('\n📊 VISITOR ANALYTICS DASHBOARD', 'cyan'));
    console.log(colorize('================================', 'cyan'));
    
    // Summary Statistics
    console.log(colorize('\n📈 SUMMARY STATISTICS', 'yellow'));
    console.log(colorize('----------------------', 'yellow'));
    console.log(`Total Unique Visitors: ${colorize(Object.keys(visitors).length, 'green')}`);
    console.log(`Total Visits: ${colorize(stats.total || 0, 'green')}`);
    console.log(`Today's Visits: ${colorize(stats.today || 0, 'green')}`);
    console.log(`This Week: ${colorize(stats.thisWeek || 0, 'green')}`);
    console.log(`This Month: ${colorize(stats.thisMonth || 0, 'green')}`);
    
    // Recent Visitors
    console.log(colorize('\n👥 RECENT VISITORS', 'yellow'));
    console.log(colorize('------------------', 'yellow'));
    
    const recentVisitors = Object.values(visitors)
        .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
        .slice(0, 10);
    
    if (recentVisitors.length === 0) {
        console.log(colorize('No visitors yet', 'red'));
    } else {
        recentVisitors.forEach((visitor, index) => {
            console.log(`${index + 1}. IP: ${colorize(visitor.ip, 'blue')}`);
            console.log(`   First Visit: ${formatDate(visitor.firstVisit)}`);
            console.log(`   Last Visit: ${formatDate(visitor.lastVisit)}`);
            console.log(`   Total Visits: ${colorize(visitor.totalVisits, 'green')}`);
            console.log(`   Pages Visited: ${colorize(visitor.pages.length, 'green')}`);
            console.log(`   User Agent: ${visitor.userAgent.split(' ')[0]}`);
            console.log('');
        });
    }
    
    // Top Pages
    console.log(colorize('\n📄 TOP PAGES', 'yellow'));
    console.log(colorize('------------', 'yellow'));
    
    const pageStats = {};
    Object.values(visitors).forEach(visitor => {
        visitor.pages.forEach(page => {
            pageStats[page] = (pageStats[page] || 0) + 1;
        });
    });
    
    const topPages = Object.entries(pageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    if (topPages.length === 0) {
        console.log(colorize('No page data yet', 'red'));
    } else {
        topPages.forEach(([page, count], index) => {
            console.log(`${index + 1}. ${colorize(page, 'blue')} - ${colorize(count, 'green')} visits`);
        });
    }
    
    // Browser Statistics
    console.log(colorize('\n🌐 BROWSER STATISTICS', 'yellow'));
    console.log(colorize('---------------------', 'yellow'));
    
    const browserStats = {};
    Object.values(visitors).forEach(visitor => {
        const userAgent = visitor.userAgent.toLowerCase();
        let browser = 'Other';
        
        if (userAgent.includes('chrome')) browser = 'Chrome';
        else if (userAgent.includes('firefox')) browser = 'Firefox';
        else if (userAgent.includes('safari')) browser = 'Safari';
        else if (userAgent.includes('edge')) browser = 'Edge';
        else if (userAgent.includes('opera')) browser = 'Opera';
        
        browserStats[browser] = (browserStats[browser] || 0) + 1;
    });
    
    const topBrowsers = Object.entries(browserStats)
        .sort(([,a], [,b]) => b - a);
    
    if (topBrowsers.length === 0) {
        console.log(colorize('No browser data yet', 'red'));
    } else {
        topBrowsers.forEach(([browser, count], index) => {
            console.log(`${index + 1}. ${colorize(browser, 'blue')} - ${colorize(count, 'green')} users`);
        });
    }
    
    // Session Statistics
    console.log(colorize('\n⏱️  SESSION STATISTICS', 'yellow'));
    console.log(colorize('----------------------', 'yellow'));
    
    let totalSessions = 0;
    let totalDuration = 0;
    
    Object.values(visitors).forEach(visitor => {
        totalSessions += visitor.sessions.length;
        visitor.sessions.forEach(session => {
            totalDuration += session.duration || 0;
        });
    });
    
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    
    console.log(`Total Sessions: ${colorize(totalSessions, 'green')}`);
    console.log(`Average Session Duration: ${colorize(formatDuration(avgDuration), 'green')}`);
    
    // Data freshness
    console.log(colorize('\n📅 DATA INFO', 'yellow'));
    console.log(colorize('------------', 'yellow'));
    console.log(`Last Updated: ${formatDate(data.lastUpdated)}`);
    console.log(`Data File: ${colorize(data.logFile || 'logs/visitors.json', 'blue')}`);
    
    console.log(colorize('\n✨ Analytics complete!', 'green'));
}

// Main execution
if (require.main === module) {
    displayAnalytics();
}

module.exports = { displayAnalytics, loadVisitorData };
