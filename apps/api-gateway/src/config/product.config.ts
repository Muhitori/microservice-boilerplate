import { registerAs } from '@nestjs/config';

export const productConfig = {
  host: process.env.PRODUCT_SERVICE_GRPC_HOST || 'product-service',
  port: parseInt(process.env.PRODUCT_SERVICE_GRPC_PORT || '50052', 10),
  timeout: parseInt(process.env.PRODUCT_SERVICE_TIMEOUT || '5000', 10),
  maxRedirects: parseInt(process.env.PRODUCT_SERVICE_MAX_REDIRECTS || '5', 10),
  grpc: {
    url: `${process.env.PRODUCT_SERVICE_GRPC_HOST || 'product-service'}:${
      process.env.PRODUCT_SERVICE_GRPC_PORT || 50052
    }`,
  },
};

export default registerAs('product', () => productConfig);
