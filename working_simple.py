from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>🚀 AI Portal - Working!</h1><p>Port: 6000</p><a href="/enhanced">Open Enhanced Portal</a>'

@app.route('/enhanced')
def enhanced():
    return '<h1>🌌 Enhanced Portal</h1><p>Your AI workspace is ready!</p><a href="/">← Back</a>'

if __name__ == '__main__':
    print('🚀 Starting AI Portal on port 6000...')
    print('📱 http://localhost:6000/')
    app.run(host='0.0.0.0', port=6000, debug=False)


