// Your TypeORM data source configuration
import { DataSource } from "typeorm";

export default new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.PRODUCT_SERVICE_DB,
	entities: ["src/**/*.entity.ts"],
	migrations: ["src/migrations/*.ts"],
});
