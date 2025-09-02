from flask import Flask, render_template_string, jsonify, send_from_directory
import os

app = Flask(__name__)

# Serve static files from assets folder
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

@app.route('/')
def main_portal():
    return '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Portal - Your Personal Work Hub</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- AOS Animations -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- ScrollReveal -->
    <script src="https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js"></script>
    
    <style>
        :root {
            --primary-bg: #0a0a0a;
            --secondary-bg: #1a1a2e;
            --accent-color: #00d4ff;
            --text-primary: #ffffff;
            --text-secondary: #b8b8b8;
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: var(--primary-bg);
            color: var(--text-primary);
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* Floating Astronaut Chatbot */
        .floating-astronaut {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 80px;
            height: 80px;
            z-index: 1000;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: float 3s ease-in-out infinite;
        }

        .floating-astronaut img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
        }

        .floating-astronaut:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        /* Hero Section */
        .hero-section {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .hero-content {
            text-align: center;
            z-index: 2;
            max-width: 800px;
            padding: 2rem;
        }

        .profile-avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin: 0 auto 2rem;
            border: 4px solid var(--accent-color);
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
        }

        .hero-title {
            font-family: 'Orbitron', monospace;
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, var(--accent-color), #ff6b6b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-subtitle {
            font-size: 1.5rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-weight: 300;
        }

        .hero-description {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.8;
        }

        /* Work Portal Section */
        .work-portal-section {
            min-height: 100vh;
            background: var(--secondary-bg);
            padding: 4rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }

        .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 2rem;
            color: var(--accent-color);
        }

        .work-profile {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 3rem;
            margin: 0 auto;
            max-width: 800px;
            text-align: center;
        }

        .work-profile h3 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: var(--accent-color);
        }

        .work-profile p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            line-height: 1.8;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .dashboard-item {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .dashboard-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
        }

        .dashboard-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 15px;
            margin-bottom: 1rem;
        }

        .dashboard-item h4 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--accent-color);
        }

        .dashboard-item p {
            color: var(--text-secondary);
        }

        /* Tools Section */
        .tools-section {
            background: var(--primary-bg);
            padding: 4rem 2rem;
            text-align: center;
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }

        .tool-item {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.3s ease;
        }

        .tool-item:hover {
            transform: scale(1.05);
        }

        .tool-item h4 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: var(--accent-color);
        }

        .tool-item p {
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .tool-button {
            background: linear-gradient(45deg, var(--accent-color), #ff6b6b);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .tool-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
        }

        /* Personal Space Section */
        .personal-space-section {
            min-height: 100vh;
            background: var(--secondary-bg);
            padding: 4rem 2rem;
        }

        .news-section {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 3rem;
        }

        .news-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .news-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1.5rem;
            transition: all 0.3s ease;
        }

        .news-item:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.1);
        }

        .news-item h5 {
            color: var(--accent-color);
            margin-bottom: 0.5rem;
        }

        .news-item p {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .spotify-interface {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 3rem;
        }

        .music-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }

        .music-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1rem;
            text-align: center;
            transition: all 0.3s ease;
        }

        .music-item:hover {
            transform: scale(1.05);
            background: rgba(255, 255, 255, 0.1);
        }

        .music-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 1rem;
        }

        .avatar-generator {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
        }

        .avatar-upload {
            border: 2px dashed var(--accent-color);
            border-radius: 15px;
            padding: 3rem;
            margin: 2rem 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .avatar-upload:hover {
            border-color: #ff6b6b;
            background: rgba(0, 212, 255, 0.1);
        }

        .avatar-preview {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            margin: 2rem auto;
            border: 3px solid var(--accent-color);
            display: none;
        }

        /* Interactive Trainer Section */
        .trainer-section {
            min-height: 100vh;
            background: var(--primary-bg);
            padding: 4rem 2rem;
        }

        .trainer-interface {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 3rem;
            max-width: 1000px;
            margin: 0 auto;
        }

        .chat-interface {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            height: 400px;
            overflow-y: auto;
        }

        .chat-input {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .chat-input input {
            flex: 1;
            padding: 12px;
            border: 1px solid var(--glass-border);
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
        }

        .chat-input button {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
        }

        /* Contact Section */
        .contact-section {
            background: var(--secondary-bg);
            padding: 4rem 2rem;
            text-align: center;
        }

        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }

        .contact-item {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.3s ease;
        }

        .contact-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
        }

        .contact-item a {
            color: var(--accent-color);
            text-decoration: none;
            font-size: 1.2rem;
            font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .section-title {
                font-size: 2rem;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .tools-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Floating Particles */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 50%;
            animation: float-particle 6s infinite linear;
        }

        @keyframes float-particle {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <!-- Floating Astronaut Chatbot -->
    <div class="floating-astronaut" onclick="openChat()">
        <img src="/assets/astronaut-avatar.gif" alt="AI Assistant">
    </div>

    <!-- Hero Section - Profile -->
    <section class="hero-section">
        <div class="particles" id="particles"></div>
        <div class="hero-content" data-aos="fade-up">
            <img src="/assets/astronaut-avatar.gif" alt="Ayush" class="profile-avatar">
            <h1 class="hero-title">Ayush</h1>
            <p class="hero-subtitle">AI Developer & Tech Innovator</p>
            <p class="hero-description">
                Passionate AI developer creating cutting-edge solutions. Currently working on multiple AI projects 
                including chatbots, avatar generators, and intelligent dashboards. Based in India, delivering 
                innovative tech solutions to clients worldwide.
            </p>
        </div>
    </section>

    <!-- Work Portal Section -->
    <section class="work-portal-section">
        <h2 class="section-title" data-aos="fade-up">Work Portal</h2>
        
        <!-- Work Profile -->
        <div class="work-profile" data-aos="fade-up">
            <h3>Professional Profile</h3>
            <p>
                Specialized in AI development with expertise in machine learning, natural language processing, 
                and computer vision. Currently leading multiple AI projects including intelligent chatbots, 
                automated systems, and data analytics platforms. Committed to delivering scalable, efficient, 
                and innovative solutions that drive business growth.
            </p>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            <div class="dashboard-item" data-aos="fade-up" data-aos-delay="100" onclick="openDashboard('server')">
                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop" alt="Server Management">
                <h4>Server Management</h4>
                <p>Monitor and manage all your AI project servers, check status, and control deployments</p>
            </div>
            
            <div class="dashboard-item" data-aos="fade-up" data-aos-delay="200" onclick="openDashboard('chatbot')">
                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop" alt="Chatbot Training">
                <h4>Chatbot Training</h4>
                <p>Train and customize your AI chatbots with new data and conversation patterns</p>
            </div>
            
            <div class="dashboard-item" data-aos="fade-up" data-aos-delay="300" onclick="openDashboard('logs')">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop" alt="System Logs">
                <h4>System Logs</h4>
                <p>Access comprehensive logs and analytics for all your AI systems and projects</p>
            </div>
        </div>
    </section>

    <!-- Tools Section -->
    <section class="tools-section">
        <h2 class="section-title" data-aos="fade-up">Development Tools</h2>
        <div class="tools-grid">
            <div class="tool-item" data-aos="fade-up" data-aos-delay="100">
                <h4>Document Creator</h4>
                <p>Create professional documents, reports, and technical specifications</p>
                <button class="tool-button" onclick="openDocumentCreator()">Open Tool</button>
            </div>
            
            <div class="tool-item" data-aos="fade-up" data-aos-delay="200">
                <h4>PDF Generator</h4>
                <p>Convert documents, reports, and presentations to professional PDFs</p>
                <button class="tool-button" onclick="openPDFGenerator()">Open Tool</button>
            </div>
            
            <div class="tool-item" data-aos="fade-up" data-aos-delay="300">
                <h4>Presentation Generator</h4>
                <p>Create stunning presentations with AI-powered content suggestions</p>
                <button class="tool-button" onclick="openPresentationGenerator()">Coming Soon</button>
            </div>
        </div>
    </section>

    <!-- Personal Space Section -->
    <section class="personal-space-section">
        <h2 class="section-title" data-aos="fade-up">Personal Space</h2>
        
        <!-- News Section -->
        <div class="news-section" data-aos="fade-up">
            <h3 style="color: var(--accent-color); margin-bottom: 1rem;">Latest News</h3>
            <div class="news-grid">
                <div class="news-item">
                    <h5>AI Breakthrough in Natural Language Processing</h5>
                    <p>Latest developments in transformer models and their applications...</p>
                </div>
                <div class="news-item">
                    <h5>Machine Learning in Healthcare</h5>
                    <p>How AI is revolutionizing medical diagnosis and treatment...</p>
                </div>
                <div class="news-item">
                    <h5>Future of Autonomous Vehicles</h5>
                    <p>Advances in self-driving technology and safety systems...</p>
                </div>
            </div>
        </div>

        <!-- Spotify-like Interface -->
        <div class="spotify-interface" data-aos="fade-up">
            <h3 style="color: var(--accent-color); margin-bottom: 1rem;">Music & Videos</h3>
            <div class="music-grid">
                <div class="music-item">
                    <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop" alt="Music 1">
                    <h5>Chill Vibes</h5>
                    <p>Relaxing beats</p>
                </div>
                <div class="music-item">
                    <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=150&fit=crop" alt="Music 2">
                    <h5>Focus Mode</h5>
                    <p>Productivity tunes</p>
                </div>
                <div class="music-item">
                    <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop" alt="Music 3">
                    <h5>Energy Boost</h5>
                    <p>High tempo tracks</p>
                </div>
            </div>
        </div>

        <!-- Avatar Generator -->
        <div class="avatar-generator" data-aos="fade-up">
            <h3 style="color: var(--accent-color); margin-bottom: 1rem;">AI Avatar Generator</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Upload your photo and create stunning AI-generated avatars with different styles
            </p>
            <div class="avatar-upload" onclick="document.getElementById('avatarFile').click()">
                <p style="color: var(--accent-color); font-size: 1.2rem;">📁 Click to Upload Photo</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Supports JPG, PNG, GIF</p>
            </div>
            <input type="file" id="avatarFile" accept="image/*" style="display: none;" onchange="handleAvatarUpload(event)">
            <img id="avatarPreview" class="avatar-preview" alt="Avatar Preview">
            <button class="tool-button" onclick="generateAvatar()" style="display: none;" id="generateBtn">Generate Avatar</button>
        </div>
    </section>

    <!-- Interactive Trainer Section -->
    <section class="trainer-section">
        <h2 class="section-title" data-aos="fade-up">Interactive AI Trainer</h2>
        <div class="trainer-interface" data-aos="fade-up">
            <h3 style="color: var(--accent-color); margin-bottom: 1rem;">Train Your AI Assistant</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Interact with your AI assistant and train it with new information. The more you interact, 
                the smarter it becomes!
            </p>
            
            <div class="chat-interface" id="chatInterface">
                <div style="color: var(--text-secondary); text-align: center; margin-top: 150px;">
                    Start a conversation with your AI assistant...
                </div>
            </div>
            
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Type your message here..." onkeypress="handleChatEnter(event)">
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
        <h2 class="section-title" data-aos="fade-up">Get In Touch</h2>
        <div class="contact-grid">
            <div class="contact-item" data-aos="fade-up" data-aos-delay="100">
                <h4>LinkedIn</h4>
                <a href="https://linkedin.com/in/ayush" target="_blank">Connect on LinkedIn</a>
            </div>
            
            <div class="contact-item" data-aos="fade-up" data-aos-delay="200">
                <h4>WhatsApp</h4>
                <a href="https://wa.me/your-number" target="_blank">Chat on WhatsApp</a>
            </div>
            
            <div class="contact-item" data-aos="fade-up" data-aos-delay="300">
                <h4>Email</h4>
                <a href="mailto:ayush@example.com">Send Email</a>
            </div>
            
            <div class="contact-item" data-aos="fade-up" data-aos-delay="400">
                <h4>Portfolio</h4>
                <a href="https://your-portfolio.com" target="_blank">View Portfolio</a>
            </div>
        </div>
    </section>

    <!-- Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Initialize ScrollReveal
        ScrollReveal().reveal('.section-title', {
            delay: 200,
            distance: '50px',
            origin: 'bottom'
        });

        // Floating Particles
        function createParticles() {
            const particles = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particles.appendChild(particle);
            }
        }

        // Avatar Generator
        function handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('avatarPreview');
                    const generateBtn = document.getElementById('generateBtn');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    generateBtn.style.display = 'inline-block';
                };
                reader.readAsDataURL(file);
            }
        }

        function generateAvatar() {
            alert('AI Avatar generation feature coming soon! 🚀');
        }

        // Chat Interface
        function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            if (message) {
                addMessage('You', message, 'user');
                setTimeout(() => {
                    addMessage('AI Assistant', 'Thank you for the information! I\'m learning from our conversation.', 'ai');
                }, 1000);
                input.value = '';
            }
        }

        function handleChatEnter(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function addMessage(sender, message, type) {
            const chatInterface = document.getElementById('chatInterface');
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin: 1rem 0;
                padding: 1rem;
                border-radius: 15px;
                max-width: 80%;
                ${type === 'user' ? 
                    'background: rgba(0, 212, 255, 0.2); margin-left: auto; text-align: right;' : 
                    'background: rgba(255, 255, 255, 0.1); margin-right: auto;'
                }
            `;
            messageDiv.innerHTML = `
                <strong style="color: var(--accent-color);">${sender}:</strong><br>
                <span style="color: var(--text-primary);">${message}</span>
            `;
            chatInterface.appendChild(messageDiv);
            chatInterface.scrollTop = chatInterface.scrollHeight;
        }

        // Dashboard Functions
        function openDashboard(type) {
            switch(type) {
                case 'server':
                    alert('Opening Server Management Dashboard... 🖥️');
                    break;
                case 'chatbot':
                    alert('Opening Chatbot Training Interface... 🤖');
                    break;
                case 'logs':
                    alert('Opening System Logs Dashboard... 📊');
                    break;
            }
        }

        // Tool Functions
        function openDocumentCreator() {
            alert('Opening Document Creator... 📝');
        }

        function openPDFGenerator() {
            alert('Opening PDF Generator... 📄');
        }

        function openPresentationGenerator() {
            alert('Presentation Generator coming soon! 🎯');
        }

        // Chat Functions
        function openChat() {
            alert('Opening AI Chat Interface... 💬');
        }

        // Initialize particles when page loads
        window.addEventListener('load', createParticles);
    </script>
</body>
</html>
    '''

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'AI Portal is running smoothly!',
        'port': 3030
    })

if __name__ == '__main__':
    print("🚀 Starting AI Portal - ONE MAIN PAGE WITH EVERYTHING EMBEDDED...")
    print("=" * 70)
    print("🌐 Port: 3030 (Chrome Safe!)")
    print("🎨 Theme: Space (Single Page Experience)")
    print("⚡ Features: All Content Embedded, No Separate Pages")
    print("=" * 70)
    print("📱 Main Portal: http://localhost:3030/")
    print("🔧 API Health: http://localhost:3030/api/health")
    print("=" * 70)
    print("✅ Chrome will NOT block this port!")
    print("🎮 Everything is on ONE page - no separate routes!")
    print("Press Ctrl+C to stop the server")
    print("=" * 70)
    
    app.run(host='0.0.0.0', port=3030, debug=False)
