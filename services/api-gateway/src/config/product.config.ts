import { registerAs } from "@nestjs/config";

export const productConfig = {
	host: process.env.PRODUCT_SERVICE_GRPC_HOST || "product-service",
	port: parseInt(process.env.PRODUCT_SERVICE_GRPC_PORT, 10) || 50052,
	timeout: parseInt(process.env.PRODUCT_SERVICE_TIMEOUT, 10) || 5000,
	maxRedirects: parseInt(process.env.PRODUCT_SERVICE_MAX_REDIRECTS, 10) || 5,
	grpc: {
		url: `${process.env.PRODUCT_SERVICE_GRPC_HOST || "product-service"}:${process.env.PRODUCT_SERVICE_GRPC_PORT || 50052}`,
	},
};

export default registerAs("product", () => productConfig);
