import {
	Controller,
	Get,
	Logger,
	Inject,
	Param,
	Post,
	Body,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { firstValueFrom } from "rxjs";

@ApiTags("api")
@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name);

	constructor(
		private readonly appService: AppService,
		@Inject("USER_SERVICE") private readonly userClient: ClientKafka,
		@Inject("PRODUCT_SERVICE") private readonly productClient: ClientKafka,
		@Inject("LOGGER_SERVICE") private readonly loggerClient: ClientKafka
	) {}

	async onModuleInit(): Promise<void> {
		// Subscribe to response topics
		this.userClient.subscribeToResponseOf("get.users");
		this.userClient.subscribeToResponseOf("get.user");
		this.userClient.subscribeToResponseOf("create.user");
		this.productClient.subscribeToResponseOf("get.products");
		this.productClient.subscribeToResponseOf("get.product");
		this.productClient.subscribeToResponseOf("create.product");

		// Connect to Kafka clients
		await Promise.all([
			this.userClient.connect(),
			this.productClient.connect(),
			this.loggerClient.connect(),
		]);
	}

	@Get()
	@ApiOperation({
		summary: "Get welcome message",
		description: "Returns a welcome message from the API",
	})
	@ApiResponse({ status: 200, description: "Return welcome message" })
	getHello() {
		// Log this request
		this.loggerClient.emit("log.info", {
			service: "api-gateway",
			type: "info",
			message: "Home endpoint accessed",
			timestamp: new Date().toISOString(),
		});
		return this.appService.getHello();
	}

	@Get("users")
	@ApiOperation({ summary: "Get all users" })
	@ApiResponse({ status: 200, description: "Return all users" })
	getUsers() {
		this.logger.log("Getting all users");
		// Log this request
		this.loggerClient.emit("log.info", {
			service: "api-gateway",
			type: "info",
			message: "Users endpoint accessed",
			timestamp: new Date().toISOString(),
		});
		return this.userClient.send("get.users", {});
	}

	@Get("users/:id")
	@ApiOperation({ summary: "Get user by ID" })
	@ApiResponse({ status: 200, description: "Return user by ID" })
	getUserById(@Param("id") id: string) {
		this.logger.log(`Getting user with ID: ${id}`);
		// Log this request
		this.loggerClient.emit("log.info", {
			service: "api-gateway",
			type: "info",
			message: `User endpoint accessed for ID: ${id}`,
			timestamp: new Date().toISOString(),
		});
		return this.userClient.send("get.user", { id });
	}

	@Get("products")
	@ApiOperation({ summary: "Get all products" })
	@ApiResponse({ status: 200, description: "Return all products" })
	getProducts() {
		this.logger.log("Getting all products");
		// Log this request
		this.loggerClient.emit("log.info", {
			service: "api-gateway",
			type: "info",
			message: "Products endpoint accessed",
			timestamp: new Date().toISOString(),
		});
		return this.productClient.send("get.products", {});
	}

	@Get("products/:id")
	@ApiOperation({ summary: "Get product by ID" })
	@ApiResponse({ status: 200, description: "Return product by ID" })
	getProductById(@Param("id") id: string) {
		this.logger.log(`Getting product with ID: ${id}`);
		// Log this request
		this.loggerClient.emit("log.info", {
			service: "api-gateway",
			type: "info",
			message: `Product endpoint accessed for ID: ${id}`,
			timestamp: new Date().toISOString(),
		});
		return this.productClient.send("get.product", { id });
	}

	@Post("users")
	@ApiOperation({
		summary: "Create a new user",
		description: "Creates a new user in the system",
	})
	@ApiResponse({ status: 201, description: "User created successfully" })
	@ApiResponse({ status: 400, description: "Bad request" })
	async createUser(@Body() userData: any) {
		try {
			// Emit create user event
			const result = await firstValueFrom(
				this.userClient.send("create.user", userData)
			);

			// Log successful user creation
			this.loggerClient.emit("log.info", {
				service: "api-gateway",
				type: "info",
				message: `User created successfully: ${result.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "api-gateway",
				type: "error",
				message: `Failed to create user: ${error.message}`,
				timestamp: new Date().toISOString(),
			});
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Post("products")
	@ApiOperation({
		summary: "Create a new product",
		description: "Creates a new product in the system",
	})
	@ApiResponse({ status: 201, description: "Product created successfully" })
	@ApiResponse({ status: 400, description: "Bad request" })
	async createProduct(@Body() productData: any) {
		try {
			// Emit create product event
			const result = await firstValueFrom(
				this.productClient.send("create.product", productData)
			);

			// Log successful product creation
			this.loggerClient.emit("log.info", {
				service: "api-gateway",
				type: "info",
				message: `Product created successfully: ${result.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "api-gateway",
				type: "error",
				message: `Failed to create product: ${error.message}`,
				timestamp: new Date().toISOString(),
			});
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}

