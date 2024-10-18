pipeline {
    agent any 

    environment {
        DOCKER_CREDENTIALS_ID = '435bab52-7dd7-4561-8195-1f8897e99fac'
        DOCKER_IMAGE = 'vishnu2117/devops-proj-1' // Your Docker Hub username
        K8S_DEPLOYMENT = 'my-devops-proj'
        K8S_SERVICE = 'devops-service'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the Git repository
                git url: 'https://github.com/vishnu-rv/Sample-Proj.git', branch: 'master'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build the Docker image
                script {
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                // Login to Docker Hub and push the image
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials-id') { // Replace with your Docker Hub credentials ID
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Use kubectl to apply the deployment and service configuration
                sh '''
                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
