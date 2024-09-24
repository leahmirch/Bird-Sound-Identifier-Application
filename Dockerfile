FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    portaudio19-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY ./backend/birdnet_detector/requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy the application code
COPY ./backend /app
WORKDIR /app/birdnet_detector

CMD ["python", "detect_birds.py"]
