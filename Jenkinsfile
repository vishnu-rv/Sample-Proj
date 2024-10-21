pipeline {
    agent any 

    environment {
        KUBE_CONFIG_ID = 'your-kubeconfig-secret-id'  // Replace with your kubeconfig secret ID
        K8S_NAMESPACE = 'my-proj'                      // Replace with your target Kubernetes namespace
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Checkout your Git repository
                    git url: 'https://github.com/vishnu-rv/Sample-Proj.git', credentialsId: 'your-git-credentials-id' // Replace with your Git credentials ID
                }
            }
        }

        stage('Setup Kubeconfig') {
            steps {
                script {
                    // Retrieve the kubeconfig secret and save it
                    withCredentials([file(credentialsId: KUBE_CONFIG_ID, variable: 'KUBE_CONFIG_FILE')]) {
                        // Create the directory if it does not exist and copy the kubeconfig
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
                    // Apply your Kubernetes configuration
                    sh "kubectl apply -f deployment.yaml --kubeconfig=~/.kube/config --namespace=${K8S_NAMESPACE} --validate=false"
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    // Docker login (make sure to replace the credentials ID)
                    withCredentials([usernamePassword(credentialsId: 'your-docker-credentials-id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        """
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Build your Docker image
                    sh "docker build -t your-docker-image-name:latest ."  // Replace with your Docker image name
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    // Push the Docker image to your Docker registry
                    sh "docker push your-docker-image-name:latest"  // Replace with your Docker image name
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
