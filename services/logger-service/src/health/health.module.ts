import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
	imports: [
		ElasticsearchModule.register({
			node: process.env.ELASTICSEARCH_NODE || "http://elasticsearch:9200",
		}),
	],
	controllers: [HealthController],
	providers: [HealthService],
	exports: [HealthService],
})
export class HealthModule {}
