import { Module } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';
import { ExchangeRatesController } from './exchange-rates.controller';
import { BinanceP2PProvider } from './providers/binance-p2p.provider';

@Module({
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesService, BinanceP2PProvider],
})
export class ExchangeRatesModule {}
