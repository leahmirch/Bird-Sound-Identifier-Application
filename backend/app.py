from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

# Example endpoint to get the latest bird sound detection
@app.route('/birds/latest', methods=['GET'])
def get_latest_bird():
    # This will trigger BirdNETDetector to analyze sounds
    result = subprocess.run(["python3", "./birdnet_detector/detect_birds.py"], capture_output=True, text=True)
    return jsonify({"message": "Bird detection started", "output": result.stdout})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
