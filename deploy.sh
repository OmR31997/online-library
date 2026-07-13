#!/bin/bash

# Exit on error
set -e

code_clone(){
        echo "======================================"
        echo "Cloning or updating repository..."
        echo "======================================"
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
        echo "======================================"
        echo "Package installing..."
        echo "======================================"
        sudo apt-get update
        sudo apt-get install docker.io nginx -y
}

required_restarts(){
        echo "======================================"
        echo "Configuring permissions and services..."
        echo "======================================"
        sudo chown $USER /var/run/docker.sock || true
        sudo systemctl enable docker
        sudo systemctl enable nginx
        sudo systemctl restart docker
}

configure_nginx(){
        echo "======================================"
        echo "Automating Nginx reverse proxy configuration..."
        echo "======================================"
        
        # Write default Nginx site configuration mapping port 80 to port 8000
        sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Forward client IP headers
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

        # Verify Nginx configuration syntax and restart service
        sudo nginx -t
        sudo systemctl restart nginx
}

deploy() {
        echo "======================================"
        echo "Deploying application container..."
        echo "======================================"
        
        # Ensure we are inside the repository directory
        cd online-library

        # Check if .env file exists
        if [ ! -f .env ]; then
                echo "Warning: .env file is missing. Creating from .env.example..."
                if [ -f .env.example ]; then
                        cp .env.example .env
                        echo "Created .env file. Please edit it with your database credentials."
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

        # Run container. Next.js port 3000 mapped to host port 8000
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
configure_nginx
deploy
