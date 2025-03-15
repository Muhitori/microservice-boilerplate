import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { HealthService } from "./health.service";

@Controller()
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@MessagePattern("health.check")
	async getHealth() {
		return this.healthService.checkHealth();
	}

	@MessagePattern("health.elasticsearch")
	async getElasticsearchHealth() {
		return this.healthService.checkElasticsearchConnection();
	}
}
