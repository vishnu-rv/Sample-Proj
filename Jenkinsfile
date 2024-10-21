pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = '54976742-d291-4757-b697-a1c1e178da6c'
        GIT_CREDENTIALS_ID = '6881cda4-f7d0-444e-8f4d-3ec3ae05f9de' // Updated ID
        KUBE_CONFIG_CREDENTIALS_ID = '9a294acd-a907-466c-bab7-36e33053cf4b'
        DOCKER_IMAGE = 'vishnu2117/devops-proj-1'
        K8S_NAMESPACE = 'my-proj'
        K8S_DEPLOYMENT = 'my-devops-proj'
        K8S_SERVICE = 'devops-service'
    }

    stages {
        stage('Cleanup') {
            steps {
                // Cleanup steps (if any)
            }
        }

        stage('Checkout') {
            steps {
                script {
                    checkout([$class: 'GitSCM', 
                        branches: [[name: '*/main']], // Adjust to your branch if necessary
                        userRemoteConfigs: [[url: 'https://github.com/vishnu-rv/Demo.git', credentialsId: GIT_CREDENTIALS_ID]]
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                // Your build steps here (e.g., building Docker image)
                script {
                    sh 'docker build -t ${DOCKER_IMAGE}:v1 .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                        sh 'docker push ${DOCKER_IMAGE}:v1'
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
            // Clean up workspace if needed
            cleanWs()
        }
    }
}
