import { registerAs } from "@nestjs/config";
import { elasticsearchConfig } from "./elasticsearch.config";
import { kafkaConfig } from "./kafka.config";

export default registerAs("microservices", () => ({
	elasticsearch: elasticsearchConfig,
	kafka: kafkaConfig,
}));
