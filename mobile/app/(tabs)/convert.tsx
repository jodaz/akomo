import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Switch, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import * as Clipboard from 'expo-clipboard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DollarSign, Euro } from 'lucide-react-native';
import { formatNumber, formatInputDisplay } from '@/utils/format';

type FormData = {
  usd: string;
  eur: string;
  usdt: string;
  bs: string;
};

export default function ConvertirScreen() {
  const { data, isLoading } = useExchangeRates();
  const [isBsToUnit, setIsBsToUnit] = useState(false); // false: Unit -> Bs, true: Bs -> Unit
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      usd: '',
      eur: '',
      usdt: '',
      bs: '',
    },
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </SafeAreaView>
    );
  }

  const rates = {
    USD: parseFloat(data?.rates.find((r) => r.label === 'USD')?.value.replace(',', '.') || '0'),
    EUR: parseFloat(data?.rates.find((r) => r.label === 'EUR')?.value.replace(',', '.') || '0'),
    USDT: parseFloat(data?.rates.find((r) => r.label === 'USDT')?.value.replace(',', '.') || '0'),
  };

  const copyToClipboard = async (text: string, id: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const calculate = (amountStr: string, currency: 'USD' | 'EUR' | 'USDT', mode: 'toBs' | 'toUnit') => {
    // Clean string from any potential formatting artifact (though input should be clean)
    const normalized = amountStr.replace(/,/g, '');
    const amount = parseFloat(normalized);
    if (isNaN(amount)) return '0';

    const rate = rates[currency];
    if (!rate || rate === 0) return '0';

    if (mode === 'toUnit') {
      return (amount / rate).toFixed(2);
    } else {
      return (amount * rate).toFixed(2);
    }
  };

  const renderCopyButton = (text: string, id: string) => (
    <TouchableOpacity onPress={() => copyToClipboard(text, id)} style={styles.copyButton}>
      <FontAwesome name={copiedId === id ? "check" : "copy"} size={16} color={copiedId === id ? "#14b8a6" : "#F1C40F"} />
    </TouchableOpacity>
  );

  const getCurrencyIcon = (currency: string) => {
    const lower = currency.toLowerCase();
    if (lower.includes('usdt')) {
      return <Image source={require('../../assets/images/logos/usdt.png')} style={{ width: 14, height: 14 }} />;
    }
    if (lower.includes('eur')) {
      return <Euro size={14} color="#F1C40F" strokeWidth={3} />;
    }
    return <DollarSign size={14} color="#F1C40F" strokeWidth={3} />;
  };

  const renderUnitToBsRow = (label: string, name: keyof FormData, currency: 'USD' | 'EUR' | 'USDT') => {
    const inputValue = watch(name);
    const result = calculate(inputValue, currency, 'toBs');

    return (
      <View style={styles.inputRow} key={name}>
        <View style={styles.inputContainer}>
          <View style={styles.labelWithIcon}>
            {getCurrencyIcon(currency)}
            <Text style={styles.inputLabel}>{currency}</Text>
          </View>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(text) => onChange(formatInputDisplay(text))}
                value={value}
                placeholder="0.00"
                placeholderTextColor="#ccccccff"
                keyboardType="decimal-pad"
              />
            )}
          />
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultValue}>{formatNumber(result)} Bs</Text>
          {renderCopyButton(formatNumber(result), `u2b-${currency}`)}
        </View>
      </View>
    );
  };

  const renderBsToUnitSection = () => {
    const bsValue = watch('bs');
    const results = [
      { label: 'Dólar BCV', value: calculate(bsValue, 'USD', 'toUnit'), currency: 'USD' },
      { label: 'Euro BCV', value: calculate(bsValue, 'EUR', 'toUnit'), currency: 'EUR' },
      { label: 'USDT', value: calculate(bsValue, 'USDT', 'toUnit'), currency: 'USDT' },
    ];

    return (
      <View>
         <View style={styles.inputContainerFull}>
          <Text style={styles.inputLabel}>Monto en Bolívares</Text>
          <Controller
            control={control}
            name="bs"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(text) => onChange(formatInputDisplay(text))}
                value={value}
                placeholder="0.00"
                placeholderTextColor="#ccccccff"
                keyboardType="decimal-pad"
              />
            )}
          />
        </View>

        <View style={styles.resultsList}>
           {results.map((item) => (
             <View key={item.currency} style={styles.resultRow}>
                <View style={styles.labelWithIcon}>
                  {getCurrencyIcon(item.currency)}
                  <Text style={styles.resultRowLabel}>{item.label}</Text>
                </View>
               <View style={styles.resultRowValueContainer}>
                 <Text style={styles.resultRowValue}>{formatNumber(item.value)} {item.currency}</Text>
                 {renderCopyButton(formatNumber(item.value), `b2u-${item.currency}`)}
               </View>
             </View>
           ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Convertir</Text>

        <View style={styles.card}>
          {!isBsToUnit ? (
            <>
              {renderUnitToBsRow('Dólar BCV', 'usd', 'USD')}
              <View style={styles.divider} />
              {renderUnitToBsRow('Euro BCV', 'eur', 'EUR')}
              <View style={styles.divider} />
              {renderUnitToBsRow('USDT', 'usdt', 'USDT')}
            </>
          ) : (
            renderBsToUnitSection()
          )}
        </View>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, !isBsToUnit && styles.activeSwitchLabel]}>
            Divisa → Bs
          </Text>
          <Switch
            trackColor={{ false: '#333', true: '#F1C40F' }}
            thumbColor={'#fff'}
            ios_backgroundColor="#333"
            onValueChange={setIsBsToUnit}
            value={isBsToUnit}
          />
          <Text style={[styles.switchLabel, isBsToUnit && styles.activeSwitchLabel]}>
            Bs → Divisa
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#448A44',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#145931',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#448A44',
    marginBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  inputContainerFull: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#F1C40F',
    fontSize: 14,
    fontWeight: '600',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1B6B3E',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#448A44',
    fontSize: 18,
  },
  arrow: {
    color: '#F1C40F',
    fontSize: 20,
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 24,
    flexDirection: 'row', // Align copy button properly
  },
  resultValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1C40F',
    marginVertical: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 9999,
    alignSelf: 'center',
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  activeSwitchLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsList: {
    gap: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  resultRowLabel: {
    color: '#F1C40F',
    fontSize: 16,
  },
  resultRowValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultRowValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
    color: '#F1C40F',
  },
});
