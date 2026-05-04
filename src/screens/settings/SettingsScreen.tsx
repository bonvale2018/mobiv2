import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useStore } from '../../store';
import { C, APP } from '../../constants';

export default function SettingsScreen({ navigation }: any) {
  const { profile, logout } = useStore();
  const [notifs, setNotifs] = useState(true);

  const initials = profile
    ? `${profile.firstName[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  const doSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          logout();
        },
      },
    ]);
  };

  type RowProps = { icon: string; color?: string; bg?: string; label: string; sub?: string; onPress?: () => void; right?: React.ReactNode };

  const Row = ({ icon, color = C.text, bg = C.bg, label, sub, onPress, right }: RowProps) => (
    <TouchableOpacity style={s.row} onPress={onPress} disabled={!onPress && !right} activeOpacity={0.7}>
      <View style={[s.rowIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowLabel}>{label}</Text>
        {sub && <Text style={s.rowSub}>{sub}</Text>}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={C.border} /> : null)}
    </TouchableOpacity>
  );

  const Div = () => <View style={s.divider} />;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionCard}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <LinearGradient colors={['#C8102E', '#6B0517']} style={s.profileHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.profileName}>{profile ? `${profile.firstName} ${profile.lastName}` : 'Customer'}</Text>
            <Text style={s.profileEmail}>{profile?.email ?? ''}</Text>
            <View style={s.kyc}>
              <Ionicons name="shield-checkmark-outline" size={12} color={C.green} />
              <Text style={[s.kycText, { color: C.green }]}>Account Active</Text>
            </View>
          </View>
        </LinearGradient>

        <Section title="Security">
          <Row icon="key-outline" color={C.amber} bg={C.amberBg} label="Change Transaction PIN" sub="Update your PIN" onPress={() => Alert.alert('Coming Soon', 'PIN management coming in next update.')} />
          <Div />
          <Row icon="lock-closed-outline" color={C.primary} bg={C.primaryBg} label="Change Password" onPress={() => Alert.alert('Coming Soon', 'Password change coming in next update.')} />
        </Section>

        <Section title="Notifications">
          <Row
            icon="notifications-outline"
            color={C.blue}
            bg={C.blueBg}
            label="Push Notifications"
            right={<Switch value={notifs} onValueChange={setNotifs} trackColor={{ false: C.border, true: C.primary }} thumbColor="#fff" />}
          />
        </Section>

        <Section title="Support">
          <Row icon="headset-outline" color={C.primary} bg={C.primaryBg} label="Customer Support" sub={APP.phone} onPress={() => Linking.openURL(`tel:${APP.phone}`)} />
          <Div />
          <Row icon="card-outline" color={C.red} bg={C.redBg} label="Report Lost / Stolen Card" sub={APP.lostCard}
            onPress={() => Alert.alert('Lost Card Hotline', `Call immediately:\n${APP.lostCard}`, [
              { text: 'Call Now', onPress: () => Linking.openURL(`tel:${APP.lostCard}`) },
              { text: 'Cancel', style: 'cancel' },
            ])} />
          <Div />
          <Row icon="globe-outline" color="#0284C7" bg="#E0F2FE" label="Visit Website" sub={APP.web} onPress={() => Linking.openURL(APP.web)} />
        </Section>

        {/* App info */}
        <View style={{ alignItems: 'center', paddingVertical: 28, gap: 4 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff' }}>B</Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{APP.name}</Text>
          <Text style={{ fontSize: 12, color: C.textSub }}>{APP.bank}</Text>
          <Text style={{ fontSize: 11, color: C.textMuted }}>Version {APP.version}</Text>
          <Text style={{ fontSize: 11, color: C.textMuted }}>Regulated by the Central Bank of Kenya</Text>
        </View>

        <Section title="">
          <Row icon="log-out-outline" color={C.red} bg={C.redBg} label="Sign Out" onPress={doSignOut} />
        </Section>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: C.bg },
  profileHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14 },
  avatar:        { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText:    { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileName:   { fontSize: 16, fontWeight: '700', color: '#fff' },
  profileEmail:  { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  kyc:           { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  kycText:       { fontSize: 11, fontWeight: '600' },
  section:       { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle:  { fontSize: 11, fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingHorizontal: 4 },
  sectionCard:   { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  row:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12, minHeight: 60 },
  rowIcon:       { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel:      { fontSize: 15, fontWeight: '600', color: C.text },
  rowSub:        { fontSize: 12, color: C.textMuted, marginTop: 1 },
  divider:       { height: 1, backgroundColor: C.bg, marginLeft: 64 },
});
