import { useQuery } from '@tanstack/react-query';
import { useExchangeStore, ExchangeData } from '../stores/exchange-store';
import { useEffect } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function fetchExchangeRates(): Promise<ExchangeData> {
  const response = await fetch(`${API_URL}/api/exchange-rates`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useExchangeRates() {
  const setExchangeData = useExchangeStore((state) => state.setExchangeData);
  const data = useExchangeStore((state) => state.data);

  const query = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
  });

  useEffect(() => {
    if (query.data) {
      setExchangeData(query.data);
    }
  }, [query.data, setExchangeData]);

  return {
    ...query,
    data: data || query.data, // Prefer store data, fallback to query data
  };
}
