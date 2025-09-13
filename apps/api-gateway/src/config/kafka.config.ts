import { registerAs } from '@nestjs/config';

export const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
  clientId: process.env.KAFKA_GATEWAY_LOGGER_CLIENT_ID || 'api-gateway-logger',
  consumerGroupId:
    process.env.KAFKA_GATEWAY_LOGGER_CONSUMER_GROUP_ID ||
    'api-gateway-logger-consumer',
};

export default registerAs('kafka', () => kafkaConfig);
