import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Client({
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
  })
  private readonly kafkaClient: ClientKafka;

  async onModuleInit() {
    // Subscribe to all log-related topics
    const logTopics = [
      'log.info',
      'log.error',
      'log.debug',
      'log.warn',
      'log.trace',
      'log.fatal',
      'log.audit',
      'log.security',
      'log.performance',
      'log.system'
    ];
    logTopics.forEach(topic => {
      this.kafkaClient.subscribeToResponseOf(topic);
    });
    await this.kafkaClient.connect();
  }

  async handleLog(topic: string, message: any) {
    try {
      const timestamp = new Date();
      const logEntry = {
        timestamp,
        level: topic.split('.')[1],
        message: message.message,
        service: message.service,
        context: message.context || {},
        metadata: message.metadata || {},
      };

      // Store log in Elasticsearch
      await this.elasticsearchService.index({
        index: 'microservices-logs',
        body: logEntry,
      });

      return { success: true };
    } catch (error) {
      console.error('Error handling log:', error);
      return { success: false, error: error.message };
    }
  }
}