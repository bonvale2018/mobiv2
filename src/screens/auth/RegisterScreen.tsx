import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useStore } from '../../store';
import { C, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../../constants';

export default function RegisterScreen({ navigation }: any) {
  const { setUser, setProfile, setLoggedIn, setAccounts, setTransactions } = useStore();

  const [step,      setStep]      = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [accNo,     setAccNo]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);

  const step1Valid = firstName.trim() && lastName.trim() && email.trim() && phone.trim();
  const step2Valid = accNo.trim() && password && confirm;

  const register = async () => {
    if (password.length < 8) { Alert.alert('Weak Password', 'Password must be at least 8 characters.'); return; }
    if (password !== confirm) { Alert.alert('Mismatch', 'Passwords do not match.'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const profile = { uid: cred.user.uid, firstName, lastName, email: email.trim(), phone, accountNumbers: [accNo] };
      await setDoc(doc(db, 'users', cred.user.uid), profile);

      setUser({ uid: cred.user.uid, email: cred.user.email, displayName: null });
      setProfile(profile);
      setAccounts(MOCK_ACCOUNTS);
      setTransactions(MOCK_TRANSACTIONS);
      setLoggedIn(true);
    } catch (e: any) {
      const msg: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email':        'Please enter a valid email address.',
        'auth/weak-password':        'Password is too weak.',
      };
      Alert.alert('Registration Failed', msg[e.code] ?? e.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, value, onChange, placeholder, keyboard = 'default', secure = false, cap = 'none' }: any) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={s.input}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        secureTextEntry={secure}
        autoCapitalize={cap}
        autoCorrect={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header}>
          <TouchableOpacity onPress={() => step === 2 ? setStep(1) : navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Create Account</Text>
          <Text style={s.headerSub}>Step {step} of 2</Text>
          <View style={s.dots}>
            <View style={[s.dot, { backgroundColor: '#fff' }]} />
            <View style={[s.dot, { backgroundColor: step === 2 ? '#fff' : 'rgba(255,255,255,0.4)' }]} />
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={s.card}>
            {step === 1 ? (
              <>
                <Field label="First Name"    value={firstName} onChange={setFirstName} placeholder="John"           cap="words" />
                <Field label="Last Name"     value={lastName}  onChange={setLastName}  placeholder="Doe"            cap="words" />
                <Field label="Email Address" value={email}     onChange={setEmail}     placeholder="your@email.com" keyboard="email-address" />
                <Field label="Phone Number"  value={phone}     onChange={setPhone}     placeholder="0712 345 678"   keyboard="phone-pad" />
                <TouchableOpacity style={s.btn} onPress={() => {
                  if (!step1Valid) { Alert.alert('Required', 'Please fill all fields.'); return; }
                  setStep(2);
                }} activeOpacity={0.85}>
                  <LinearGradient colors={['#C8102E', '#9A0B23']} style={s.btnGrad}>
                    <Text style={s.btnText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={s.notice}>
                  <Ionicons name="information-circle-outline" size={18} color={C.blue} />
                  <Text style={s.noticeText}>Enter your existing Bank of Baroda (Kenya) account number to link it with the app.</Text>
                </View>
                <Field label="Bank Account Number" value={accNo}    onChange={setAccNo}    placeholder="Enter account number" keyboard="numeric" />
                <Field label="Password"            value={password} onChange={setPassword} placeholder="Min. 8 characters" secure />
                <Field label="Confirm Password"    value={confirm}  onChange={setConfirm}  placeholder="Repeat password"    secure />
                <TouchableOpacity style={s.btn} onPress={register} disabled={loading} activeOpacity={0.85}>
                  <LinearGradient colors={['#C8102E', '#9A0B23']} style={s.btnGrad}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Create Account</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={{ alignItems: 'center', marginTop: 12 }} onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: C.textSub, fontSize: 14 }}>
                Already have an account? <Text style={{ color: C.primary, fontWeight: '700' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  header:      { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 44 },
  back:        { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSub:   { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2, marginBottom: 12 },
  dots:        { flexDirection: 'row', gap: 8 },
  dot:         { width: 8, height: 8, borderRadius: 4 },
  card:        { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, padding: 24, paddingTop: 32, flex: 1 },
  label:       { fontSize: 11, fontWeight: '700', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input:       { backgroundColor: C.bg, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, height: 50, fontSize: 15, color: C.text, marginBottom: 2 },
  notice:      { flexDirection: 'row', gap: 10, backgroundColor: C.blueBg, borderRadius: 10, padding: 14, marginBottom: 20 },
  noticeText:  { flex: 1, fontSize: 13, color: C.blue, lineHeight: 20 },
  btn:         { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  btnGrad:     { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText:     { fontSize: 16, fontWeight: '700', color: '#fff' },
});
