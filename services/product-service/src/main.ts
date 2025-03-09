import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as promClient from "prom-client";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Connect to Kafka microservice
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: process.env.KAFKA_BROKERS.split(","),
				retry: {
					initialRetryTime: 1000, // Start with 1 second delay
					retries: 10, // Max 10 retries
					maxRetryTime: 60000, // Max 60 seconds total
				},
			},
			consumer: {
				groupId: "product-service-consumer",
			},
		},
	});

	// Setup Prometheus metrics
	const register = new promClient.Registry();
	promClient.collectDefaultMetrics({ register });

	// Expose metrics endpoint
	app.use("/metrics", (req, res) => {
		res.set("Content-Type", register.contentType);
		register.metrics().then((metrics) => res.end(metrics));
	});

	await app.startAllMicroservices();
	await app.listen(8082); // Different port than API Gateway and User Service
	console.log(`Product Service is running on: ${await app.getUrl()}`);
}

bootstrap();

