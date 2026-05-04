import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { C, APP, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../../constants';

const ACTIONS = [
  { id: 'transfer', icon: 'swap-horizontal-outline', label: 'Transfer',  screen: 'Transfer'  },
  { id: 'mpesa',    icon: 'phone-portrait-outline',  label: 'MPESA',     screen: 'MPESA'     },
  { id: 'bills',    icon: 'receipt-outline',          label: 'Pay Bills', screen: 'Bills'     },
  { id: 'airtime',  icon: 'cellular-outline',         label: 'Airtime',   screen: 'Airtime'   },
  { id: 'stmt',     icon: 'document-text-outline',   label: 'Statement', screen: 'Statement' },
  { id: 'branches', icon: 'location-outline',         label: 'Branches',  screen: 'Branches'  },
];

export default function DashboardScreen({ navigation }: any) {
  const { profile, accounts, transactions, setAccounts, setTransactions } = useStore();
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  const firstName = profile?.firstName || 'Customer';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const primary = accounts[0];
  const recent  = transactions.slice(0, 5);

  const onRefresh = async () => {
    setRefreshing(true);
    // Reset to mock data (real API call goes here later)
    setAccounts(MOCK_ACCOUNTS);
    setTransactions(MOCK_TRANSACTIONS);
    setTimeout(() => setRefreshing(false), 800);
  };

  const fmtKES = (n: number) =>
    n.toLocaleString('en-KE', { minimumFractionDigits: 2 });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {/* ── Header ── */}
        <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={s.headerRow}>
            <View>
              <Text style={s.greeting}>{greeting},</Text>
              <Text style={s.name}>{firstName} 👋</Text>
            </View>
            <TouchableOpacity style={s.bell}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ── Account card ── */}
          <View style={s.accountCard}>
            <View style={s.cardRow}>
              <View>
                <Text style={s.accType}>{primary?.accountType?.toUpperCase() ?? 'SAVINGS'}</Text>
                <Text style={s.accNum}>••••{(primary?.accountNumber ?? '7890').slice(-4)}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={20} color={C.textSub} />
              </TouchableOpacity>
            </View>
            <Text style={s.balLabel}>Available Balance</Text>
            <Text style={s.balance}>
              {showBalance ? `KES ${fmtKES(primary?.balance ?? 0)}` : 'KES •••••••'}
            </Text>
            {accounts.length > 1 && (
              <Text style={{ fontSize: 12, color: C.primary, fontWeight: '600', marginTop: 6 }}>
                +{accounts.length - 1} more account{accounts.length > 2 ? 's' : ''}
              </Text>
            )}
          </View>
        </LinearGradient>

        {/* ── Quick Actions ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.grid}>
            {ACTIONS.map(a => (
              <TouchableOpacity
                key={a.id}
                style={s.actionBtn}
                onPress={() => navigation.navigate(a.screen)}
                activeOpacity={0.8}
              >
                <View style={s.actionIcon}>
                  <Ionicons name={a.icon as any} size={24} color={C.primary} />
                </View>
                <Text style={s.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── MPESA banner ── */}
        <View style={s.section}>
          <LinearGradient colors={['#059669', '#065F46']} style={s.mpesaBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="phone-portrait-outline" size={28} color="#fff" />
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Deposit via M-Pesa — Lipa na M-Pesa</Text>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>Paybill: {APP.paybill}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Recent Transactions ── */}
        <View style={[s.section, { marginBottom: 32 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={s.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Statement')}>
              <Text style={{ fontSize: 13, color: C.primary, fontWeight: '600' }}>See All</Text>
            </TouchableOpacity>
          </View>

          {recent.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Ionicons name="receipt-outline" size={40} color={C.border} />
              <Text style={{ color: C.textMuted, marginTop: 8 }}>No transactions yet</Text>
            </View>
          ) : recent.map(tx => {
            const isIn = tx.type === 'credit';
            return (
              <View key={tx.id} style={s.txRow}>
                <View style={[s.txIcon, { backgroundColor: isIn ? C.greenBg : C.redBg }]}>
                  <Ionicons name={isIn ? 'arrow-down-outline' : 'arrow-up-outline'} size={18} color={isIn ? C.green : C.red} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.txDesc} numberOfLines={1}>{tx.description}</Text>
                  <Text style={s.txDate}>{tx.date}</Text>
                </View>
                <Text style={[s.txAmt, { color: isIn ? C.green : C.red }]}>
                  {isIn ? '+' : '-'}KES {tx.amount.toLocaleString('en-KE')}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  header:       { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 52 },
  headerRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting:     { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  name:         { fontSize: 22, fontWeight: '800', color: '#fff' },
  bell:         { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  accountCard:  { backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6, marginTop: -8 },
  cardRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  accType:      { fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: 1 },
  accNum:       { fontSize: 13, color: C.textSub, marginTop: 2 },
  balLabel:     { fontSize: 12, color: C.textMuted, marginBottom: 4 },
  balance:      { fontSize: 30, fontWeight: '900', color: C.text },
  section:      { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionBtn:    { width: '31%', backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  actionIcon:   { width: 44, height: 44, borderRadius: 12, backgroundColor: C.primaryBg, alignItems: 'center', justifyContent: 'center' },
  actionLabel:  { fontSize: 11, fontWeight: '600', color: C.text, textAlign: 'center' },
  mpesaBanner:  { borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  txRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.bg },
  txIcon:       { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txDesc:       { fontSize: 14, fontWeight: '600', color: C.text },
  txDate:       { fontSize: 12, color: C.textMuted, marginTop: 2 },
  txAmt:        { fontSize: 14, fontWeight: '700' },
});
