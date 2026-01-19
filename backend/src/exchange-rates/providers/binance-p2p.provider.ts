import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BinanceP2PProvider {
  private readonly logger = new Logger(BinanceP2PProvider.name);
  private readonly baseUrl = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';

  async search(asset: string, fiat: string, tradeType: string, page: number = 1, rows: number = 10) {
    const payload = {
      page,
      rows,
      payTypes: [],
      publisherType: null,
      asset,
      tradeType,
      fiat,
      merchantCheck: true,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error(`Error fetching data from Binance P2P: ${error.message}`);
      throw error;
    }
  }

  async getAveragePrice(asset: string, fiat: string, tradeType: string): Promise<number> {
    const data = await this.search(asset, fiat, tradeType);
    
    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        return 0;
    }

    const ads = data.data;
    let totalPrice = 0;
    let count = 0;

    for (const ad of ads) {
      if (ad.adv && ad.adv.price) {
        const price = parseFloat(ad.adv.price);
        if (!isNaN(price)) {
          totalPrice += price;
          count++;
        }
      }
    }

    return count > 0 ? totalPrice / count : 0;
  }
}
