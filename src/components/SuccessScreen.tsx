import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../constants';

interface Props {
  title: string;
  subtitle: string;
  amount?: string;
  reference?: string;
  onDone: () => void;
  onNew?: () => void;
  newLabel?: string;
}

export default function SuccessScreen({ title, subtitle, amount, reference, onDone, onNew, newLabel }: Props) {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.container}>
        <View style={s.iconWrap}>
          <Ionicons name="checkmark-circle" size={72} color={C.green} />
        </View>
        <Text style={s.title}>{title}</Text>
        <Text style={s.subtitle}>{subtitle}</Text>
        {amount && <Text style={s.amount}>{amount}</Text>}
        {reference && (
          <View style={s.refBox}>
            <Text style={s.refLabel}>Reference</Text>
            <Text style={s.refVal}>{reference}</Text>
          </View>
        )}
        <View style={s.btns}>
          {onNew && (
            <TouchableOpacity style={s.secondaryBtn} onPress={onNew}>
              <Text style={s.secondaryText}>{newLabel ?? 'New'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={s.primaryBtn} onPress={onDone} activeOpacity={0.85}>
            <LinearGradient colors={['#C8102E', '#9A0B23']} style={s.primaryGrad}>
              <Text style={s.primaryText}>Done</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#fff' },
  container:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconWrap:     { width: 110, height: 110, borderRadius: 55, backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title:        { fontSize: 24, fontWeight: '800', color: C.text, marginBottom: 6, textAlign: 'center' },
  subtitle:     { fontSize: 15, color: C.textSub, textAlign: 'center', marginBottom: 12 },
  amount:       { fontSize: 32, fontWeight: '900', color: C.green, marginBottom: 20 },
  refBox:       { backgroundColor: C.bg, borderRadius: 12, padding: 16, alignItems: 'center', width: '100%', marginBottom: 32 },
  refLabel:     { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  refVal:       { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 4, letterSpacing: 1 },
  btns:         { flexDirection: 'row', gap: 12, width: '100%' },
  secondaryBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  secondaryText:{ fontSize: 15, fontWeight: '600', color: C.textSub },
  primaryBtn:   { flex: 2, borderRadius: 12, overflow: 'hidden' },
  primaryGrad:  { height: 52, alignItems: 'center', justifyContent: 'center' },
  primaryText:  { fontSize: 16, fontWeight: '700', color: '#fff' },
});
