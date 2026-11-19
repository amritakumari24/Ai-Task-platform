# AI Task Processing Platform

A full-stack task processing platform built using the MERN stack, Redis, Python, Docker, Kubernetes, Argo CD, and GitHub Actions.

## 1. Project Overview

The AI Task Processing Platform is a distributed application that allows users to submit tasks and process them asynchronously in the background.

Users can create tasks through a React-based dashboard. The Node.js backend stores task information in MongoDB and adds processing jobs to a Redis queue. A Python worker retrieves tasks from Redis, processes them, and updates the results in MongoDB.

**Note:** This project implements rule-based text processing operations and does not currently integrate an external AI model or API.

## 2. Features

- User registration and login using JWT authentication.
- Create and manage processing tasks.
- Four text processing operations:
  - Uppercase
  - Lowercase
  - Reverse String
  - Word Count
- Asynchronous task processing using Redis.
- Background processing using a Python worker.
- Task status tracking and result display.
- MongoDB database integration.
- Docker containerization.
- Kubernetes deployment.
- Argo CD GitOps-based deployment management.
- GitHub Actions CI/CD automation.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Queue | Redis |
| Background Worker | Python |
| Authentication | JWT, bcrypt |
| Containerization | Docker |
| Orchestration | Kubernetes, Kind |
| GitOps | Argo CD |
| CI/CD | GitHub Actions |
| Container Registry | GitHub Container Registry (GHCR) |

## 4. System Architecture

1. The user logs in and creates a task through the React frontend.
2. The Express backend validates the request.
3. Task information is stored in MongoDB.
4. The backend adds the task ID to the Redis queue.
5. The Python worker retrieves the task from Redis.
6. The worker performs the requested operation.
7. The result and task status are updated in MongoDB.
8. The frontend displays the updated status and result.

## 5. Repository Structure

The project uses a separate application repository and infrastructure repository.

### Application Repository

```text
Ai-Task-platform/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── ai-task-platform/
    ├── backend/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── Dockerfile
    │   └── server.js
    ├── frontend/
    │   ├── src/
    │   ├── Dockerfile
    │   └── package.json
    ├── worker/
    │   ├── worker.py
    │   ├── requirements.txt
    │   └── Dockerfile
    └── docker-compose.yml
```

### Infrastructure Repository

```text
ai-task-platform-infra/
└── k8s/
    ├── backend.yaml
    ├── frontend.yaml
    ├── worker.yaml
    ├── redis.yaml
    ├── configmap.yaml
    └── ingress.yaml
```

## 6. Local Setup

### Prerequisites

- Node.js 20+
- Python 3.12+
- MongoDB Atlas account
- Redis
- Docker and Docker Compose

### Backend Setup

```bash
cd ai-task-platform/backend
npm install
```

Create a `.env` file with the required configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd ai-task-platform/frontend
npm install
npm run dev
```

### Python Worker Setup

```bash
cd ai-task-platform/worker
pip install -r requirements.txt
python worker.py
```

Ensure Redis and MongoDB are running and the backend and worker have the correct environment configuration.

## 7. Docker Deployment

The application services are containerized using separate Dockerfiles.

Start the services using Docker Compose:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

Stop the services:

```bash
docker compose down
```

## 8. Kubernetes Deployment

The application is deployed on a local Kubernetes cluster created using Kind.

The Kubernetes deployment includes:

- Backend Deployment and Service
- Frontend Deployment and Service
- Python Worker Deployment
- Redis Deployment and Service
- ConfigMap and Kubernetes Secret
- Ingress configuration

Check Kubernetes resources:

```bash
kubectl get pods -n ai-task-platform
kubectl get services -n ai-task-platform
kubectl get deployments -n ai-task-platform
```

## 9. GitOps with Argo CD

Argo CD is used to manage Kubernetes deployments through GitOps.

The infrastructure repository stores Kubernetes manifests. Argo CD monitors the repository and synchronizes changes with the Kubernetes cluster.

**Verified deployment status:**
- Sync Status: Synced
- Health Status: Healthy

## 10. CI/CD Pipeline

GitHub Actions automates the build and deployment workflow.

Pipeline steps:

1. Trigger on push to the main branch.
2. Install Node.js and Python dependencies.
3. Run backend syntax checks.
4. Run frontend lint and build checks.
5. Compile-check the Python worker.
6. Build Docker images.
7. Push images to GitHub Container Registry.
8. Update image tags in the infrastructure repository.
9. Argo CD detects the manifest changes and synchronizes the deployment.

## 11. Testing

The application was tested with the following operations:

| Input | Operation | Expected Result | Status |
|---|---|---|---|
| hello | Uppercase | HELLO | SUCCESS |
| heloo | Lowercase | heloo | SUCCESS |
| hello | Reverse | olleh | SUCCESS |
| hello | Word Count | 1 | SUCCESS |

The end-to-end task processing flow was verified successfully.

## 12. Application Access

The application is accessible locally through the Kubernetes Ingress:

**URL:** http://ai-task.local:8080

This URL requires the local Kind cluster, Ingress controller, port-forwarding, and host configuration to be running. It is not a publicly hosted URL.

## 13. GitHub Repositories

- Application Repository: https://github.com/amritakumari24/Ai-Task-platform
- Infrastructure Repository: https://github.com/amritakumari24/ai-task-platform-infra

## 14. Conclusion

The AI Task Processing Platform demonstrates a complete full-stack application with asynchronous background processing and modern DevOps practices.

It combines React, Node.js, MongoDB, Redis, and Python with Docker, Kubernetes, Argo CD, and GitHub Actions to provide an automated and scalable task processing workflow.

The project successfully demonstrates containerization, orchestration, GitOps, and CI/CD automation.