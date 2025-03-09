import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @MessagePattern('get.products')
  async getProducts(): Promise<any[]> {
    this.logger.log('Received get.products request');
    return this.productService.findAll();
  }

  @MessagePattern('get.product')
  async getProduct(@Payload() data: { id: string }): Promise<any> {
    this.logger.log(`Received get.product request for ID: ${data.id}`);
    return this.productService.findOne(data.id);
  }

  @MessagePattern('create.product')
  async createProduct(@Payload() data: any): Promise<any> {
    this.logger.log('Received create.product request');
    return this.productService.create(data);
  }

  @MessagePattern('update.product')
  async updateProduct(@Payload() data: { id: string; productData: any }): Promise<any> {
    this.logger.log(`Received update.product request for ID: ${data.id}`);
    return this.productService.update(data.id, data.productData);
  }

  @MessagePattern('delete.product')
  async deleteProduct(@Payload() data: { id: string }): Promise<any> {
    this.logger.log(`Received delete.product request for ID: ${data.id}`);
    return this.productService.remove(data.id);
  }
}