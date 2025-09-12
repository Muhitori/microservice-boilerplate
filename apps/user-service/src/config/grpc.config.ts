import { registerAs } from '@nestjs/config';

export const grpcConfig = {
  host: process.env.USER_SERVICE_GRPC_HOST || '0.0.0.0',
  port: parseInt(process.env.USER_SERVICE_GRPC_PORT || '50051', 10),
  url: `${process.env.USER_SERVICE_GRPC_HOST || '0.0.0.0'}:${
    process.env.USER_SERVICE_GRPC_PORT || 50051
  }`,
};

export default registerAs('grpc', () => grpcConfig);
