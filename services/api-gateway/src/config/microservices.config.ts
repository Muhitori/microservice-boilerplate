import { registerAs } from "@nestjs/config";

export default registerAs("microservices", () => ({
	user: {
		host: process.env.USER_SERVICE_HOST || "user-service",
		port: parseInt(process.env.USER_SERVICE_PORT, 10) || 8081,
		timeout: parseInt(process.env.USER_SERVICE_TIMEOUT, 10) || 5000,
		maxRedirects: parseInt(process.env.USER_SERVICE_MAX_REDIRECTS, 10) || 5,
	},
	product: {
		host: process.env.PRODUCT_SERVICE_HOST || "product-service",
		port: parseInt(process.env.PRODUCT_SERVICE_PORT, 10) || 8082,
		timeout: parseInt(process.env.PRODUCT_SERVICE_TIMEOUT, 10) || 5000,
		maxRedirects: parseInt(process.env.PRODUCT_SERVICE_MAX_REDIRECTS, 10) || 5,
	},
}));
