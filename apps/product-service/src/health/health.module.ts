import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { Product } from "../entities/product.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Product])],
	controllers: [HealthController],
	providers: [HealthService],
	exports: [HealthService],
})
export class HealthModule {}
