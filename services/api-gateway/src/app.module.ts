import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import microservicesConfig from "./config/microservices.config";
import { HealthModule } from "./health/health.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
		}),
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				timeout: 5000,
				maxRedirects: 5,
			}),
			inject: [ConfigService],
		}),
		ConfigModule.forFeature(microservicesConfig),
		HealthModule,
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				baseURL: `http://${configService.get("microservices.user.host")}:${configService.get("microservices.user.port")}`,
				timeout: configService.get("microservices.user.timeout"),
				maxRedirects: configService.get("microservices.user.maxRedirects"),
				headers: {
					"Content-Type": "application/json",
				},
			}),
			inject: [ConfigService],
		}),
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				baseURL: `http://${configService.get("microservices.product.host")}:${configService.get("microservices.product.port")}`,
				timeout: configService.get("microservices.product.timeout"),
				maxRedirects: configService.get("microservices.product.maxRedirects"),
				headers: {
					"Content-Type": "application/json",
				},
			}),
			inject: [ConfigService],
		}),
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				baseURL: "http://logger-service:8083",
				timeout: 5000,
				maxRedirects: 5,
				headers: {
					"Content-Type": "application/json",
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: "USER_SERVICE",
			useFactory: () =>
				HttpModule.registerAsync({
					imports: [ConfigModule],
					useFactory: async (configService: ConfigService) => ({
						baseURL: `http://${configService.get("microservices.user.host")}:${configService.get("microservices.user.port")}`,
						timeout: configService.get("microservices.user.timeout"),
						maxRedirects: configService.get("microservices.user.maxRedirects"),
						headers: {
							"Content-Type": "application/json",
						},
					}),
					inject: [ConfigService],
				}),
		},
		{
			provide: "PRODUCT_SERVICE",
			useFactory: () =>
				HttpModule.registerAsync({
					imports: [ConfigModule],
					useFactory: async (configService: ConfigService) => ({
						baseURL: `http://${configService.get("microservices.product.host")}:${configService.get("microservices.product.port")}`,
						timeout: configService.get("microservices.product.timeout"),
						maxRedirects: configService.get(
							"microservices.product.maxRedirects"
						),
						headers: {
							"Content-Type": "application/json",
						},
					}),
					inject: [ConfigService],
				}),
		},
		{
			provide: "LOGGER_SERVICE",
			useFactory: () =>
				HttpModule.registerAsync({
					imports: [ConfigModule],
					useFactory: async (configService: ConfigService) => ({
						baseURL: "http://logger-service:8083",
						timeout: 5000,
						maxRedirects: 5,
						headers: {
							"Content-Type": "application/json",
						},
					}),
					inject: [ConfigService],
				}),
		},
	],
})
export class AppModule {}

