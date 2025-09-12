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
	OnModuleInit,
} from "@nestjs/common";
import { ClientGrpc, ClientKafka } from "@nestjs/microservices";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { lastValueFrom } from "rxjs";

@ApiTags("api")
@Controller()
export class AppController implements OnModuleInit {
	private readonly logger = new Logger(AppController.name);

	private userService: any;
	private productService: any;

	constructor(
		private readonly appService: AppService,
		@Inject("USER_SERVICE") private readonly userClient: ClientGrpc,
		@Inject("PRODUCT_SERVICE") private readonly productClient: ClientGrpc,
		@Inject("LOGGER_SERVICE") private readonly loggerClient: ClientKafka
	) {}

	async onModuleInit() {
		this.userService = this.userClient.getService<any>("UserService");
		this.productService = this.productClient.getService<any>("ProductService");
		await this.loggerClient.connect();
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
	async getUsers() {
		this.logger.log("Getting all users");

		return await lastValueFrom(this.userService.getUsers({}));
	}

	@Get("users/:id")
	@ApiOperation({ summary: "Get user by ID" })
	@ApiResponse({ status: 200, description: "Return user by ID" })
	async getUserById(@Param("id") id: string) {
		this.logger.log(`Getting user with ID: ${id}`);

		return await lastValueFrom(this.userService.getUser({ id }));
	}

	@Get("products")
	@ApiOperation({ summary: "Get all products" })
	@ApiResponse({ status: 200, description: "Return all products" })
	async getProducts() {
		this.logger.log("Getting all products");

		return await lastValueFrom(this.productService.getProducts({}));
	}

	@Get("products/:id")
	@ApiOperation({ summary: "Get product by ID" })
	@ApiResponse({ status: 200, description: "Return product by ID" })
	async getProductById(@Param("id") id: string) {
		this.logger.log(`Getting product with ID: ${id}`);

		return await lastValueFrom(this.productService.getProduct({ id }));
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
			this.logger.log("Creating a new user", userData);

			// Transform and validate user data according to proto definition
			const userCreateData = {
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
				password: userData.password,
			};

			// Validate required fields
			if (
				!userCreateData.firstName ||
				!userCreateData.lastName ||
				!userCreateData.email ||
				!userCreateData.password
			) {
				throw new HttpException(
					"Missing required fields",
					HttpStatus.BAD_REQUEST
				);
			}

			return await lastValueFrom(this.userService.createUser(userCreateData));
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
			return await lastValueFrom(
				this.productService.createProduct(productData)
			);
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
			return await lastValueFrom(this.userService.updateUser({ id, userData }));
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
			return await lastValueFrom(
				this.productService.updateProduct({ id, productData })
			);
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
			return await lastValueFrom(this.userService.deleteUser({ id }));
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
			return await lastValueFrom(this.productService.deleteProduct({ id }));
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}

