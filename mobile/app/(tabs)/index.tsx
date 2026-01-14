import { View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import React from 'react';

const EXCHANGE_RATES = [
  { id: '1', label: 'USD', value: '330,38', currency: 'Bs' },
  { id: '2', label: 'EUR', value: '384,33', currency: 'Bs' },
  { id: '3', label: 'USDT', value: '568,40', currency: 'Bs' },
];

export default function TasasScreen() {
  const lastUpdate = "miércoles, 14 de enero de 2026, 02:14:28 p. m.";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Dynamic background particles (simulated) */}
      <View style={[styles.particle, { top: 80, left: 40, width: 8, height: 8, backgroundColor: '#14b8a6', opacity: 0.4 }]} />
      <View style={[styles.particle, { top: 160, right: 80, width: 12, height: 12, backgroundColor: '#a855f7', opacity: 0.3 }]} />
      <View style={[styles.particle, { bottom: 240, left: '25%', width: 8, height: 8, backgroundColor: '#2dd4bf', opacity: 0.2 }]} />
      <View style={[styles.particle, { top: '50%', right: 40, width: 8, height: 8, backgroundColor: '#c084fc', opacity: 0.25 }]} />
      <View style={[styles.particle, { top: '75%', left: 40, width: 4, height: 4, backgroundColor: '#5eead4', opacity: 0.5 }]} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerIcon}>💰</Text>
            <Text style={styles.headerTitle}>Finanzas VE</Text>
          </View>
          <Text style={styles.headerSubtitle}>Tasas de cambio en Venezuela</Text>
        </View>

        {/* Rates Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tasas del día</Text>

          <View style={styles.ratesList}>
            {EXCHANGE_RATES.map((rate) => (
              <View key={rate.id} style={styles.rateItem}>
                <Text style={styles.rateLabel}>{rate.label}</Text>
                <View style={styles.rateValueContainer}>
                  <Text style={styles.rateValueText}>{rate.value}</Text>
                  <Text style={styles.rateCurrency}>{rate.currency}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.updateText}>
              Última actualización: {lastUpdate}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  particle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerIcon: {
    fontSize: 36,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 18,
  },
  card: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  ratesList: {
    gap: 16,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#262628',
    borderWidth: 1,
    borderColor: '#333335',
  },
  rateLabel: {
    color: '#9ca3af',
    fontSize: 18,
    fontWeight: '500',
  },
  rateValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rateValueText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
  },
  rateCurrency: {
    color: '#9ca3af',
    fontSize: 18,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  updateText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
