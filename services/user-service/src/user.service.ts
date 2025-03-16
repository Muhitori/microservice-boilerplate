import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UserCreate } from "./types/user.types";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {}

	async findAll(): Promise<User[]> {
		this.logger.log("Finding all users");
		return this.usersRepository.find();
	}

	async findOne(id: string): Promise<User> {
		this.logger.log(`Finding user with ID: ${id}`);
		const user = await this.usersRepository.findOneBy({ id });
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
		return user;
	}

	async create(userData: Partial<UserCreate>): Promise<User> {
		this.logger.log("Creating new user", userData);
		return this.usersRepository.save(userData);
	}

	async update(id: string, userData: Partial<User>): Promise<User> {
		this.logger.log(`Updating user with ID: ${id}`);
		await this.findOne(id); // Verify user exists
		await this.usersRepository.update(id, userData);
		return this.findOne(id);
	}

	async remove(id: string): Promise<void> {
		this.logger.log(`Removing user with ID: ${id}`);
		const user = await this.findOne(id); // Verify user exists
		await this.usersRepository.remove(user);
	}
}

