import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Switch, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import * as Clipboard from 'expo-clipboard';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return '0.00';

    const rate = rates[currency];
    if (!rate || rate === 0) return '0.00';

    if (mode === 'toUnit') {
      return (amount / rate).toFixed(2);
    } else {
      return (amount * rate).toFixed(2);
    }
  };

  const renderCopyButton = (text: string, id: string) => (
    <TouchableOpacity onPress={() => copyToClipboard(text, id)} style={styles.copyButton}>
      <FontAwesome name={copiedId === id ? "check" : "copy"} size={16} color={copiedId === id ? "#14b8a6" : "#6b7280"} />
    </TouchableOpacity>
  );

  const renderUnitToBsRow = (label: string, name: keyof FormData, currency: 'USD' | 'EUR' | 'USDT') => {
    const inputValue = watch(name);
    const result = calculate(inputValue, currency, 'toBs');

    return (
      <View style={styles.inputRow} key={name}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{currency}</Text>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            )}
          />
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultValue}>{result} Bs</Text>
          {renderCopyButton(result, `u2b-${currency}`)}
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
                onChangeText={onChange}
                value={value}
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            )}
          />
        </View>

        <View style={styles.resultsList}>
           {results.map((item) => (
             <View key={item.currency} style={styles.resultRow}>
               <Text style={styles.resultRowLabel}>{item.label}</Text>
               <View style={styles.resultRowValueContainer}>
                 <Text style={styles.resultRowValue}>{item.value} {item.currency}</Text>
                 {renderCopyButton(item.value, `b2u-${item.currency}`)}
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
            trackColor={{ false: '#333', true: '#14b8a6' }}
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
    backgroundColor: '#0a0a0a',
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
    backgroundColor: '#1c1c1e',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2c2c2e',
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
    color: '#9ca3af',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#262628',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333335',
    fontSize: 18,
  },
  arrow: {
    color: '#6b7280',
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
    backgroundColor: '#2c2c2e',
    marginVertical: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 9999,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  switchLabel: {
    color: '#6b7280',
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
    color: '#9ca3af',
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
  },
});
