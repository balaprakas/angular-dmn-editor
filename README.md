# Business Central Alternative

A lightweight, open-source Business Central alternative for non-technical business users, built with Angular 17+ and Spring Boot 3+.

## Features

- **BPMN Workflow Editor**: Visual workflow designer using bpmn-js
- **DMN Decision Editor**: Decision table editor using dmn-js  
- **DRL Rules Editor**: Business rules editor using Monaco Editor
- **Material Design UI**: Responsive Angular Material interface
- **Execution Engine**: Drools 8 runtime for DMN/DRL execution
- **In-Memory Storage**: Simple MVP storage without database persistence
- **Tomcat Deployment**: WAR packaging for enterprise deployment
- **Docker Support**: Containerized for OpenShift deployment

## Architecture

- **Frontend**: Angular 17+ with Angular Material, bpmn-js, dmn-js, Monaco Editor
- **Backend**: Spring Boot 3+ (Java 17) packaged as WAR for Tomcat
- **Runtime**: Drools 8 for business rules and decision execution
- **Storage**: In-memory (no database required for MVP)
- **Deployment**: Docker container with Tomcat + application WAR

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+
- Docker (for containerized deployment)

### Local Development

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend runs on http://localhost:8080/business-central

2. **Start Frontend**:
   ```bash
   cd frontend/business-central-frontend
   npm install
   npm start
   ```
   Frontend runs on http://localhost:4200

### Docker Deployment

1. **Build and Package**:
   ```bash
   # Build backend WAR
   cd backend
   mvn clean package -DskipTests
   
   # Build frontend
   cd ../frontend/business-central-frontend
   npm run build
   ```

2. **Docker Build**:
   ```bash
   cd ../..
   docker build -t business-central-alternative .
   ```

3. **Run Container**:
   ```bash
   docker run -p 8080:8080 business-central-alternative
   ```
   
   Or use Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. **Access Application**:
   - Frontend: http://localhost:8080/
   - Backend API: http://localhost:8080/business-central/api/

## API Endpoints

### Model Assets
- `GET /api/assets` - List all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/{id}` - Get asset by ID
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset
- `POST /api/assets/{id}/validate` - Validate asset

### Execution
- `POST /api/execute` - Execute BPMN/DMN/DRL asset

## User Workflow

1. **Create Assets**: Use the Material dashboard to create BPMN workflows, DMN decisions, or DRL rules
2. **Edit Models**: Visual editors for each asset type with source code view
3. **Validate**: Built-in validation for syntax and structure
4. **Execute**: Run workflows and rules with input data to see results
5. **Manage**: View, edit, delete assets from the dashboard

## OpenShift Deployment

The Docker image can be deployed to OpenShift:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: business-central-alternative
spec:
  replicas: 1
  selector:
    matchLabels:
      app: business-central-alternative
  template:
    metadata:
      labels:
        app: business-central-alternative
    spec:
      containers:
      - name: business-central
        image: business-central-alternative:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: business-central-service
spec:
  selector:
    app: business-central-alternative
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
```

## Technology Stack

- **Frontend**: Angular 17, Angular Material, TypeScript, SCSS
- **Editors**: bpmn-js, dmn-js, Monaco Editor
- **Backend**: Spring Boot 3.1.5, Java 17, Maven
- **Rules Engine**: Drools 8.44.0.Final
- **Server**: Apache Tomcat 10.1
- **Containerization**: Docker, Docker Compose
- **Deployment**: OpenShift compatible

## License

Open Source - MIT License
