import { registerAs } from "@nestjs/config";

export const userConfig = {
	host: process.env.USER_SERVICE_GRPC_HOST || "user-service",
	port: parseInt(process.env.USER_SERVICE_GRPC_PORT, 10) || 50051,
	timeout: parseInt(process.env.USER_SERVICE_TIMEOUT, 10) || 5000,
	maxRedirects: parseInt(process.env.USER_SERVICE_MAX_REDIRECTS, 10) || 5,
	grpc: {
		url: `${process.env.USER_SERVICE_GRPC_HOST || "user-service"}:${process.env.USER_SERVICE_GRPC_PORT || 50051}`,
	},
};

export default registerAs("user", () => userConfig);
