import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useStore } from '../../store';
import { C } from '../../constants';
import SuccessScreen from '../../components/SuccessScreen';

type TType = 'internal' | 'thirdparty';

function makeRef() {
  return 'BOB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

export default function TransferScreen({ navigation }: any) {
  const { accounts, user, addTransaction } = useStore();

  const [type,    setType]    = useState<TType>('internal');
  const [toAcc,   setToAcc]   = useState('');
  const [amount,  setAmount]  = useState('');
  const [narrate, setNarrate] = useState('');
  const [pin,     setPin]     = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [ref,     setRef]     = useState('');

  const fromAcc = accounts[0];

  const proceed = () => {
    if (!toAcc.trim() || toAcc.length < 6) { Alert.alert('Error', 'Enter a valid destination account number.'); return; }
    if (!amount || Number(amount) <= 0) { Alert.alert('Error', 'Enter a valid amount greater than 0.'); return; }
    if (fromAcc && Number(amount) > fromAcc.balance) { Alert.alert('Insufficient Funds', `Your available balance is KES ${fromAcc.balance.toLocaleString('en-KE')}`); return; }
    setShowPin(true);
  };

  const doTransfer = async () => {
    if (!pin || pin.length < 4) { Alert.alert('Error', 'Enter your transaction PIN.'); return; }
    setShowPin(false);
    setLoading(true);
    try {
      const txRef = makeRef();
      const tx = {
        uid:         user?.uid ?? '',
        type:        'debit' as const,
        amount:      Number(amount),
        description: narrate || `Transfer to ${toAcc}`,
        date:        new Date().toISOString().split('T')[0],
        account:     fromAcc?.accountNumber ?? '',
        toAccount:   toAcc,
        txType:      type,
        ref:         txRef,
        createdAt:   serverTimestamp(),
      };
      await addDoc(collection(db, 'transactions'), tx);
      addTransaction({ id: txRef, type: 'debit', amount: Number(amount), description: tx.description, date: tx.date, account: tx.account });
      setRef(txRef);
      setDone(true);
    } catch (e: any) {
      Alert.alert('Transfer Failed', e.message);
    } finally {
      setLoading(false);
      setPin('');
    }
  };

  const reset = () => { setDone(false); setToAcc(''); setAmount(''); setNarrate(''); setPin(''); };

  if (done) return (
    <SuccessScreen
      title="Transfer Successful!"
      subtitle={`To account ${toAcc}`}
      amount={`KES ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`}
      reference={ref}
      onDone={() => navigation.navigate('Home')}
      onNew={reset}
      newLabel="New Transfer"
    />
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Funds Transfer</Text>
        </LinearGradient>

        {/* Type tabs */}
        <View style={s.tabs}>
          {(['internal', 'thirdparty'] as TType[]).map(t => (
            <TouchableOpacity key={t} style={[s.tab, type === t && s.tabActive]} onPress={() => setType(t)}>
              <Text style={[s.tabText, type === t && s.tabTextActive]}>
                {t === 'internal' ? 'Own Accounts' : 'Third Party'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={s.content} keyboardShouldPersistTaps="handled">
          {/* From */}
          {fromAcc && (
            <View style={s.fromCard}>
              <Text style={s.fromLabel}>From Account</Text>
              <Text style={s.fromAcc}>{fromAcc.accountType} ••••{fromAcc.accountNumber.slice(-4)}</Text>
              <Text style={s.fromBal}>KES {fromAcc.balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</Text>
            </View>
          )}

          <F label="Destination Account" value={toAcc}   set={setToAcc}   ph="Enter account number" kb="numeric" />
          <F label="Amount (KES)"        value={amount}  set={setAmount}  ph="0.00"                 kb="numeric" />
          <F label="Narration (optional)"value={narrate} set={setNarrate} ph="e.g. Rent, School fees" />

          {type === 'thirdparty' && (
            <View style={s.feeBox}>
              <Ionicons name="information-circle-outline" size={16} color={C.amber} />
              <Text style={s.feeText}>A KES 50 fee applies for third-party transfers.</Text>
            </View>
          )}

          {loading ? (
            <View style={{ alignItems: 'center', padding: 32 }}><ActivityIndicator color={C.primary} size="large" /></View>
          ) : (
            <TouchableOpacity style={s.btn} onPress={proceed} activeOpacity={0.85}>
              <LinearGradient colors={['#C8102E', '#9A0B23']} style={s.btnGrad}>
                <Text style={s.btnText}>Review Transfer</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* PIN Modal */}
      <Modal visible={showPin} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.handle} />
            <Ionicons name="lock-closed" size={32} color={C.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={s.sheetTitle}>Enter Transaction PIN</Text>
            <Text style={s.sheetSub}>Authorise KES {Number(amount).toLocaleString('en-KE')} to {toAcc}</Text>
            <TextInput
              style={s.pinInput}
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              autoFocus
              placeholder="Enter PIN"
              placeholderTextColor={C.textMuted}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => { setShowPin(false); setPin(''); }}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.confirmBtn} onPress={doTransfer}>
                <Text style={s.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function F({ label, value, set, ph, kb = 'default' }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} placeholder={ph} placeholderTextColor={C.textMuted} value={value} onChangeText={set} keyboardType={kb} />
    </View>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16 },
  back:         { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: '#fff' },
  tabs:         { flexDirection: 'row', margin: 20, backgroundColor: '#fff', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: C.border },
  tab:          { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive:    { backgroundColor: C.primary },
  tabText:      { fontSize: 14, fontWeight: '600', color: C.gray },
  tabTextActive:{ color: '#fff' },
  content:      { flex: 1, paddingHorizontal: 20 },
  fromCard:     { backgroundColor: C.primaryBg, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FFC0C8' },
  fromLabel:    { fontSize: 11, fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  fromAcc:      { fontSize: 15, fontWeight: '700', color: C.primary, marginTop: 4 },
  fromBal:      { fontSize: 13, color: C.textSub },
  label:        { fontSize: 11, fontWeight: '700', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input:        { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, height: 52, fontSize: 15, color: C.text },
  feeBox:       { flexDirection: 'row', gap: 8, backgroundColor: C.amberBg, borderRadius: 10, padding: 12, marginBottom: 16 },
  feeText:      { flex: 1, fontSize: 13, color: '#92400E' },
  btn:          { borderRadius: 12, overflow: 'hidden', marginBottom: 32, marginTop: 8 },
  btnGrad:      { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText:      { fontSize: 16, fontWeight: '700', color: '#fff' },
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 12 },
  handle:       { width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 8 },
  sheetTitle:   { fontSize: 20, fontWeight: '800', color: C.text, textAlign: 'center' },
  sheetSub:     { fontSize: 13, color: C.textSub, textAlign: 'center' },
  pinInput:     { backgroundColor: C.bg, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, height: 56, textAlign: 'center', fontSize: 24, fontWeight: '700', letterSpacing: 12, color: C.text },
  cancelBtn:    { flex: 1, height: 50, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  cancelText:   { fontWeight: '600', color: C.textSub },
  confirmBtn:   { flex: 2, height: 50, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  confirmText:  { fontWeight: '700', color: '#fff', fontSize: 15 },
});
