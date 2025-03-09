import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "./user.service";

@Controller()
export class UserController {
	private readonly logger = new Logger(UserController.name);

	constructor(private readonly userService: UserService) {}

	@MessagePattern("get.users")
	async getUsers(): Promise<any[]> {
		this.logger.log("Received get.users request");
		return this.userService.findAll();
	}

	@MessagePattern("get.user")
	async getUser(@Payload() data: { id: string }): Promise<any> {
		this.logger.log(`Received get.user request for ID: ${data.id}`);
		return this.userService.findOne(data.id);
	}

	@MessagePattern("create.user")
	async createUser(@Payload() data: any): Promise<any> {
		this.logger.log("Received create.user request");
		return this.userService.create(data);
	}

	@MessagePattern("update.user")
	async updateUser(data: { id: string; userData: any }): Promise<any> {
		this.logger.log(`Received update.user request for ID: ${data.id}`);
		return this.userService.update(data.id, data.userData);
	}

	@MessagePattern("delete.user")
	deleteUser(data: { id: string }): Promise<any> {
		this.logger.log(`Received delete.user request for ID: ${data.id}`);
		return this.userService.remove(data.id);
	}
}

