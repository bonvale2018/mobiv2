import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useStore } from '../../store';
import { C, APP } from '../../constants';
import SuccessScreen from '../../components/SuccessScreen';

type Tab = 'deposit' | 'withdraw';

function makeRef() {
  return 'BOB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

export default function MPESAScreen({ navigation }: any) {
  const { accounts, user, addTransaction } = useStore();
  const [tab,     setTab]     = useState<Tab>('deposit');
  const [phone,   setPhone]   = useState('');
  const [amount,  setAmount]  = useState('');
  const [pin,     setPin]     = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [ref,     setRef]     = useState('');

  const fromAcc = accounts[0];

  const validate = () => {
    if (!phone.trim() || !/^(07|01)\d{8}$/.test(phone)) { Alert.alert('Invalid Phone', 'Enter a valid Kenyan phone number e.g. 0712 345 678'); return false; }
    if (!amount || Number(amount) < 10) { Alert.alert('Invalid Amount', 'Minimum amount is KES 10.'); return false; }
    if (!pin || pin.length < 4) { Alert.alert('PIN Required', 'Enter your transaction PIN.'); return false; }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const txRef = makeRef();
      const isDeposit = tab === 'deposit';
      const tx = {
        uid:         user?.uid ?? '',
        type:        isDeposit ? 'credit' : 'debit',
        amount:      Number(amount),
        description: isDeposit ? `MPESA Deposit from ${phone}` : `MPESA Withdrawal to ${phone}`,
        date:        new Date().toISOString().split('T')[0],
        account:     fromAcc?.accountNumber ?? '',
        phone,
        txType:      tab,
        ref:         txRef,
        createdAt:   serverTimestamp(),
      };
      await addDoc(collection(db, 'transactions'), tx);
      addTransaction({ id: txRef, type: isDeposit ? 'credit' : 'debit', amount: Number(amount), description: tx.description, date: tx.date, account: tx.account });
      setRef(txRef);
      setDone(true);
    } catch (e: any) {
      Alert.alert('Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setDone(false); setPhone(''); setAmount(''); setPin(''); };

  if (done) return (
    <SuccessScreen
      title={tab === 'deposit' ? 'Deposit Recorded!' : 'Withdrawal Done!'}
      subtitle={`${tab === 'deposit' ? 'From' : 'To'} ${phone}`}
      amount={`KES ${Number(amount).toLocaleString('en-KE')}`}
      reference={ref}
      onDone={() => navigation.navigate('Home')}
      onNew={reset}
      newLabel="New MPESA"
    />
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={s.headerTitle}>MPESA Services</Text>
            <Text style={s.headerSub}>Paybill: {APP.paybill}</Text>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={s.tabs}>
          {(['deposit', 'withdraw'] as Tab[]).map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t === 'deposit' ? 'Deposit' : 'Withdraw'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={s.content} keyboardShouldPersistTaps="handled">
          {tab === 'deposit' && (
            <View style={s.notice}>
              <Ionicons name="information-circle-outline" size={18} color={C.blue} />
              <Text style={s.noticeText}>
                To deposit via M-Pesa: Go to{'\n'}
                M-Pesa → Lipa na M-Pesa → Pay Bill{'\n'}
                Business No: <Text style={{ fontWeight: '800' }}>{APP.paybill}</Text>{'\n'}
                Account No: your bank account number{'\n\n'}
                This form records the deposit in the system (test mode).
              </Text>
            </View>
          )}

          <F label="Phone Number"     value={phone}  set={setPhone}  ph="0712 345 678"  kb="phone-pad" />
          <F label="Amount (KES)"     value={amount} set={setAmount} ph="Enter amount"  kb="numeric"   />
          <F label="Transaction PIN"  value={pin}    set={setPin}    ph="Enter PIN"     kb="numeric"   secure />

          {loading
            ? <View style={{ alignItems: 'center', padding: 32 }}><ActivityIndicator color={C.primary} size="large" /></View>
            : (
              <TouchableOpacity style={s.btn} onPress={submit} activeOpacity={0.85}>
                <LinearGradient colors={['#059669', '#065F46']} style={s.btnGrad}>
                  <Text style={s.btnText}>{tab === 'deposit' ? 'Record Deposit' : 'Withdraw'}</Text>
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
  headerSub:    { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  tabs:         { flexDirection: 'row', margin: 20, backgroundColor: '#fff', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: C.border },
  tab:          { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive:    { backgroundColor: '#059669' },
  tabText:      { fontSize: 14, fontWeight: '600', color: C.gray },
  tabTextActive:{ color: '#fff' },
  content:      { flex: 1, paddingHorizontal: 20 },
  notice:       { flexDirection: 'row', gap: 10, backgroundColor: C.blueBg, borderRadius: 10, padding: 14, marginBottom: 20 },
  noticeText:   { flex: 1, fontSize: 13, color: C.blue, lineHeight: 20 },
  label:        { fontSize: 11, fontWeight: '700', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input:        { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, height: 52, fontSize: 15, color: C.text },
  btn:          { borderRadius: 12, overflow: 'hidden', marginBottom: 32, marginTop: 8 },
  btnGrad:      { height: 54, alignItems: 'center', justifyContent: 'center' },
  btnText:      { fontSize: 16, fontWeight: '700', color: '#fff' },
});
