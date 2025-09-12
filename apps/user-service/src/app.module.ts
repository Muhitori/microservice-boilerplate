import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { HealthModule } from './health/health.module';
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
                'user-logger-consumer',
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
        entities: [User],
        synchronize: process.env.NODE_ENV !== 'production',
        migrationsRun: process.env.NODE_ENV === 'production',
        migrations: [__dirname + '/migrations/**/*.js'],
        migrationsTableName: 'migrations',
        extra: {
          max: 100,
          min: 50,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    HealthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
