import { Injectable } from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import { BinanceP2PProvider } from './providers/binance-p2p.provider';

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly binanceProvider: BinanceP2PProvider) {}

  findAll() {
    return {
      rates: [
        { id: '1', label: 'USD', value: '336,38', currency: 'Bs' },
        { id: '2', label: 'EUR', value: '384,33', currency: 'Bs' },
        { id: '3', label: 'USDT', value: '602,40', currency: 'Bs' },
      ],
      lastUpdate: '2026-01-14T14:14:28.000Z',
    };
  }

  // ... other methods can remain or be removed. Keeping them stubs for now.
  create(createExchangeRateDto: CreateExchangeRateDto) {
    return 'This action adds a new exchangeRate';
  }

  findOne(id: number) {
    return `This action returns a #${id} exchangeRate`;
  }

  update(id: number, updateExchangeRateDto: UpdateExchangeRateDto) {
    return `This action updates a #${id} exchangeRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} exchangeRate`;
  }

  async getBinanceAverage(asset: string, fiat: string, tradeType: string) {
    return this.binanceProvider.getAveragePrice(asset, fiat, tradeType);
  }
}
