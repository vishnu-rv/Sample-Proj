pipeline {
    agent any 

    environment {
        DOCKER_CREDENTIALS_ID = '54976742-d291-4757-b697-a1c1e178da6c'
        GIT_CREDENTIALS_ID = '2f7d41dd-0dc6-4cc6-9a41-b07a9b72b2b1'
        KUBE_CONFIG_CREDENTIALS_ID = '9a294acd-a907-466c-bab7-36e33053cf4b'
        DOCKER_IMAGE = 'vishnu2117/devops-proj-1'
        K8S_NAMESPACE = 'my-proj'
        K8S_DEPLOYMENT = 'my-devops-proj'
        K8S_SERVICE = 'devops-service'
    }

    stages {
        stage('Cleanup') {
            steps {
                cleanWs() // Clean the workspace to avoid conflicts
            }
        }
        
        stage('Checkout') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        // Clone the repository
                        sh "git clone https://github.com/vishnu-rv/Sample-Proj.git"
                    }
                }
            }
        }

        stage('List Directory Structure') {
            steps {
                script {
                    // List the contents of the workspace to verify the repository was cloned correctly
                    sh "ls -la" // List everything in the current workspace
                    sh "ls -la Sample-Proj" // List contents specifically in the Sample-Proj directory
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image, assuming the Dockerfile is at the root of Sample-Proj
                    sh "docker build -t ${DOCKER_IMAGE}:v1 -f Sample-Proj/Dockerfile Sample-Proj"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker push ${DOCKER_IMAGE}:v1" // Push the Docker image
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: KUBE_CONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                        sh "kubectl apply -f deployment.yaml --namespace=${K8S_NAMESPACE} --validate=false"
                        sh "kubectl apply -f service.yaml --namespace=${K8S_NAMESPACE} --validate=false"
                    }
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
