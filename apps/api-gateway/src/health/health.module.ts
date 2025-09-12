import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [HealthController],
})
export class HealthModule {}
