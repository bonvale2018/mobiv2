import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useStore } from '../../store';
import { C, BILL_PROVIDERS } from '../../constants';
import SuccessScreen from '../../components/SuccessScreen';

function makeRef() {
  return 'BOB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

export default function BillsScreen({ navigation }: any) {
  const { accounts, user, addTransaction } = useStore();
  const [provider, setProvider] = useState<typeof BILL_PROVIDERS[0] | null>(null);
  const [accNo,    setAccNo]    = useState('');
  const [amount,   setAmount]   = useState('');
  const [pin,      setPin]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [ref,      setRef]      = useState('');

  const fromAcc = accounts[0];

  const pay = async () => {
    if (!provider) { Alert.alert('Select Provider', 'Please select a utility provider.'); return; }
    if (!accNo.trim()) { Alert.alert('Required', 'Enter the account / meter number.'); return; }
    if (!amount || Number(amount) < provider.min) { Alert.alert('Invalid Amount', `Minimum is KES ${provider.min}`); return; }
    if (!pin || pin.length < 4) { Alert.alert('PIN Required', 'Enter your transaction PIN.'); return; }
    setLoading(true);
    try {
      const txRef = makeRef();
      const tx = {
        uid:         user?.uid ?? '',
        type:        'debit',
        amount:      Number(amount),
        description: `${provider.name} — ${accNo}`,
        date:        new Date().toISOString().split('T')[0],
        account:     fromAcc?.accountNumber ?? '',
        provider:    provider.id,
        billAccount: accNo,
        ref:         txRef,
        createdAt:   serverTimestamp(),
      };
      await addDoc(collection(db, 'transactions'), tx);
      addTransaction({ id: txRef, type: 'debit', amount: Number(amount), description: tx.description, date: tx.date, account: tx.account });
      setRef(txRef);
      setDone(true);
    } catch (e: any) {
      Alert.alert('Payment Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setDone(false); setProvider(null); setAccNo(''); setAmount(''); setPin(''); };

  if (done) return (
    <SuccessScreen
      title="Bill Paid!"
      subtitle={`${provider?.name} — ${accNo}`}
      amount={`KES ${Number(amount).toLocaleString('en-KE')}`}
      reference={ref}
      onDone={() => navigation.navigate('Home')}
      onNew={reset}
      newLabel="Pay Another"
    />
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Pay Utility Bills</Text>
        </LinearGradient>

        <ScrollView style={s.content} keyboardShouldPersistTaps="handled">
          <Text style={s.label}>Select Provider</Text>
          <View style={s.grid}>
            {BILL_PROVIDERS.map(p => {
              const active = provider?.id === p.id;
              return (
                <TouchableOpacity key={p.id} style={[s.provCard, active && s.provCardActive]} onPress={() => setProvider(p)}>
                  <Ionicons name={p.icon as any} size={22} color={active ? '#fff' : C.primary} />
                  <Text style={[s.provName, active && { color: '#fff' }]}>{p.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {provider && (
            <>
              <F label="Account / Meter Number" value={accNo}  set={setAccNo}  ph="Enter number" />
              <F label="Amount (KES)"            value={amount} set={setAmount} ph={`Min KES ${provider.min}`} kb="numeric" />
              <F label="Transaction PIN"         value={pin}    set={setPin}    ph="Enter PIN"    kb="numeric" secure />
            </>
          )}

          {loading
            ? <View style={{ alignItems: 'center', padding: 32 }}><ActivityIndicator color={C.primary} size="large" /></View>
            : (
              <TouchableOpacity style={[s.btn, !provider && { opacity: 0.5 }]} onPress={pay} disabled={!provider} activeOpacity={0.85}>
                <LinearGradient colors={['#C8102E', '#9A0B23']} style={s.btnGrad}>
                  <Text style={s.btnText}>
                    {amount ? `Pay KES ${Number(amount).toLocaleString('en-KE')}` : 'Pay Bill'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function F({ label, value, set, ph, kb = 'default', secure = false }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} placeholder={ph} placeholderTextColor={C.textMuted} value={value} onChangeText={set} keyboardType={kb} secureTextEntry={secure} />
    </View>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16 },
  back:         { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: '#fff' },
  content:      { flex: 1, padding: 20 },
  label:        { fontSize: 11, fontWeight: '700', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  provCard:     { width: '31%', backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: C.border },
  provCardActive:{ backgroundColor: C.primary, borderColor: C.primary },
  provName:     { fontSize: 11, fontWeight: '600', color: C.text, textAlign: 'center' },
  input:        { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, height: 52, fontSize: 15, color: C.text },
  btn:          { borderRadius: 12, overflow: 'hidden', marginBottom: 32, marginTop: 8 },
  btnGrad:      { height: 54, alignItems: 'center', justifyContent: 'center' },
  btnText:      { fontSize: 16, fontWeight: '700', color: '#fff' },
});
