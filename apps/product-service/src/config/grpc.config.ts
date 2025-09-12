import { registerAs } from '@nestjs/config';

export const grpcConfig = {
  host: process.env.PRODUCT_SERVICE_GRPC_HOST || '0.0.0.0',
  port: parseInt(process.env.PRODUCT_SERVICE_GRPC_PORT || '50052', 10),
  url: `${process.env.PRODUCT_SERVICE_GRPC_HOST || '0.0.0.0'}:${
    process.env.PRODUCT_SERVICE_GRPC_PORT || 50052
  }`,
};

export default registerAs('grpc', () => grpcConfig);
