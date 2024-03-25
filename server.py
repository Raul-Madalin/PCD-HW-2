from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('dist/auth_factory_watcher/browser', 'index.html')

# Serve static files from the browser folder
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('dist/auth_factory_watcher/browser', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
