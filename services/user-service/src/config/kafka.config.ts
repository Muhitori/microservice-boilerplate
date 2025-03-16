import { registerAs } from "@nestjs/config";

export const kafkaConfig = {
	brokers: process.env.KAFKA_BROKERS?.split(",") || ["kafka:9092"],
	clientId: "user-logger",
	consumerGroupId: "user-logger-consumer",
};

export default registerAs("kafka", () => kafkaConfig);
