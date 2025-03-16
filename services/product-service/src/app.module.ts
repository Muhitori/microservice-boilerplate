import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";
import { join } from "path";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "GRPC_SERVICE",
				transport: Transport.GRPC,
				options: {
					package: "service",
					protoPath: join(__dirname, "proto/service.proto"),
					url: `${process.env.PRODUCT_SERVICE_HOST || "0.0.0.0"}:${process.env.PRODUCT_SERVICE_PORT || 50052}`,
				},
			},
			{
				name: "LOGGER_SERVICE",
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: "product-logger",
						brokers: process.env.KAFKA_BROKERS?.split(",") || ["kafka:9092"],
					},
					consumer: {
						groupId: "product-logger-consumer",
					},
				},
			},
		]),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.DB_HOST,
			port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.USER_SERVICE_DB,
			entities: [Product],
			synchronize: process.env.NODE_ENV !== "production",
			migrationsRun: process.env.NODE_ENV === "production",
			migrations: [__dirname + "/migrations/**/*.js"],
			migrationsTableName: "migrations",
		}),
		TypeOrmModule.forFeature([Product]),
	],
	controllers: [ProductController],
	providers: [ProductService],
})
export class AppModule {}

