Here’s an updated README file that incorporates your pipeline configuration and usage with `pm2`, a process manager for Node.js applications. This setup omits Express.js as per your instructions and assumes you’re using a basic Node.js server.

---

# DevOps Project

This project demonstrates a simple web application built with Node.js, utilizing Stripe for payment processing. The application is containerized with Docker, deployed on a Kubernetes cluster, and automated through a Jenkins CI/CD pipeline. The setup also includes `pm2` for process management in production.

## Features

- Simple Node.js web server
- Static file serving and Stripe payment integration
- Dockerized for easy container management
- Kubernetes deployment for scalability and load balancing
- Jenkins pipeline for CI/CD automation
- `pm2` for process management in production

## Prerequisites

Before starting, ensure you have the following:

- **Node.js**: v14 or higher
- **Docker**: v20 or higher
- **Kubernetes**: Access to a Kubernetes cluster
- **kubectl**: Command-line tool for Kubernetes
- **Jenkins**: For CI/CD pipeline
- **pm2**: Node.js process manager (for local or VM deployment)
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

1. **Edit `.env` file**: Add your IP address or Load Balancer IP for local deployment. 

   ```plaintext
   PORT=3000
   STRIPE_SECRET_KEY=your_stripe_secret_key
   HOST=http://<YOUR_IP_OR_LB_IP>:3000
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Application with pm2**:

   Install `pm2` if you haven’t already:

   ```bash
   npm install -g pm2
   ```

   Start the application with `pm2`:

   ```bash
   pm2 start server.js --name devops-app
   ```

### Docker Setup

1. **Build Docker Image**:

   ```bash
   docker build -t vishnu2117/devops-proj-1 .
   ```

2. **Run Docker Container Locally**:

   ```bash
   docker run -p 3000:3000 vishnu2117/devops-proj-1
   ```

### Kubernetes Deployment

1. **Push Docker Image**:

   ```bash
   docker push vishnu2117/devops-proj-1
   ```

2. **Deploy to Kubernetes**:

   ```bash
   kubectl apply -f deployment.yaml --namespace=my-proj
   ```

---

### Jenkins Pipeline Setup

To automate the build, push, and deployment steps, use the following Jenkins pipeline. This setup includes setting environment variables, building and pushing the Docker image, and deploying to Kubernetes.

#### Jenkins Setup Instructions

1. **Credentials Setup**:
   - **Docker Registry**: Add a credential in Jenkins with ID `54976742-d291-4757-b697-a1c1e178da6c`.
   - **GitHub Repository**: Add a credential with ID `6881cda4-f7d0-444e-8f4d-3ec3ae05f9de`.
   - **Kubeconfig File**: Upload your kubeconfig as a file credential with ID `d3a89aeb-9181-4f6d-b74e-2baf7bc6a43e`.

2. **Jenkins Pipeline Script**:

   ```groovy
   pipeline {
       agent any

       environment {
           DOCKER_CREDENTIALS_ID = '54976742-d291-4757-b697-a1c1e178da6c'
           GIT_CREDENTIALS_ID = '6881cda4-f7d0-444e-8f4d-3ec3ae05f9de'
           DOCKER_IMAGE = 'vishnu2117/devops-proj-1'
           K8S_NAMESPACE = 'my-proj'
           K8S_DEPLOYMENT = 'my-devops-proj'
           K8S_SERVICE = 'devops-service'
           KUBE_CONFIG_CREDENTIALS_ID = 'd3a89aeb-9181-4f6d-b74e-2baf7bc6a43e'  // Newly created kubeconfig credential ID
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

---

### Summary of Steps

1. **Local Deployment**: Set up `.env`, install dependencies, and use `pm2` for process management.
2. **Dockerize the Application**: Build and push the Docker image to your Docker registry.
3. **Kubernetes Deployment**: Deploy the Docker image to your Kubernetes cluster.
4. **Automate with Jenkins**: Use the provided Jenkins pipeline to automate building, pushing, and deploying the application. 

