import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";

@Module({
	imports: [
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

