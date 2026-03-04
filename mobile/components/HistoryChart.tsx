import React, { useState } from 'react';
import { View, StyleSheet, Text, LayoutChangeEvent } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ExchangeHistory } from '@/hooks/use-exchange-history';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  data: ExchangeHistory[];
  days: number;
}

// Updated colors per user request
const COLORS = {
  USD: '#84cc16',   // lime
  EUR: '#F1C40F',   // yellow
  USDT: '#f97316',  // orange
};

const SERIES_LABEL: Record<string, string> = {
  USD: 'USD BCV',
  EUR: 'EUR BCV',
  USDT: 'USDT',
};

export const HistoryChart = ({ data }: Props) => {
  // Measure the container width at runtime so the chart fills 100% of its parent
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const firstWithData = data.find((d) => d.history.length > 0);
  if (!firstWithData) return null;

  // Build datasets — label every ~6th point to avoid crowding
  const buildDataset = (symbolData: ExchangeHistory) =>
    symbolData.history.map((h, i) => ({
      value: h.value,
      label:
        i % Math.ceil(symbolData.history.length / 6) === 0
          ? format(new Date(h.date), 'd MMM', { locale: es })
          : '',
      labelTextStyle: { color: '#F1C40F', fontSize: 9 },
      hideDataPoint: true,
    }));

  // Primary series: prefer USD
  const primarySymbol = data.find((d) => d.symbol === 'USD') ?? firstWithData;
  const primaryDataset = buildDataset(primarySymbol);
  const primaryColor = COLORS[primarySymbol.symbol as keyof typeof COLORS] ?? '#84cc16';

  // Secondary / tertiary series
  const additionalDatasets = data
    .filter((d) => d !== primarySymbol && d.history.length > 0)
    .map((d) => ({
      data: buildDataset(d),
      color: COLORS[d.symbol as keyof typeof COLORS] ?? '#aaaaaa',
      symbol: d.symbol,
    }));

  // chartWidth is the measured container width minus the yAxis label column (~40px)
  // Fall back to a safe value until layout fires
  const chartWidth = containerWidth > 0 ? containerWidth - 40 : 260;

  return (
    <View style={styles.container} onLayout={onLayout}>
      {containerWidth > 0 && (
        <LineChart
          areaChart={false}
          data={primaryDataset}
          data2={additionalDatasets[0]?.data}
          data3={additionalDatasets[1]?.data}
          color1={primaryColor}
          color2={additionalDatasets[0]?.color}
          color3={additionalDatasets[1]?.color}
          width={chartWidth}
          height={220}
          thickness={2.5}
          thickness2={2.5}
          thickness3={2.5}
          curved
          hideDataPoints
          hideDataPoints2
          hideDataPoints3
          backgroundColor="transparent"
          rulesColor="#145931"
          rulesType="solid"
          yAxisColor="transparent"
          xAxisColor="#448A44"
          yAxisTextStyle={styles.axisLabel}
          xAxisLabelTextStyle={styles.axisLabel}
          noOfSections={4}
          initialSpacing={8}
          endSpacing={8}
        />
      )}

      {/* Legend */}
      <View style={styles.legend}>
        {[primarySymbol, ...data.filter((d) => d !== primarySymbol && d.history.length > 0)].map(
          (d) => (
            <View key={d.symbol} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS[d.symbol as keyof typeof COLORS] ?? '#aaa' },
                ]}
              />
              <Text style={styles.legendText}>{SERIES_LABEL[d.symbol] ?? d.symbol}</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(27, 107, 62, 0.35)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#448A44',
    marginTop: 8,
  },
  axisLabel: {
    color: '#F1C40F',
    fontSize: 9,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#F1C40F',
    fontSize: 12,
  },
});
