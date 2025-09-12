import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import microservicesConfig from './config/microservices.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ConfigModule.forFeature(microservicesConfig),
    ClientsModule.registerAsync([
      {
        name: 'LOGGER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('microservices.kafka.clientId'),
              brokers: configService.get('microservices.kafka.brokers') || [
                'kafka:9092',
              ],
            },
            consumer: {
              groupId:
                configService.get('microservices.kafka.consumerGroupId') ||
                'product-logger-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('microservices.database.host'),
        port: configService.get('microservices.database.port'),
        username: configService.get('microservices.database.username'),
        password: configService.get('microservices.database.password'),
        database: configService.get('microservices.database.name'),
        entities: [Product],
        synchronize: process.env.NODE_ENV !== 'production',
        migrationsRun: process.env.NODE_ENV === 'production',
        migrations: [__dirname + '/migrations/**/*.js'],
        migrationsTableName: 'migrations',
        extra: {
          max: 1000,
          min: 50,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
