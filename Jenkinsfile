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
                script {
                    // Clean workspace to prevent conflicts
                    cleanWs()
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    // Checkout the code from GitHub
                    checkout([$class: 'GitSCM', 
                        branches: [[name: '*/main']], // Change to your branch name
                        userRemoteConfigs: [[url: 'https://github.com/vishnu-rv/Demo.git', credentialsId: GIT_CREDENTIALS_ID]]
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Build Docker image and tag it as v1
                    docker.build("${DOCKER_IMAGE}:v1")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Log in to Docker Hub and push the image
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image("${DOCKER_IMAGE}:v1").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Set Kubeconfig and deploy to Kubernetes
                    withCredentials([file(credentialsId: KUBE_CONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                        sh '''
                        kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_DEPLOYMENT}=${DOCKER_IMAGE}:v1 -n ${K8S_NAMESPACE}
                        kubectl rollout status deployment/${K8S_DEPLOYMENT} -n ${K8S_NAMESPACE}
                        '''
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
