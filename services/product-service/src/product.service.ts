import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductCreate } from "./types/product.types";

@Injectable()
export class ProductService {
	private readonly logger = new Logger(ProductService.name);

	constructor(
		@InjectRepository(Product)
		private productsRepository: Repository<Product>
	) {}

	async findAll(): Promise<Product[]> {
		this.logger.log("Finding all products");
		return this.productsRepository.find();
	}

	async findOne(id: string): Promise<Product> {
		this.logger.log(`Finding product with ID: ${id}`);
		const product = await this.productsRepository.findOneBy({ id });
		if (!product) {
			throw new NotFoundException(`Product with ID ${id} not found`);
		}
		return product;
	}

	async create(productData: Partial<ProductCreate>): Promise<Product> {
		this.logger.log("Creating new product");
		const product = this.productsRepository.create(productData);
		return this.productsRepository.save(product);
	}

	async update(id: string, productData: Partial<Product>): Promise<Product> {
		this.logger.log(`Updating product with ID: ${id}`);
		await this.findOne(id); // Verify product exists
		await this.productsRepository.update(id, productData);
		return this.findOne(id);
	}

	async remove(id: string): Promise<void> {
		this.logger.log(`Removing product with ID: ${id}`);
		const product = await this.findOne(id); // Verify product exists
		await this.productsRepository.remove(product);
	}
}

