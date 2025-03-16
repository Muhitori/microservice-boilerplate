import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { HealthModule } from "./health/health.module";
import { join } from "path";

@Module({
	imports: [
		// gRPC Server Configuration
		ClientsModule.register([
			{
				name: "GRPC_SERVICE",
				transport: Transport.GRPC,
				options: {
					package: "service",
					protoPath: join(__dirname, "proto/service.proto"),
					url: `${process.env.USER_SERVICE_HOST || "0.0.0.0"}:${process.env.USER_SERVICE_PORT || 50051}`,
				},
			},
			{
				name: "LOGGER_SERVICE",
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: "user-logger",
						brokers: process.env.KAFKA_BROKERS?.split(",") || ["kafka:9092"],
					},
					consumer: {
						groupId: "user-logger-consumer",
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
			entities: [User],
			synchronize: process.env.NODE_ENV !== "production",
			migrationsRun: process.env.NODE_ENV === "production",
			migrations: [__dirname + "/migrations/**/*.js"],
			migrationsTableName: "migrations",
		}),
		TypeOrmModule.forFeature([User]),
		HealthModule,
	],
	controllers: [UserController],
	providers: [UserService],
})
export class AppModule {}

