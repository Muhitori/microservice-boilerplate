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
import { HttpService } from "@nestjs/axios";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { firstValueFrom } from "rxjs";

@ApiTags("api")
@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name);

	constructor(
		private readonly appService: AppService,
		@Inject("USER_SERVICE") private readonly userClient: HttpService,
		@Inject("PRODUCT_SERVICE") private readonly productClient: HttpService,
		@Inject("LOGGER_SERVICE") private readonly loggerClient: HttpService
	) {}

	// No need for onModuleInit with HTTP proxy

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
		const response = await firstValueFrom(this.userClient.get("/users"));
		return response.data;
	}

	@Get("users/:id")
	@ApiOperation({ summary: "Get user by ID" })
	@ApiResponse({ status: 200, description: "Return user by ID" })
	async getUserById(@Param("id") id: string) {
		this.logger.log(`Getting user with ID: ${id}`);
		const response = await firstValueFrom(this.userClient.get(`/users/${id}`));
		return response.data;
	}

	@Get("products")
	@ApiOperation({ summary: "Get all products" })
	@ApiResponse({ status: 200, description: "Return all products" })
	async getProducts() {
		this.logger.log("Getting all products");
		const response = await firstValueFrom(this.productClient.get("/products"));
		return response.data;
	}

	@Get("products/:id")
	@ApiOperation({ summary: "Get product by ID" })
	@ApiResponse({ status: 200, description: "Return product by ID" })
	async getProductById(@Param("id") id: string) {
		this.logger.log(`Getting product with ID: ${id}`);
		const response = await firstValueFrom(
			this.productClient.get(`/products/${id}`)
		);
		return response.data;
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
			// Create user via HTTP
			const response = await firstValueFrom(
				this.userClient.post("/users", userData)
			);
			return response.data;
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
			// Create product via HTTP
			const response = await firstValueFrom(
				this.productClient.post("/products", productData)
			);
			return response.data;
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
			// Update user via HTTP
			const response = await firstValueFrom(
				this.userClient.put(`/users/${id}`, userData)
			);
			return response.data;
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
			// Update product via HTTP
			const response = await firstValueFrom(
				this.productClient.put(`/products/${id}`, productData)
			);
			return response.data;
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
			// Delete user via HTTP
			const response = await firstValueFrom(
				this.userClient.delete(`/users/${id}`)
			);
			return response.data;
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
			// Delete product via HTTP
			const response = await firstValueFrom(
				this.productClient.delete(`/products/${id}`)
			);
			return response.data;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}

