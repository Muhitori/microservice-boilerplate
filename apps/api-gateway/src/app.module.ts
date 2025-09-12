import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import microservicesConfig from './config/microservices.config';
import { HealthModule } from '@muhitori/health';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ConfigModule.forFeature(microservicesConfig),
    HealthModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'service',
            protoPath: join(__dirname, 'proto/service.proto'),
            url: configService.get('microservices.user.grpc.url'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'service',
            protoPath: join(__dirname, 'proto/service.proto'),
            url: configService.get('microservices.product.grpc.url'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'LOGGER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'api-gateway-logger',
              brokers: configService
                .get('microservices.kafka.brokers')
                ?.split(',') || ['kafka:9092'],
            },
            consumer: {
              groupId: 'api-gateway-logger-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
