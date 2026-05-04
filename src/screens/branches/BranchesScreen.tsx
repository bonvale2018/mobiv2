import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, BRANCHES } from '../../constants';

export default function BranchesScreen({ navigation }: any) {
  const [search, setSearch] = useState('');

  const filtered = BRANCHES.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <LinearGradient colors={['#C8102E', '#6B0517']} style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Branch Locator</Text>
      </LinearGradient>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={18} color={C.gray} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Search by city or branch name…"
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={C.gray} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={b => b.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Ionicons name="location-outline" size={48} color={C.border} />
            <Text style={{ color: C.textMuted, marginTop: 12 }}>No branches found</Text>
          </View>
        }
        renderItem={({ item: b }) => (
          <View style={s.card}>
            <View style={s.cardTop}>
              <View style={s.iconBox}>
                <Ionicons name="business-outline" size={22} color={C.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.branchName}>{b.name}</Text>
                <Text style={s.city}>{b.city}</Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.infoRow}>
              <Ionicons name="location-outline" size={14} color={C.gray} />
              <Text style={s.infoText}>{b.address}</Text>
            </View>
            <View style={s.infoRow}>
              <Ionicons name="time-outline" size={14} color={C.gray} />
              <Text style={s.infoText}>{b.hours}</Text>
            </View>
            <TouchableOpacity style={s.infoRow} onPress={() => Linking.openURL(`tel:${b.phone}`)}>
              <Ionicons name="call-outline" size={14} color={C.primary} />
              <Text style={[s.infoText, { color: C.primary }]}>{b.phone}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: C.bg },
  header:     { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16 },
  back:       { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:{ fontSize: 18, fontWeight: '700', color: '#fff' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: C.border },
  searchInput:{ flex: 1, height: 44, fontSize: 14, color: C.text },
  card:       { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardTop:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconBox:    { width: 44, height: 44, borderRadius: 12, backgroundColor: C.primaryBg, alignItems: 'center', justifyContent: 'center' },
  branchName: { fontSize: 15, fontWeight: '700', color: C.text },
  city:       { fontSize: 13, color: C.textSub },
  divider:    { height: 1, backgroundColor: C.bg, marginBottom: 10 },
  infoRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  infoText:   { fontSize: 13, color: C.textSub, flex: 1 },
});
