import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useStore } from '../../store';
import { C, APP, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../../constants';

export default function LoginScreen({ navigation }: any) {
  const { setUser, setProfile, setLoggedIn, setAccounts, setTransactions } = useStore();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const login = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));

      let profile: any;
      if (snap.exists()) {
        profile = snap.data();
      } else {
        // First login — create a default profile
        profile = {
          uid:            cred.user.uid,
          firstName:      'Customer',
          lastName:       '',
          email:          cred.user.email ?? '',
          phone:          '',
          accountNumbers: ['1234567890'],
        };
        await setDoc(doc(db, 'users', cred.user.uid), profile);
      }

      setUser({ uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName });
      setProfile(profile);
      setAccounts(MOCK_ACCOUNTS);
      setTransactions(MOCK_TRANSACTIONS);
      setLoggedIn(true);
    } catch (e: any) {
      const msg: Record<string, string> = {
        'auth/invalid-credential':     'Email or password is incorrect.',
        'auth/user-not-found':          'No account found with this email.',
        'auth/wrong-password':          'Password is incorrect.',
        'auth/invalid-email':           'Please enter a valid email address.',
        'auth/too-many-requests':       'Too many attempts. Please try again later.',
      };
      Alert.alert('Login Failed', msg[e.code] ?? e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={s.logoBadge}>
            <Text style={s.logoLetter}>B</Text>
          </View>
          <Text style={s.bankName}>{APP.bank}</Text>
          <Text style={s.appName}>{APP.name}</Text>
        </LinearGradient>

        {/* Card */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={s.card}>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.sub}>Sign in to your account</Text>

            {/* Email */}
            <Text style={s.label}>Email Address</Text>
            <View style={s.inputRow}>
              <Ionicons name="mail-outline" size={18} color={C.gray} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="your@email.com"
                placeholderTextColor={C.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <Text style={s.label}>Password</Text>
            <View style={s.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={C.gray} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="Your password"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={{ padding: 4 }}>
                <Ionicons name={showPw ? 'eye-outline' : 'eye-off-outline'} size={18} color={C.gray} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
              <Text style={{ color: C.primary, fontSize: 13, fontWeight: '600' }}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login btn */}
            <TouchableOpacity style={s.btn} onPress={login} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#C8102E', '#9A0B23']} style={s.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.btnText}>Sign In</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
              <Text style={{ color: C.textSub, fontSize: 14 }}>New customer? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: C.primary, fontWeight: '700', fontSize: 14 }}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.bg },
  header:    { alignItems: 'center', paddingTop: 28, paddingBottom: 56, gap: 8 },
  logoBadge: { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  logoLetter:{ fontSize: 44, fontWeight: '900', color: '#fff' },
  bankName:  { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  appName:   { fontSize: 20, fontWeight: '800', color: '#fff' },
  card:      { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -28, padding: 24, paddingTop: 32, flex: 1 },
  title:     { fontSize: 24, fontWeight: '800', color: C.text, marginBottom: 4 },
  sub:       { fontSize: 14, color: C.textSub, marginBottom: 28 },
  label:     { fontSize: 11, fontWeight: '700', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  inputRow:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 12, marginBottom: 16 },
  inputIcon: { marginRight: 8 },
  input:     { flex: 1, height: 50, fontSize: 15, color: C.text },
  btn:       { borderRadius: 12, overflow: 'hidden' },
  btnGrad:   { height: 54, alignItems: 'center', justifyContent: 'center' },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
});
