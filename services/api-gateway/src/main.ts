import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
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

	// No need to connect to Kafka microservice with HTTP proxy

	// Setup Prometheus metrics
	const register = new promClient.Registry();
	promClient.collectDefaultMetrics({ register });

	// Expose metrics endpoint
	app.use("/metrics", (req, res) => {
		res.set("Content-Type", register.contentType);
		register.metrics().then((metrics) => res.end(metrics));
	});

	// No need to start microservices with HTTP proxy
	await app.listen(8080);
	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

