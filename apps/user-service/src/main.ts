import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as promClient from 'prom-client';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect to Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
        retry: {
          initialRetryTime: 1000,
          retries: 10,
          maxRetryTime: 60000,
        },
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'service',
      protoPath: join(__dirname, 'proto/service.proto'),
      url: `0.0.0.0:${process.env.USER_SERVICE_GRPC_PORT}`,
    },
  });

  // Setup Prometheus metrics
  const register = new promClient.Registry();
  promClient.collectDefaultMetrics({ register });

  // Expose metrics endpoint
  app.use('/metrics', (req, res) => {
    res.set('Content-Type', register.contentType);
    register.metrics().then((metrics) => res.end(metrics));
  });

  // Start all microservices
  await app.startAllMicroservices();

  // Start HTTP server
  await app.listen(process.env.USER_SERVICE_PORT || 8081);
}

bootstrap();
