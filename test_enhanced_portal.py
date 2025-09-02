#!/usr/bin/env python3
"""
Test script for Enhanced AI Portal
Tests the new API endpoints and portal functionality
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:6000"  # New port for enhanced AI portal
ENHANCED_PORTAL_URL = f"{BASE_URL}/enhanced"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: {data['status']}")
            print(f"   Version: {data['version']}")
            print(f"   Port: {data['port']}")
            print(f"   Services: {list(data['services'].keys())}")
            return True
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        return False

def test_profile_api():
    """Test the profile API endpoint"""
    print("\n🔍 Testing Profile API...")
    try:
        response = requests.get(f"{BASE_URL}/api/profile")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Profile API: Success")
            print(f"   Name: {data['name']}")
            print(f"   Title: {data['title']}")
            print(f"   Skills: {list(data['skills'].keys())}")
            return True
        else:
            print(f"❌ Profile API Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Profile API Error: {e}")
        return False

def test_dashboards_api():
    """Test the dashboards API endpoint"""
    print("\n🔍 Testing Dashboards API...")
    try:
        response = requests.get(f"{BASE_URL}/api/dashboards")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Dashboards API: Success")
            print(f"   Available Dashboards: {list(data.keys())}")
            for key, dashboard in data.items():
                print(f"     - {dashboard['name']}: {dashboard['status']}")
            return True
        else:
            print(f"❌ Dashboards API Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Dashboards API Error: {e}")
        return False

def test_themes_api():
    """Test the themes API endpoint"""
    print("\n🔍 Testing Themes API...")
    try:
        response = requests.get(f"{BASE_URL}/api/themes")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Themes API: Success")
            print(f"   Available Themes: {list(data.keys())}")
            for key, theme in data.items():
                print(f"     - {theme['name']}: {theme['description']}")
            return True
        else:
            print(f"❌ Themes API Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Themes API Error: {e}")
        return False

def test_enhanced_portal_page():
    """Test the enhanced portal page"""
    print("\n🔍 Testing Enhanced Portal Page...")
    try:
        response = requests.get(ENHANCED_PORTAL_URL)
        if response.status_code == 200:
            print(f"✅ Enhanced Portal Page: Success")
            print(f"   Content Length: {len(response.text)} characters")
            if "AI Portal - Enhanced Personal Workspace" in response.text:
                print("   ✅ Correct title found")
            if "theme-space" in response.text:
                print("   ✅ Theme system found")
            if "section-card" in response.text:
                print("   ✅ Section cards found")
            return True
        else:
            print(f"❌ Enhanced Portal Page Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Enhanced Portal Page Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Enhanced AI Portal - Test Suite")
    print("=" * 50)
    print(f"🌐 Testing portal at: {BASE_URL}")
    print(f"📱 Enhanced portal at: {ENHANCED_PORTAL_URL}")
    print("=" * 50)
    
    tests = [
        test_health_check,
        test_profile_api,
        test_dashboards_api,
        test_themes_api,
        test_enhanced_portal_page
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        time.sleep(0.5)  # Small delay between tests
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Enhanced Portal is working correctly.")
        print(f"\n🌐 Access your Enhanced Portal at: {ENHANCED_PORTAL_URL}")
        print(f"🔧 API Health Check: {BASE_URL}/api/health")
    else:
        print("⚠️  Some tests failed. Check the server and try again.")
        print(f"💡 Make sure the server is running on port 6000")
    
    return passed == total

if __name__ == "__main__":
    main()
