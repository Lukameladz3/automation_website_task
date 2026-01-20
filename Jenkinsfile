pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.57.0-noble'
        }
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
    }

    environment {
        // Ensure pnpm is available in the path if installed via npm
        PATH = "${HOME}/.local/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                echo 'Setting up environment...'
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                echo 'Running lint...'
                sh 'npm run lint'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo 'Running tests...'
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            echo 'Archiving test reports...'
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            
            // Requires "HTML Publisher" plugin
            // publishHTML(target: [
            //     allowMissing: false,
            //     alwaysLinkToLastBuild: true,
            //     keepAll: true,
            //     reportDir: 'playwright-report',
            //     reportFiles: 'index.html',
            //     reportName: 'Playwright HTML Report'
            // ])
        }
        failure {
            echo 'Pipeline failed. Please check the logs and artifacts.'
        }
    }
}
