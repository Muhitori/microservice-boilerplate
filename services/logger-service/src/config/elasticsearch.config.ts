import { registerAs } from "@nestjs/config";

export const elasticsearchConfig = {
	node: process.env.ELASTICSEARCH_NODE || "http://elasticsearch:9200",
};

export default registerAs("elasticsearch", () => elasticsearchConfig);
