import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';

async function bootstrap() {
  console.log('--- BCV Sync Script Started ---');
  
  // Create application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(ExchangeRatesService);
  
  try {
    const result = await service.syncBcvRates();
    console.log(`Successfully synced BCV rates: USD=${result.usd}, EUR=${result.eur}`);
  } catch (error) {
    console.error('Failed to sync BCV rates:', error.message);
    process.exit(1);
  } finally {
    await app.close();
    console.log('--- BCV Sync Script Finished ---');
  }
}

bootstrap();
