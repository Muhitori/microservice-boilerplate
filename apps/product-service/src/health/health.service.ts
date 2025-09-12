import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";

@Injectable()
export class HealthService {
	private readonly logger = new Logger(HealthService.name);

	constructor(
		@InjectRepository(Product)
		private productsRepository: Repository<Product>
	) {}

	async checkHealth(): Promise<{ status: string; timestamp: string }> {
		this.logger.log("Health check requested");
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
		};
	}

	async checkDbConnection(): Promise<{ database: boolean; timestamp: string }> {
		try {
			// Try to query the database to check connection
			await this.productsRepository.query("SELECT 1");
			this.logger.log("Database connection check: successful");
			return {
				database: true,
				timestamp: new Date().toISOString(),
			};
		} catch (error) {
			this.logger.error(`Database connection check failed: ${error.message}`);
			return {
				database: false,
				timestamp: new Date().toISOString(),
			};
		}
	}
}
