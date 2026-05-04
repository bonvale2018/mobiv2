import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { C } from '../../constants';

export default function StatementScreen({ navigation }: any) {
  const { transactions, accounts } = useStore();
  const primary = accounts[0];

  const totalIn  = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'debit').reduce((s, t)  => s + t.amount, 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={s.headerTitle}>Mini Statement</Text>
            <Text style={s.headerSub}>••••{(primary?.accountNumber ?? '').slice(-4)}</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <View style={s.summary}>
          {[
            { label: 'Total In',  value: totalIn,  color: C.green },
            { label: 'Total Out', value: totalOut, color: C.red   },
            { label: 'Count',     value: transactions.length, color: '#fff', isCount: true },
          ].map((item, i) => (
            <View key={i} style={[s.summaryItem, i > 0 && s.summaryBorder]}>
              <Text style={s.summaryLabel}>{item.label}</Text>
              <Text style={[s.summaryVal, { color: item.color }]}>
                {item.isCount ? String(item.value) : `KES ${(item.value as number).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <FlatList
        data={transactions}
        keyExtractor={t => t.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Ionicons name="receipt-outline" size={48} color={C.border} />
            <Text style={{ color: C.textMuted, fontSize: 15, marginTop: 12 }}>No transactions yet</Text>
          </View>
        }
        renderItem={({ item: tx }) => {
          const isIn = tx.type === 'credit';
          return (
            <View style={s.txRow}>
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
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  header:       { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  headerRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  back:         { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:  { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerSub:    { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  summary:      { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12 },
  summaryItem:  { flex: 1, alignItems: 'center', padding: 12, gap: 4 },
  summaryBorder:{ borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  summaryVal:   { fontSize: 13, fontWeight: '700' },
  txRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.bg },
  txIcon:       { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txDesc:       { fontSize: 14, fontWeight: '600', color: C.text },
  txDate:       { fontSize: 12, color: C.textMuted, marginTop: 2 },
  txAmt:        { fontSize: 14, fontWeight: '700' },
});
