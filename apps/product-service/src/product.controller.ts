import { Controller, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import {
  Product,
  ProductCreate,
  ProductId,
  UpdateProductRequest,
} from './types/product.types';

@Controller('ProductService')
export class ProductController implements OnModuleInit {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    private readonly productService: ProductService,
    @Inject('LOGGER_SERVICE') private readonly loggerClient: ClientKafka
  ) {}

  async onModuleInit() {
    // Connect to Kafka client
    await this.loggerClient.connect();
  }

  @GrpcMethod('ProductService', 'GetProducts')
  async getProducts(): Promise<{ products: Product[] }> {
    this.logger.log('Received get.products request');

    // Log this request
    this.loggerClient.emit('log.info', {
      service: 'product-service',
      type: 'info',
      message: 'Get all products request processed',
      timestamp: new Date().toISOString(),
    });

    return { products: await this.productService.findAll() };
  }

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(data: ProductId): Promise<Product> {
    this.logger.log(`Received get.product request for ID: ${data.id}`);

    // Log this request
    this.loggerClient.emit('log.info', {
      service: 'product-service',
      type: 'info',
      message: `Get product request processed for ID: ${data.id}`,
      timestamp: new Date().toISOString(),
    });

    return this.productService.findOne(data.id);
  }

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(data: ProductCreate): Promise<Product> {
    this.logger.log('Received create.product request');

    try {
      const result = await this.productService.create(data);

      // Log successful product creation
      this.loggerClient.emit('log.info', {
        service: 'product-service',
        type: 'info',
        message: `Product created successfully: ${result.id}`,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      // Log error
      this.loggerClient.emit('log.error', {
        service: 'product-service',
        type: 'error',
        message: `Failed to create product: ${error.message}`,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  async updateProduct(data: UpdateProductRequest): Promise<Product> {
    this.logger.log(`Received update.product request for ID: ${data.id}`);

    try {
      const result = await this.productService.update(
        data.id,
        data.productData
      );

      // Log successful product update
      this.loggerClient.emit('log.info', {
        service: 'product-service',
        type: 'info',
        message: `Product updated successfully: ${data.id}`,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      // Log error
      this.loggerClient.emit('log.error', {
        service: 'product-service',
        type: 'error',
        message: `Failed to update product: ${error.message}`,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  @GrpcMethod('ProductService', 'DeleteProduct')
  async deleteProduct(data: ProductId) {
    this.logger.log(`Received delete.product request for ID: ${data.id}`);

    try {
      await this.productService.remove(data.id);

      // Log successful product deletion
      this.loggerClient.emit('log.info', {
        service: 'product-service',
        type: 'info',
        message: `Product deleted successfully: ${data.id}`,
        timestamp: new Date().toISOString(),
      });

      return {};
    } catch (error) {
      // Log error
      this.loggerClient.emit('log.error', {
        service: 'product-service',
        type: 'error',
        message: `Failed to delete product: ${error.message}`,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }
}
