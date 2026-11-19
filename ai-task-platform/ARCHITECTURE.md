# AI Task Processing Platform – Architecture Documentation

## 1. Introduction

The AI Task Processing Platform is a full-stack distributed application designed to process user-submitted tasks asynchronously.

The platform uses React for the frontend, Node.js and Express.js for backend APIs, MongoDB for persistent storage, Redis for task queuing, and Python for background task execution.

The application is containerized using Docker and deployed on Kubernetes. Argo CD manages deployments using GitOps, while GitHub Actions automates the CI/CD pipeline.

**Note:** The platform currently performs rule-based text processing operations rather than using an external AI model.

## 2. High-Level System Architecture

The platform consists of the following major components:

- **Frontend:** React-based user interface for authentication, task creation, and result monitoring.
- **Backend:** Express.js REST API responsible for authentication, task management, and queue integration.
- **Database:** MongoDB Atlas stores users and task information.
- **Message Queue:** Redis stores pending task IDs.
- **Background Worker:** Python worker retrieves tasks from Redis and executes processing operations.
- **Containerization:** Docker packages application components into independent containers.
- **Orchestration:** Kubernetes manages deployments, services, networking, and application availability.
- **GitOps:** Argo CD continuously monitors Kubernetes manifests stored in a separate Git repository.
- **CI/CD:** GitHub Actions automates code checks, Docker image builds, publishing, and manifest updates.

### Architecture Diagram

```text
              USER
                |
                v
        React Frontend
                |
                v
        Node.js / Express
                |
          +-----+------+
          |            |
          v            v
       MongoDB       Redis
          ^            |
          |            v
          +------ Python Worker
                  |
                  v
             Process Task
                  |
                  v
             Update Result


          DEPLOYMENT LAYER

        Docker Containers
                |
                v
            Kubernetes
                |
                v
             Argo CD
                ^
                |
       Infrastructure Git Repo

       GitHub Actions CI/CD
                |
                v
          GitHub Container
              Registry
```

## 3. Application Workflow

### Step 1: User Authentication

Users register and log in through the React frontend. The backend verifies credentials and generates a JWT token for authenticated requests.

### Step 2: Task Creation

The user selects a processing operation and enters text. The frontend sends the task request to the Express backend.

### Step 3: Database Storage

The backend stores the task information in MongoDB with its initial processing status.

### Step 4: Redis Queue

The backend adds the task ID to the Redis task queue. Redis acts as the communication layer between the backend and the Python worker.

### Step 5: Background Processing

The Python worker listens to Redis using a blocking queue operation. When a task arrives, the worker retrieves its information from MongoDB and processes it.

Supported operations:

- Uppercase
- Lowercase
- Reverse String
- Word Count

### Step 6: Result Update

After processing, the worker updates the task status and result in MongoDB.

### Step 7: Frontend Result Display

The React dashboard periodically fetches task information and displays the updated status and result to the user.

## 4. Infrastructure and Deployment Architecture

### Docker

Docker is used to containerize the frontend, backend, and Python worker independently.

Redis is also deployed as a containerized service.

Docker Compose provides a way to run the application services together during local development and testing.

### Kubernetes

The application is deployed on a local Kubernetes cluster created using Kind.

Kubernetes resources include:

- Deployments for frontend, backend, worker, and Redis.
- Services for internal communication.
- ConfigMap for application configuration.
- Kubernetes Secret for sensitive environment variables.
- Ingress for external HTTP access.

Kubernetes manages container scheduling, health checks, and service communication.

### Argo CD and GitOps

A separate infrastructure repository stores Kubernetes YAML manifests.

Argo CD monitors this repository and automatically synchronizes changes with the Kubernetes cluster.

The application deployment was verified with:

- Sync Status: Synced
- Health Status: Healthy

## 5. CI/CD Pipeline Architecture

GitHub Actions automates the application build and deployment workflow.

The pipeline performs these steps:

1. Triggers when code is pushed to the main branch.
2. Checks out the application repository.
3. Installs Node.js and Python dependencies.
4. Performs backend syntax validation.
5. Runs frontend lint and production build checks.
6. Validates Python worker syntax.
7. Builds Docker images for frontend, backend, and worker.
8. Pushes images to GitHub Container Registry (GHCR).
9. Updates image tags in the infrastructure repository.
10. Argo CD detects the updated manifests and synchronizes Kubernetes deployments.

This workflow reduces manual deployment steps and maintains consistency between application code and infrastructure configuration.

## 6. Security and Configuration

The application uses the following security practices:

- JWT-based authentication.
- Password hashing using bcrypt.
- Environment variables for application configuration.
- Kubernetes Secrets for sensitive deployment configuration.
- Separate application and infrastructure repositories.
- GitHub Actions secrets for repository authentication.

Sensitive credentials are not stored in public source code.

## 7. Testing and Verification

The following functionality was verified:

- User registration and login.
- Task creation and management.
- Redis queue communication.
- Python background processing.
- MongoDB result updates.
- Docker container execution.
- Kubernetes deployment.
- Ingress-based application access.
- Argo CD synchronization and health.
- GitHub Actions CI/CD pipeline.

A word-count test using the input `aliya pagal hain` returned the result `3` with status `SUCCESS`.

## 8. Conclusion

The AI Task Processing Platform demonstrates a complete full-stack distributed application with asynchronous processing and modern DevOps practices.

The combination of React, Node.js, MongoDB, Redis, Python, Docker, Kubernetes, Argo CD, and GitHub Actions provides an automated workflow from task submission to background execution and deployment.

The project demonstrates practical implementation of containerization, orchestration, GitOps, and continuous integration and delivery.