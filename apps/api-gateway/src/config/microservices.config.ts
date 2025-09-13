import { registerAs } from '@nestjs/config';
import { userConfig } from './user.config';
import { productConfig } from './product.config';
import { kafkaConfig } from './kafka.config';

export default registerAs('microservices', () => ({
  user: userConfig,
  product: productConfig,
  kafka: kafkaConfig,
}));
