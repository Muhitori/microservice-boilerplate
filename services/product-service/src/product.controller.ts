import { Controller, Logger, Inject, OnModuleInit } from "@nestjs/common";
import { MessagePattern, Payload, ClientKafka } from "@nestjs/microservices";
import { ProductService } from "./product.service";

@Controller()
export class ProductController implements OnModuleInit {
	private readonly logger = new Logger(ProductController.name);

	constructor(
		private readonly productService: ProductService,
		@Inject("LOGGER_SERVICE") private readonly loggerClient: ClientKafka
	) {}

	async onModuleInit() {
		// Connect to Kafka client
		await this.loggerClient.connect();
	}

	@MessagePattern("get.products")
	async getProducts(): Promise<any[]> {
		this.logger.log("Received get.products request");

		// Log this request
		this.loggerClient.emit("log.info", {
			service: "product-service",
			type: "info",
			message: "Get all products request processed",
			timestamp: new Date().toISOString(),
		});

		return this.productService.findAll();
	}

	@MessagePattern("get.product")
	async getProduct(@Payload() data: { id: string }): Promise<any> {
		this.logger.log(`Received get.product request for ID: ${data.id}`);

		// Log this request
		this.loggerClient.emit("log.info", {
			service: "product-service",
			type: "info",
			message: `Get product request processed for ID: ${data.id}`,
			timestamp: new Date().toISOString(),
		});

		return this.productService.findOne(data.id);
	}

	@MessagePattern("create.product")
	async createProduct(@Payload() data: any): Promise<any> {
		this.logger.log("Received create.product request");

		try {
			const result = await this.productService.create(data);

			// Log successful product creation
			this.loggerClient.emit("log.info", {
				service: "product-service",
				type: "info",
				message: `Product created successfully: ${result.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "product-service",
				type: "error",
				message: `Failed to create product: ${error.message}`,
				timestamp: new Date().toISOString(),
			});

			throw error;
		}
	}

	@MessagePattern("update.product")
	async updateProduct(
		@Payload() data: { id: string; productData: any }
	): Promise<any> {
		this.logger.log(`Received update.product request for ID: ${data.id}`);

		try {
			const result = await this.productService.update(
				data.id,
				data.productData
			);

			// Log successful product update
			this.loggerClient.emit("log.info", {
				service: "product-service",
				type: "info",
				message: `Product updated successfully: ${data.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "product-service",
				type: "error",
				message: `Failed to update product: ${error.message}`,
				timestamp: new Date().toISOString(),
			});

			throw error;
		}
	}

	@MessagePattern("delete.product")
	async deleteProduct(@Payload() data: { id: string }): Promise<any> {
		this.logger.log(`Received delete.product request for ID: ${data.id}`);

		try {
			const result = await this.productService.remove(data.id);

			// Log successful product deletion
			this.loggerClient.emit("log.info", {
				service: "product-service",
				type: "info",
				message: `Product deleted successfully: ${data.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "product-service",
				type: "error",
				message: `Failed to delete product: ${error.message}`,
				timestamp: new Date().toISOString(),
			});

			throw error;
		}
	}
}
