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
                        // Set up Git credentials for the session
                        sh "git config --global credential.helper store"
                        
                        // Store the credentials in the Git config for future use
                        sh """
                            echo "https://${GIT_USER}:${GIT_PASS}@github.com" > ~/.git-credentials
                            git config --global credential.helper 'store --file=~/.git-credentials'
                        """
                        
                        // Clone the repository
                        sh "git clone https://github.com/vishnu-rv/Sample-Proj.git"
                    }
                }
            }
        }

        stage('List Directory') {
            steps {
                script {
                    // List the contents of the Sample-Proj directory to verify the Dockerfile is present
                    sh "ls -la Sample-Proj"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def versionNumber = getNextVersion() // Get the next version number
                    def imageTag = "${DOCKER_IMAGE}:v${versionNumber}" // Tag with version
                    
                    // Ensure Dockerfile path is correct
                    sh "docker build -t ${imageTag} -f Sample-Proj/Dockerfile Sample-Proj" // Update path if necessary
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    def latestTag = "${DOCKER_IMAGE}:latest"
                    def versionTag = "${DOCKER_IMAGE}:v${getNextVersion() - 1}" // Tag for latest built version

                    // Push both versioned and latest images
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker push ${versionTag}" // Push the versioned tag
                        sh "docker tag ${versionTag} ${latestTag}" // Tag the latest image
                        sh "docker push ${latestTag}" // Push the latest tag
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

// Function to get the next version number
def getNextVersion() {
    def versionFile = 'version.txt'
    def currentVersion = 0

    if (fileExists(versionFile)) {
        currentVersion = readFile(versionFile).trim().toInteger()
    }

    def nextVersion = currentVersion + 1
    writeFile file: versionFile, text: "${nextVersion}"

    return nextVersion
}
