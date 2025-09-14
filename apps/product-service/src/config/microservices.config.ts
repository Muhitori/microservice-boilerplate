import { registerAs } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { kafkaConfig } from './kafka.config';

export default registerAs('microservices', () => ({
  database: databaseConfig,
  kafka: kafkaConfig,
}));
