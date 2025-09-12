import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    this.logger.log('Health check requested');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async checkElasticsearchConnection(): Promise<{
    elasticsearch: boolean;
    timestamp: string;
  }> {
    try {
      // Try to ping Elasticsearch to check connection
      await this.elasticsearchService.ping();
      this.logger.log('Elasticsearch connection check: successful');
      return {
        elasticsearch: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Elasticsearch connection check failed: ${error.message}`
      );
      return {
        elasticsearch: false,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
