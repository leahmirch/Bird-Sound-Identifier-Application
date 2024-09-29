# Developer ReadMe for Bird Sound Identifier Application

## Overview

This document will guide you through the steps to set up the development environment for the Bird Sound Identifier Application. The guide covers installation for both **Windows 11** and **macOS**. By the end of this guide, you will be able to run the application locally in a development environment using Docker, Flask (for the backend), and React (for the frontend).

### Prerequisites

Before starting, you will need to install the following:

- **Docker** (for containerization)
- **Python 3.10** (for the Flask backend)
- **Node.js (v16)** and **npm** (for the frontend React app)
- **Git** (to clone the repository)

### Steps for Installation and Setup

#### Step 1: Installing Docker

Docker is necessary for containerizing the application.

- **Windows 11:**
  1. Download Docker Desktop for Windows from the official website: https://www.docker.com/products/docker-desktop.
  2. Run the installer and follow the on-screen instructions.
  3. After installation, open Docker Desktop and ensure it is running (look for the whale icon in the system tray).
  4. Ensure WSL 2 is enabled, as Docker Desktop for Windows relies on WSL 2.
  
- **macOS:**
  1. Download Docker Desktop for macOS from the official website: https://www.docker.com/products/docker-desktop.
  2. Install the application by following the on-screen instructions.
  3. Open Docker Desktop and ensure it is running.

Verify the Docker installation:
```bash
docker --version
```

#### Step 2: Installing Python 3.10

The backend of the Bird Sound Identifier Application is built with Python and requires version 3.10.

- **Windows 11:**
  1. Download Python 3.10 from https://www.python.org/downloads/release/python-3100/.
  2. During installation, ensure that the option **Add Python to PATH** is checked.
  3. After installation, open Command Prompt and verify the installation:
     ```bash
     python --version
     ```

- **macOS:**
  1. Install Homebrew if you haven’t already:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
  2. Install Python 3.10 using Homebrew:
     ```bash
     brew install python@3.10
     ```
  3. Verify the installation:
     ```bash
     python3 --version
     ```

#### Step 3: Installing Node.js and npm

The frontend of the Bird Sound Identifier Application is a React app, so Node.js and npm are required.

- **Windows 11:**
  1. Download Node.js (version 16) from https://nodejs.org/dist/latest-v16.x/.
  2. Run the installer and follow the installation steps.
  3. Verify the installation:
     ```bash
     node -v
     npm -v
     ```

- **macOS:**
  1. Use Homebrew to install Node.js and npm:
     ```bash
     brew install node@16
     ```
  2. Verify the installation:
     ```bash
     node -v
     npm -v
     ```

#### Step 4: Installing Git

Git is required to clone the repository.

- **Windows 11:**
  1. Download Git from https://git-scm.com/.
  2. Install by following the default instructions.

- **macOS:**
  1. Install Git using Homebrew:
     ```bash
     brew install git
     ```

#### Step 5: Clone the Repository

Once Docker, Python, npm, and Git are installed, you can clone the repository.

1. Open a terminal (Command Prompt/PowerShell on Windows, Terminal on macOS).
2. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
3. Navigate to the project directory:
   ```bash
   cd Bird-Sound-Identifier-Application
   ```

#### Step 6: Setting Up Docker and Building the Containers

To simplify the development environment, Docker is used to containerize both the backend and frontend.

1. Ensure Docker is running.
2. Build and start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker image for the backend.
   - Install all necessary dependencies (Python, npm packages, etc.).
   - Expose the application on `localhost:5000`.

#### Step 7: Verify and Access the Application

Once the containers are running, the application should be accessible in your browser:

- **Frontend:** http://localhost:5000/
- **Backend:** The backend API is accessible from the same URL. All the React API calls are made to this backend.

#### Step 8: Stopping the Application

To stop the Docker containers, press `CTRL+C` in the terminal running Docker. If you want to stop the containers without removing them, run:
```bash
docker-compose down
```

### Developing the Application

#### Frontend Development

If you wish to make changes to the frontend:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000` and will reload upon code changes.

#### Backend Development

For backend development:

1. Ensure you are in the project root directory.
2. Make changes to the backend code, which resides in `app.py` and other files under `backend/`.
3. To restart the backend and reflect changes, simply restart the Docker container:
   ```bash
   docker-compose up --build
   ```

### Troubleshooting

1. **Docker Not Running:** Ensure that Docker Desktop is up and running before executing any Docker commands.
2. **Python Package Issues:** If you encounter Python package issues, ensure that `requirements.txt` is correct and that the necessary packages are installed.
3. **Frontend Not Loading Properly:** If the frontend does not load or displays errors, ensure that Node.js dependencies are correctly installed by running `npm install` inside the `frontend/` directory.


This setup guide is designed for **development only**. For deployment or production use, additional steps such as configuring a production server, setting up SSL, etc., will be required.