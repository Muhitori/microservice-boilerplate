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
	Delete,
	Put,
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
		this.userClient.subscribeToResponseOf("update.user");
		this.userClient.subscribeToResponseOf("delete.user");

		this.productClient.subscribeToResponseOf("get.products");
		this.productClient.subscribeToResponseOf("get.product");
		this.productClient.subscribeToResponseOf("create.product");
		this.productClient.subscribeToResponseOf("update.product");
		this.productClient.subscribeToResponseOf("delete.product");

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
		return this.appService.getHello();
	}

	@Get("users")
	@ApiOperation({ summary: "Get all users" })
	@ApiResponse({ status: 200, description: "Return all users" })
	getUsers() {
		this.logger.log("Getting all users");
		return this.userClient.send("get.users", {});
	}

	@Get("users/:id")
	@ApiOperation({ summary: "Get user by ID" })
	@ApiResponse({ status: 200, description: "Return user by ID" })
	getUserById(@Param("id") id: string) {
		this.logger.log(`Getting user with ID: ${id}`);
		return this.userClient.send("get.user", { id });
	}

	@Get("products")
	@ApiOperation({ summary: "Get all products" })
	@ApiResponse({ status: 200, description: "Return all products" })
	getProducts() {
		this.logger.log("Getting all products");
		return this.productClient.send("get.products", {});
	}

	@Get("products/:id")
	@ApiOperation({ summary: "Get product by ID" })
	@ApiResponse({ status: 200, description: "Return product by ID" })
	getProductById(@Param("id") id: string) {
		this.logger.log(`Getting product with ID: ${id}`);
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
			return result;
		} catch (error) {
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
			return result;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Put("users/:id")
	@ApiOperation({
		summary: "Update a user",
		description: "Updates an existing user in the system",
	})
	@ApiResponse({ status: 200, description: "User updated successfully" })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiResponse({ status: 404, description: "User not found" })
	async updateUser(@Param("id") id: string, @Body() userData: any) {
		try {
			// Emit update user event
			const result = await firstValueFrom(
				this.userClient.send("update.user", { id, ...userData })
			);
			return result;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Put("products/:id")
	@ApiOperation({
		summary: "Update a product",
		description: "Updates an existing product in the system",
	})
	@ApiResponse({ status: 200, description: "Product updated successfully" })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiResponse({ status: 404, description: "Product not found" })
	async updateProduct(@Param("id") id: string, @Body() productData: any) {
		try {
			// Emit update product event
			const result = await firstValueFrom(
				this.productClient.send("update.product", { id, ...productData })
			);
			return result;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Delete("users/:id")
	@ApiOperation({
		summary: "Delete a user",
		description: "Deletes an existing user from the system",
	})
	@ApiResponse({ status: 200, description: "User deleted successfully" })
	@ApiResponse({ status: 404, description: "User not found" })
	async deleteUser(@Param("id") id: string) {
		try {
			// Emit delete user event
			const result = await firstValueFrom(
				this.userClient.send("delete.user", { id })
			);
			return result;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Delete("products/:id")
	@ApiOperation({
		summary: "Delete a product",
		description: "Deletes an existing product from the system",
	})
	@ApiResponse({ status: 200, description: "Product deleted successfully" })
	@ApiResponse({ status: 404, description: "Product not found" })
	async deleteProduct(@Param("id") id: string) {
		try {
			// Emit delete product event
			const result = await firstValueFrom(
				this.productClient.send("delete.product", { id })
			);
			return result;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}

