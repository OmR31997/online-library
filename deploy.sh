#!/bin/bash

# Exit on error
set -e

code_clone(){
        echo "======================================"
        echo "Cloning online-library repository..."
        echo "======================================"
        # If the directory exists and is a valid Git repository, pull changes
        if [ -d "online-library" ] && [ -d "online-library/.git" ]; then
                echo "Directory online-library exists and is a Git repository. Pulling latest changes..."
                cd online-library
                git pull
                cd ..
        else
                echo "Directory does not exist or is not a valid Git repository. Re-cloning..."
                rm -rf online-library
                git clone git@github.com:OmR31997/online-library.git
        fi
}

install_requirements(){
        echo "======================================"
        echo "Installing system dependencies (Docker & Nginx)..."
        echo "======================================"
        sudo apt-get update
        sudo apt-get install docker.io nginx -y
}

required_restarts(){
        echo "======================================"
        echo "Enabling and starting Docker and Nginx services..."
        echo "======================================"
        sudo systemctl enable docker
        sudo systemctl start docker
        sudo systemctl enable nginx
        sudo systemctl start nginx
}

deploy(){
        echo "======================================"
        echo "Deploying online-library container..."
        echo "======================================"
        
        # Navigate to repository directory if we cloned it
        if [ -d "online-library" ]; then
                cd online-library
        fi

        # Check if .env file exists
        if [ ! -f .env ]; then
                echo "Error: .env file is missing!"
                if [ -f .env.example ]; then
                        cp .env.example .env
                        echo "Created .env from .env.example."
                        echo "Please edit the .env file in the repository to configure your database and redis credentials, then run the script again."
                else
                        echo "No .env.example found. Please create a .env file."
                fi
                exit 1
        fi

        # Build production docker image
        docker build -t online-library:latest .

        # Stop and remove existing container if it already exists
        if [ "$(docker ps -aq -f name=online-library-app)" ]; then
                echo "Removing existing container..."
                docker rm -f online-library-app
        fi

        # Run container using the environment file
        # Container port is 3000, mapped to host port 8000
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

# Run the deployment functions
echo "***** DEPLOYMENT STARTED *****"
code_clone
install_requirements
required_restarts
deploy
echo "***** DEPLOYMENT COMPLETED SUCCESSFULLY *****"
