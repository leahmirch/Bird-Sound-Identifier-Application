# Use the latest Ubuntu image
FROM ubuntu:22.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    software-properties-common \
    python3.10 \
    python3-pip \
    python3.10-dev \
    ffmpeg \
    portaudio19-dev \
    build-essential \
    libasound-dev \
    libportaudio2 \
    libportaudiocpp0 \
    libjack-jackd2-dev \
    curl \
    gnupg

# Ensure python3 points to python3.10
RUN ln -sf /usr/bin/python3.10 /usr/bin/python3

# Set the working directory
WORKDIR /app

# Copy the requirements and install dependencies
COPY requirements.txt /app/requirements.txt
RUN python3 -m pip install -r requirements.txt

# Copy the rest of the application files to the container
COPY . /app

# Set Flask app environment variable
ENV FLASK_APP=app.py

# Expose the port (5000 is standard for Flask, feel free to change it back to 3001)
EXPOSE 5000

# Start Flask server
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
