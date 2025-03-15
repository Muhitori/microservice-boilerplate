# Microservice Boilerplate

A comprehensive microservice architecture boilerplate with NestJS, Kafka, Redis, PostgreSQL, and ELK stack.

## Services

- **API Gateway**: Entry point for all client requests
- **User Service**: Handles user management
- **Product Service**: Manages product data
- **Logger Service**: Centralized logging service

## Development Mode

This project supports both production and development modes using Docker Compose.

### Running in Development Mode

To start all services in development mode with hot-reloading:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This will:

- Mount your local code into the containers
- Enable hot-reloading with NestJS watch mode
- Expose debug ports for each service
- Install all dependencies (including dev dependencies)

### Debug Ports

- User Service: 9229
- Product Service: 9230
- Logger Service: 9231

### Running in Production Mode

To start all services in production mode:

```bash
docker-compose up
```

## Environment Variables

Copy the `.env.sample` file to `.env` and adjust the values as needed:

```bash
cp .env.sample .env
```

## Service URLs

- API Gateway: http://localhost:8080
- User Service: http://localhost:8081
- Product Service: http://localhost:8082
- Logger Service: http://localhost:8083
- Kibana: http://localhost:5601
- Grafana: http://localhost:9999
- Prometheus: http://localhost:9090
