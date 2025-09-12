import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { User } from "../entities/user.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [HealthController],
	providers: [HealthService],
	exports: [HealthService],
})
export class HealthModule {}
