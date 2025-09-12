import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	@ApiOperation({ summary: "Get health status of all services" })
	@ApiResponse({
		status: 200,
		description: "Return health status of all services",
	})
	async getHealth() {
		return this.healthService.checkAllServices();
	}

	@Get("user")
	@ApiOperation({ summary: "Get health status of user service" })
	@ApiResponse({
		status: 200,
		description: "Return health status of user service",
	})
	async getUserServiceHealth() {
		return { health: await this.healthService.checkUserService() };
	}

	@Get("product")
	@ApiOperation({ summary: "Get health status of product service" })
	@ApiResponse({
		status: 200,
		description: "Return health status of product service",
	})
	async getProductServiceHealth() {
		return { health: await this.healthService.checkProductService() };
	}
}
