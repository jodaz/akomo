import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as https from 'https';

@Injectable()
export class BcvProvider {
  private readonly logger = new Logger(BcvProvider.name);
  private readonly url = 'https://www.bcv.org.ve/';

  // Custom agent to handle BCV's frequent SSL issues
  private readonly axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  async getRates() {
    try {
      this.logger.log(`Fetching BCV rates from ${this.url}`);
      const { data } = await this.axiosInstance.get(this.url);
      const $ = cheerio.load(data);

      const usd = this.parseValue($('#dolar strong').text());
      const eur = this.parseValue($('#euro strong').text());

      if (isNaN(usd) || isNaN(eur) || usd === 0 || eur === 0) {
        throw new Error('Failed to parse one or more rates from BCV homepage');
      }

      this.logger.log(`Parsed BCV rates: USD=${usd}, EUR=${eur}`);
      return { usd, eur };
    } catch (error) {
      this.logger.error(`Error scraping BCV: ${error.message}`);
      throw error;
    }
  }

  private parseValue(value: string): number {
    if (!value) return 0;
    // BCV uses commas for decimals (e.g., "36,50")
    return parseFloat(value.trim().replace(',', '.'));
  }
}
