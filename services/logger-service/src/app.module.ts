import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
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
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://elasticsearch:9200',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}