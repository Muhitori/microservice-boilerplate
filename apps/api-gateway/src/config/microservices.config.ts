import { registerAs } from "@nestjs/config";
import { userConfig } from "./user.config";
import { productConfig } from "./product.config";

export default registerAs("microservices", () => ({
	user: userConfig,
	product: productConfig,
}));
