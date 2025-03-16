import { Controller, Logger, Inject, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { GrpcMethod } from "@nestjs/microservices";
import { UserService } from "./user.service";
import {
	User,
	UserId,
	UpdateUserRequest,
	UserCreate,
} from "./types/user.types";

@Controller("UserService")
export class UserController implements OnModuleInit {
	private readonly logger = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		@Inject("LOGGER_SERVICE") private readonly loggerClient: ClientKafka
	) {}

	async onModuleInit() {
		// Connect to Kafka client
		await this.loggerClient.connect();
	}

	@GrpcMethod("UserService", "GetUsers")
	async getUsers(): Promise<{ users: User[] }> {
		this.logger.log("Received get.users request");

		// Log this request
		this.loggerClient.emit("log.info", {
			service: "user-service",
			type: "info",
			message: "Get all users request processed",
			timestamp: new Date().toISOString(),
		});

		return { users: await this.userService.findAll() };
	}

	@GrpcMethod("UserService", "GetUser")
	async getUser(data: UserId): Promise<User> {
		this.logger.log(`Received get.user request for ID: ${data.id}`);

		// Log this request
		this.loggerClient.emit("log.info", {
			service: "user-service",
			type: "info",
			message: `Get user request processed for ID: ${data.id}`,
			timestamp: new Date().toISOString(),
		});

		return this.userService.findOne(data.id);
	}

	@GrpcMethod("UserService", "CreateUser")
	async createUser(data: UserCreate): Promise<User> {
		this.logger.log("Received create.user request", data);

		try {
			const result = await this.userService.create(data);

			// Log successful user creation
			this.loggerClient.emit("log.info", {
				service: "user-service",
				type: "info",
				message: `User created successfully: ${result.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "user-service",
				type: "error",
				message: `Failed to create user: ${error.message}`,
				timestamp: new Date().toISOString(),
			});

			throw error;
		}
	}

	@GrpcMethod("UserService", "UpdateUser")
	async updateUser(data: UpdateUserRequest): Promise<User> {
		this.logger.log(`Received update.user request for ID: ${data.id}`);

		try {
			const result = await this.userService.update(data.id, data.userData);

			// Log successful user update
			this.loggerClient.emit("log.info", {
				service: "user-service",
				type: "info",
				message: `User updated successfully: ${data.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "user-service",
				type: "error",
				message: `Failed to update user: ${error.message}`,
				timestamp: new Date().toISOString(),
			});

			throw error;
		}
	}

	@GrpcMethod("UserService", "DeleteUser")
	async deleteUser(data: UserId) {
		this.logger.log(`Received delete.user request for ID: ${data.id}`);

		try {
			const result = await this.userService.remove(data.id);

			// Log successful user deletion
			this.loggerClient.emit("log.info", {
				service: "user-service",
				type: "info",
				message: `User deleted successfully: ${data.id}`,
				timestamp: new Date().toISOString(),
			});

			return result;
		} catch (error) {
			// Log error
			this.loggerClient.emit("log.error", {
				service: "user-service",
				type: "error",
				message: `Failed to delete user: ${error.message}`,
				timestamp: new Date().toISOString(),
			});

			throw error;
		}
	}
}

