pipeline {
    agent any 

    environment {
        DOCKER_CREDENTIALS_ID = '54976742-d291-4757-b697-a1c1e178da6c'
        GIT_CREDENTIALS_ID = '2f7d41dd-0dc6-4cc6-9a41-b07a9b72b2b1'
        DOCKER_IMAGE = 'vishnu2117/devops-proj-1'
        K8S_NAMESPACE = 'my-proj' // Added the namespace variable
        K8S_DEPLOYMENT = 'my-devops-proj'
        K8S_SERVICE = 'devops-service'
        KUBE_CONFIG_ID = '9a294acd-a907-466c-bab7-36e33053cf4b' // Secret ID for kubeconfig
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Clean up the workspace before cloning
                    sh "rm -rf Sample-Proj" // Remove existing directory
                    withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh """
                            git config --global credential.helper store
                            echo "https://${GIT_USER}:${GIT_PASS}@github.com" > ~/.git-credentials
                        """
                        // Clone the repository
                        sh "git clone https://github.com/vishnu-rv/Sample-Proj.git"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Login to Docker Hub and push the image
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Setup Kubeconfig') {
            steps {
                script {
                    // Retrieve the kubeconfig secret and save it
                    withCredentials([file(credentialsId: KUBE_CONFIG_ID, variable: 'KUBE_CONFIG_FILE')]) {
                        sh """
                            mkdir -p ~/.kube
                            cp ${KUBE_CONFIG_FILE} ~/.kube/config
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Check if the kubeconfig file exists
                    sh "ls -la ~/.kube/config"
                    // Apply the deployment YAML
                    sh "kubectl apply -f deployment.yaml --kubeconfig=~/.kube/config --namespace=${K8S_NAMESPACE} --validate=false"
                    // Apply the service YAML
                    sh "kubectl apply -f service.yaml --kubeconfig=~/.kube/config --namespace=${K8S_NAMESPACE} --validate=false"
                }
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
