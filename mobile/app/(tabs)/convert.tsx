import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

export default function ConvertirScreen() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      amount: '',
    }
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Convertir</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Monto en USD</Text>
          <Controller
            control={control}
            name="amount"
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

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Calcular</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Próximamente más opciones...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  label: {
    color: '#9ca3af',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#262628',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333335',
    marginBottom: 16,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerText: {
    color: '#6b7280',
    marginTop: 32,
  },
});
