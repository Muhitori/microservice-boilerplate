import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
  DEBUG = 'debug',
  WARN = 'warn',
}

export class FrontendLogDto {
  @IsEnum(LogLevel)
  level: LogLevel;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  service?: string = 'frontend';

  @IsObject()
  @IsOptional()
  context?: Record<string, any> = {};

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any> = {};
}