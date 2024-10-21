pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = '54976742-d291-4757-b697-a1c1e178da6c'
        GIT_CREDENTIALS_ID = '2f7d41dd-0dc6-4cc6-9a41-b07a9b72b2b1'
        DOCKER_IMAGE = 'vishnu2117/devops-proj-1'
        K8S_NAMESPACE = 'my-proj'
        K8S_DEPLOYMENT = 'my-devops-proj'
        K8S_SERVICE = 'devops-service'
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Using Git credentials for private repo access
                    git credentialsId: "${GIT_CREDENTIALS_ID}", url: 'https://github.com/vishnu-rv/Demo.git', branch: 'main'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Building the Docker image
                    dockerImage = docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Pushing the image to Docker Hub using stored credentials
                    docker.withRegistry('https://registry.hub.docker.com', "${DOCKER_CREDENTIALS_ID}") {
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Deploying to Kubernetes
                    kubectl.apply("--namespace=${K8S_NAMESPACE} -f deployment.yaml")
                    kubectl.apply("--namespace=${K8S_NAMESPACE} -f service.yaml")
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
