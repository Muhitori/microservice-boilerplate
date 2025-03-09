import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as promClient from "prom-client";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable CORS
	app.enableCors();

	// Setup Swagger documentation
	const config = new DocumentBuilder()
		.setTitle("API Gateway")
		.setDescription("API Gateway for microservices architecture")
		.setVersion("1.0")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

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
				groupId: "api-gateway-consumer",
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
	await app.listen(8080);
	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

