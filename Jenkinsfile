pipeline {
    agent any 

    environment {
        DOCKER_CREDENTIALS_ID = '2fd7aa25-5a0a-4ca8-a450-cf41de2687fd'
        DOCKER_IMAGE = 'vishnu2117/devops-proj-1' // Your Docker Hub username
        KUBE_CONFIG = '/root/MY-PROJ-kubeconfig.yaml'
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
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) { // Use the environment variable
                     sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

         stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply the deployment YAML
                    sh "kubectl apply -f deployment.yaml --kubeconfig=${KUBE_CONFIG} --namespace=${K8S_NAMESPACE} --validate=false"
                    // Apply the service YAML
                    sh "kubectl apply -f service.yaml --kubeconfig=${KUBE_CONFIG} --namespace=${K8S_NAMESPACE} --validate=false"
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
