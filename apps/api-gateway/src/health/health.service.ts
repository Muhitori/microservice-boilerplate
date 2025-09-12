import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom, map, of } from "rxjs";

@Injectable()
export class HealthService {
	private readonly logger = new Logger(HealthService.name);

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {}

	async checkUserService(): Promise<boolean> {
		const userServiceUrl = `http://${this.configService.get("microservices.user.host")}:${this.configService.get("microservices.user.port")}`;

		try {
			const health = await firstValueFrom(
				this.httpService.get(`${userServiceUrl}/health`).pipe(
					map(() => true),
					catchError((error) => {
						this.logger.error(
							`User service health check failed: ${error.message}`
						);
						return of(false);
					})
				)
			);
			return health;
		} catch (error) {
			this.logger.error(`User service health check failed: ${error.message}`);
			return false;
		}
	}

	async checkProductService(): Promise<boolean> {
		const productServiceUrl = `http://${this.configService.get("microservices.product.host")}:${this.configService.get("microservices.product.port")}`;

		try {
			const health = await firstValueFrom(
				this.httpService.get(`${productServiceUrl}/health`).pipe(
					map(() => true),
					catchError((error) => {
						this.logger.error(
							`Product service health check failed: ${error.message}`
						);
						return of(false);
					})
				)
			);
			return health;
		} catch (error) {
			this.logger.error(
				`Product service health check failed: ${error.message}`
			);
			return false;
		}
	}

	async checkAllServices(): Promise<{ user: boolean; product: boolean }> {
		const [userHealth, productHealth] = await Promise.all([
			this.checkUserService(),
			this.checkProductService(),
		]);

		return {
			user: userHealth,
			product: productHealth,
		};
	}
}
