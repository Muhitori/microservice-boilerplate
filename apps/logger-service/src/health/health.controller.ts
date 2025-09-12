import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as promClient from 'prom-client';
import { Response } from 'express';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly register: promClient.Registry;
  private readonly upGauge: promClient.Gauge;

  constructor() {
    // Create a new registry for health metrics
    this.register = new promClient.Registry();

    // Create an up gauge to indicate service status (1 = up, 0 = down)
    this.upGauge = new promClient.Gauge({
      name: 'logger_service_up',
      help: 'Indicates if the Logger Service is up (1) or down (0)',
      registers: [this.register],
    });

    // Set the service as up
    this.upGauge.set(1);

    // Add default metrics to the registry
    promClient.collectDefaultMetrics({ register: this.register });
  }

  @Get()
  @ApiOperation({
    summary: 'Simple health check endpoint with Prometheus metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Logger Service is running with Prometheus metrics',
  })
  async healthCheck(@Res() response: Response) {
    // Set Prometheus content type
    response.set('Content-Type', this.register.contentType);

    // Get metrics and send them as the response
    const metrics = await this.register.metrics();
    response.send(metrics);
  }
}
