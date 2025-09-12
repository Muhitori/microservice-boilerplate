import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { FrontendLogDto } from './dto/frontend-log.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('logs')
  @HttpCode(HttpStatus.OK)
  async createFrontendLog(@Body() logDto: FrontendLogDto): Promise<any> {
    const topic = `log.${logDto.level}`;
    return this.appService.handleLog(topic, {
      message: logDto.message,
      service: logDto.service || 'frontend',
      context: logDto.context || {},
      metadata: logDto.metadata || {},
    });
  }

  @MessagePattern('log.info')
  async handleInfoLog(@Payload() message: any): Promise<any> {
    return this.appService.handleLog('log.info', message);
  }

  @MessagePattern('log.error')
  async handleErrorLog(@Payload() message: any): Promise<any> {
    return this.appService.handleLog('log.error', message);
  }

  @MessagePattern('log.debug')
  async handleDebugLog(@Payload() message: any): Promise<any> {
    return this.appService.handleLog('log.debug', message);
  }

  @MessagePattern('log.warn')
  async handleWarnLog(@Payload() message: any): Promise<any> {
    return this.appService.handleLog('log.warn', message);
  }
}
