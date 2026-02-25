pipeline {
    agent { label 'vm-local' }

    stages {
        stage('Cleanup') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Spokay/tp-efrei-pipelines-2.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t registry.spokayhub.top/api-nodejs-example:latest .'
            }
        }
        stage('Push') {
            steps {
                  withDockerRegistry(credentialsId: 'spokay-registry-credentials', url: 'https://registry.spokayhub.top/') {
                        sh 'docker push registry.spokayhub.top/api-nodejs-example:latest'
                  }
            }
        }
        stage('Deploy') {
            steps {
                sshagent(credentials: ['azure-ssh-credentials']) {
                    withCredentials([usernamePassword(credentialsId: 'spokay-registry-credentials', usernameVariable: 'REGISTRY_USER', passwordVariable: 'REGISTRY_PASS')]) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no azureuser@74.234.235.112 "
                                echo $REGISTRY_PASS | docker login registry.spokayhub.top -u $REGISTRY_USER --password-stdin &&
                                docker pull registry.spokayhub.top/api-nodejs-example:latest &&
                                docker rm -f api-nodejs || true &&
                                docker run -d -p 8080:8080 --name api-nodejs --env-file=.env registry.spokayhub.top/api-nodejs-example:latest
                            "
                        '''
                    }
                }
            }
        }
    }
}
