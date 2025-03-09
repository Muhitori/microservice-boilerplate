import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
          },
          consumer: {
            groupId: 'product-consumer',
          },
        },
      },
      {
        name: 'LOGGER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'logger',
            brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
          },
          consumer: {
            groupId: 'logger-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}