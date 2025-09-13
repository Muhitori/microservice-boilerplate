import { registerAs } from '@nestjs/config';

export const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
  clientId: process.env.KAFKA_LOGGER_CLIENT_ID || 'logger',
  consumerGroupId:
    process.env.KAFKA_LOGGER_CONSUMER_GROUP_ID || 'logger-consumer',
};

export default registerAs('kafka', () => kafkaConfig);
