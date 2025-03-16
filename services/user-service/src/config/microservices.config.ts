import { registerAs } from "@nestjs/config";
import { grpcConfig } from "./grpc.config";
import { databaseConfig } from "./database.config";
import { kafkaConfig } from "./kafka.config";

export default registerAs("microservices", () => ({
	grpc: grpcConfig,
	database: databaseConfig,
	kafka: kafkaConfig,
}));
