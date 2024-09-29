from flask import Flask, request, jsonify, send_from_directory, render_template
import os

# Update the static folder path to point to the React build directory
app = Flask(__name__, static_folder='frontend/build', static_url_path='')

# Serve the React frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

# Serve all other static files (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static_file(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Existing API route for bird detection
@app.route('/birds/latest', methods=['GET'])
def get_latest_bird():
    result = subprocess.run(["python3", "./backend/birdnet_detector/detect_birds.py"], capture_output=True, text=True)
    return jsonify({"message": "Bird detection started", "output": result.stdout})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
