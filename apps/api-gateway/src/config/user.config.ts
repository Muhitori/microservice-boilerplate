import { registerAs } from '@nestjs/config';

export const userConfig = {
  host: process.env.USER_SERVICE_GRPC_HOST || 'user-service',
  port: parseInt(process.env.USER_SERVICE_GRPC_PORT || '50051', 10),
  timeout: parseInt(process.env.USER_SERVICE_TIMEOUT || '5000', 10),
  maxRedirects: parseInt(process.env.USER_SERVICE_MAX_REDIRECTS || '5', 10),
  grpc: {
    url: `${process.env.USER_SERVICE_GRPC_HOST || 'user-service'}:${
      process.env.USER_SERVICE_GRPC_PORT || 50051
    }`,
  },
};

export default registerAs('user', () => userConfig);
