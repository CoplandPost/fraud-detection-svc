pipeline {
        agent any
          tools {nodejs "NodeJS"}
         
        options {
            ansiColor('xterm')
        }
        stages {
                stage('Init') {
                        steps {
                                slackSend (color: '#3498db', message: "Starging the job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
                        }
                }
                stage('Installing Dependences') {
                    steps {
                        sh 'rm -rf node_modules package-lock.json'
                        sh 'npm i --legacy-peer-deps --unsafe-perm'
                    }
                }
                stage('Testing') {
                        steps {
                            sh 'npm run test:ci'
                        }
                }
                stage('Building') {
                    steps {
                        sh 'npm run build'
                    }
                }
                stage('Deploying') {
                    steps {
                       sh 'cp package.json dist'
                        sh 'scp -r -o StrictHostKeyChecking=no -i /key/jenkins dist root@svcap16-container:/usr/src/app'
                        sh '''ssh -i /key/jenkins -o StrictHostKeyChecking=no root@svcap16-container<<- _EOF_
                                cd /usr/src/app
                                npm install --production --legacy-peer-deps
                                npx pm2 restart all
                                exit 0
                           _EOF_'''
                    }
                }
        }
        post {
            success {
                slackSend (color: '#00FF00', message: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
            }
            failure {
                slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
            }
        }
}
