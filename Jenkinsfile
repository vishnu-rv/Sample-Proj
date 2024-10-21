pipeline {
    agent any 

    environment {
        KUBE_CONFIG_FILE = '/var/lib/jenkins/Pipeline-kubeconfig.yaml'  // Path to your kubeconfig file
        K8S_NAMESPACE = 'my-proj'  // Use your target Kubernetes namespace
        DOCKER_IMAGE = 'your-docker-image:latest'  // Replace with your Docker image name
        DOCKER_CREDENTIALS_ID = 'your-docker-credentials-id'  // Your Docker registry credentials ID
        GIT_CREDENTIALS_ID = 'your-git-credentials-id'  // Your Git credentials ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Checkout your Git repository
                    git url: 'https://github.com/vishnu-rv/Sample-Proj.git', credentialsId: GIT_CREDENTIALS_ID
                }
            }
        }

        stage('Setup Kubeconfig') {
            steps {
                script {
                    // Create the kubeconfig directory if it does not exist
                    sh 'mkdir -p /var/lib/jenkins/.kube'
                    
                    // Copy the kubeconfig file to the appropriate location
                    sh "cp ${KUBE_CONFIG_FILE} /var/lib/jenkins/.kube/config"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Log in to Docker registry
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"
                    }

                    // Build the Docker image
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to the registry
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply your Kubernetes configuration
                    sh "kubectl apply -f deployment.yaml --kubeconfig=/var/lib/jenkins/.kube/config --namespace=${K8S_NAMESPACE} --validate=false"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
