#!/bin/bash

# Exit on error
set -e

code_clone(){
        echo "===================================="
        echo "Cloning or updating repository..."
        echo "===================================="
        if [ -d "online-library" ]; then
                echo "The code directory already exists. Pulling latest changes..."
                cd online-library
                git pull
                cd ..
        else
                git clone https://github.com/OmR31997/online-library.git
        fi
}

depend_installation(){
        echo "===================================="
        echo "Package installing..."
        echo "===================================="
        sudo apt-get update
        sudo apt-get install docker.io nginx -y
}

required_restarts(){
        echo "===================================="
        echo "Configuring permissions and services..."
        echo "======================================"
        sudo chown $USER /var/run/docker.sock || true
        sudo systemctl enable docker
        sudo systemctl enable nginx
        sudo systemctl restart docker
        sudo systemctl restart nginx
}

deploy() {
        echo "===================================="
        echo "Deploying application container..."
        echo "===================================="
        
        # Ensure we are inside the repository directory
        cd online-library

        # Check if .env file exists
        if [ ! -f .env ]; then
                echo "Warning: .env file is missing. Creating from .env.example..."
                if [ -f .env.example ]; then
                        cp .env.example .env
                        echo "Created .env file. Please edit it with your database and redis connection details."
                else
                        echo "Error: No .env.example found. Please create a .env file."
                        exit 1
                fi
        fi

        # Build production docker image (context is '.' which is inside online-library/)
        docker build -t online-library:latest .

        # Stop and remove existing container if it already exists
        if [ "$(docker ps -aq -f name=online-library-app)" ]; then
                echo "Removing existing container..."
                docker rm -f online-library-app
        fi

        # Run container. Next.js runs on port 3000 internally, mapped to host port 8000
        docker run -d \
                -p 8000:3000 \
                --name online-library-app \
                --env-file .env \
                --restart always \
                online-library:latest
        
        echo "======================================"
        echo "Application successfully deployed on port 8000!"
        echo "======================================"
}

# Run execution flow
code_clone
depend_installation
required_restarts
deploy
