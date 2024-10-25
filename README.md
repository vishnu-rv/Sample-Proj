---

# DevOps Project

This project demonstrates a simple web application built with Node.js, utilizing Stripe for payment processing. The application is containerized using Docker and deployed on a Kubernetes cluster. It serves static HTML pages and handles payment sessions through Stripe.

## Features

- Simple Node.js web server
- Static file serving from a public directory
- Stripe payment integration
- Dockerized application for easy deployment
- Kubernetes deployment for scalability and load balancing
- Jenkins pipeline for automated CI/CD
- PM2 for process management

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: v14 or higher
- **Docker**: v20 or higher
- **Kubernetes**: Access to a Kubernetes cluster
- **kubectl**: Command-line tool for Kubernetes
- **Jenkins**: For CI/CD pipeline
- **Stripe API Key**: For payment integration

## Project Structure

```plaintext
/Sample-Proj
├── Dockerfile
├── server.js
├── .env
└── public
    ├── index.html
    ├── success.html
    ├── cancel.html
    └── workshops
        ├── workshop1.html
        ├── workshop2.html
        └── workshop3.html
```

## Configuration

### Local Environment Setup

1. **Edit `.env` file**: Update the `.env` file with your IP address or Load Balancer IP if running locally. Replace `localhost` with your IP.

   ```plaintext
   PORT=3000
   #STRIPE_SECRET_KEY=your_stripe_secret_key
   HOST=http://<YOUR_IP_OR_LB_IP>:3000
   STATIC_DIR=client  #this is the path of the index.html
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Application**:

   ```bash
   npm start
   ```

### Using PM2 for Process Management

PM2 is a popular process manager for Node.js applications that allows you to keep your app alive and manage it easily.

1. **Install PM2 Globally**:

   ```bash
   npm install -g pm2
   ```

2. **Start the Application with PM2**:

   ```bash
   pm2 start server.js --name "my-app"
   ```

3. **Manage Your Application**:

   - View status: `pm2 status`
   - Stop application: `pm2 stop my-app`
   - Restart application: `pm2 restart my-app`
   - View logs: `pm2 logs my-app`

### Docker Setup

1. **Build Docker Image**:

   ```bash
   docker build -t your-docker-image:latest .
   ```

2. **Run Docker Container Locally**:

   ```bash
   docker run -p 3000:3000 your-docker-image:latest
   ```

### Kubernetes Deployment

1. **Push Docker Image**: Push the image to your Docker registry if you plan to use Kubernetes for deployment.

   ```bash
   docker push your-docker-image:latest
   ```

2. **Deploy to Kubernetes**:

   Apply the Kubernetes configuration (such as `deployment.yaml`) with your desired namespace and Docker image.

   ```bash
   kubectl apply -f deployment.yaml --namespace=my-namespace
   ```

---

### CI/CD Pipeline with Jenkins

To automate this process, follow these steps to set up a Jenkins pipeline that builds, pushes, and deploys your Docker image to Kubernetes.

#### Jenkins Setup

1. **Credentials Setup**:
   - **Docker Registry**:
     - Go to `Manage Jenkins > Manage Credentials`.
     - Add a new credential for your Docker registry with your username and password.
   - **GitHub Repository**:
     - Add a new credential with your GitHub username and token if necessary.
   - **Kubeconfig**:
     - Save your kubeconfig file securely on the Jenkins server.
     - Go to `Manage Jenkins > Manage Credentials` and add it as a file credential, giving it an ID (e.g., `kubeconfig-cred`).

2. **Jenkins Pipeline Script**:

Here’s a Jenkins pipeline script for your CI/CD process:

```groovy
pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'ID'
        GIT_CREDENTIALS_ID = 'ID'
        DOCKER_IMAGE = 'vishnu2117/devops-proj-1'
        K8S_NAMESPACE = 'my-proj'
        K8S_DEPLOYMENT = 'my-devops-proj'
        K8S_SERVICE = 'devops-service'
        KUBE_CONFIG_CREDENTIALS_ID = 'ID'  // Newly created kubeconfig credential ID
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: "${GIT_CREDENTIALS_ID}", url: 'https://github.com/vishnu-rv/Sample-Proj.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${DOCKER_IMAGE}").push('v1')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: KUBE_CONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                        sh '''
                        kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_DEPLOYMENT}=${DOCKER_IMAGE}:v1 --namespace=${K8S_NAMESPACE}
                        kubectl rollout status deployment/${K8S_DEPLOYMENT} --namespace=${K8S_NAMESPACE}
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished, cleaning up"
            cleanWs()
        }
    }
}
```

### Setting Up Webhooks

To enable complete automation, you can set up webhooks in GitHub or any version control system you're using. This will trigger the Jenkins pipeline automatically when changes are pushed to the repository.

1. **In GitHub**:
   - Go to your repository.
   - Click on `Settings > Webhooks > Add webhook`.
   - Set the Payload URL to your Jenkins URL followed by `/github-webhook/` (e.g., `http://your-jenkins-url/github-webhook/`).
   - Set the content type to `application/json`.
   - Choose to trigger on `Just the push event`.
   - Click on `Add webhook`.

2. **In Jenkins**:
   - Go to your Jenkins job.
   - Click on `Configure`.
   - In the Build Triggers section, check `GitHub hook trigger for GITScm polling`.

---

### Summary of Deployment Types

1. **Local Deployment**:
   - Run using Node.js and Express by executing `npm start`.
   - Manage using PM2 with `pm2 start server.js --name "my-app"`.

2. **Automated Deployment**:
   - Automated CI/CD process using Jenkins, Docker, and Kubernetes.
   - Build, push, and deploy your Docker images to your Kubernetes cluster automatically.

---

### Screenshots

- **Jenkins Job Successfully Run**:
- ![image](https://github.com/user-attachments/assets/510c3db4-4a78-472b-97b5-c92247566c26)

 

- **Pipeline Output**:
![image](https://github.com/user-attachments/assets/a34633ab-9a6a-492c-b9a6-81b02792eb02)

 


With this setup, you can easily manage your Node.js application in various environments while ensuring a streamlined CI/CD process.
