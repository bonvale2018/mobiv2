import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { C } from '../constants';

import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/home/DashboardScreen';
import StatementScreen from '../screens/home/StatementScreen';
import TransferScreen  from '../screens/transfer/TransferScreen';
import MPESAScreen     from '../screens/payments/MPESAScreen';
import BillsScreen     from '../screens/payments/BillsScreen';
import AirtimeScreen   from '../screens/payments/AirtimeScreen';
import BranchesScreen  from '../screens/branches/BranchesScreen';
import SettingsScreen  from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TAB_ICONS: Record<string, [string, string]> = {
  Home:     ['home',            'home-outline'],
  Transfer: ['swap-horizontal', 'swap-horizontal-outline'],
  Payments: ['receipt',         'receipt-outline'],
  Branches: ['location',        'location-outline'],
  Settings: ['person',          'person-outline'],
};

function PaymentsHub({ navigation }: any) {
  const items = [
    { icon: 'phone-portrait-outline', label: 'MPESA',         sub: 'Deposit & Withdraw — Paybill 902363', color: '#059669', screen: 'MPESA' },
    { icon: 'receipt-outline',         label: 'Utility Bills', sub: 'KPLC, Water, DStv, GOtv, ZUKU…',     color: C.primary, screen: 'Bills' },
    { icon: 'cellular-outline',        label: 'Buy Airtime',  sub: 'Safaricom, Airtel, Telkom',            color: '#7C3AED', screen: 'Airtime' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 20, paddingTop: 60 }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: C.text, marginBottom: 4 }}>Payments</Text>
      <Text style={{ fontSize: 14, color: C.textSub, marginBottom: 24 }}>Select a service</Text>
      {items.map(o => (
        <TouchableOpacity
          key={o.screen}
          style={{ backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: o.color, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
          onPress={() => navigation.navigate(o.screen)}
          activeOpacity={0.8}
        >
          <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: o.color + '20', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Ionicons name={o.icon as any} size={26} color={o.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{o.label}</Text>
            <Text style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>{o.sub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.border} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   C.primary,
        tabBarInactiveTintColor: C.gray,
        tabBarStyle: { height: 68, paddingBottom: 10, paddingTop: 8, borderTopColor: C.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused }) => {
          const [active, inactive] = TAB_ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={(focused ? active : inactive) as any} size={24} color={focused ? C.primary : C.gray} />;
        },
      })}
    >
      <Tab.Screen name="Home"     component={DashboardScreen} />
      <Tab.Screen name="Transfer" component={TransferScreen} />
      <Tab.Screen name="Payments" component={PaymentsHub} />
      <Tab.Screen name="Branches" component={BranchesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const isLoggedIn = useStore(s => s.isLoggedIn);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Main"      component={MainTabs} />
              <Stack.Screen name="Statement" component={StatementScreen} />
              <Stack.Screen name="MPESA"     component={MPESAScreen} />
              <Stack.Screen name="Bills"     component={BillsScreen} />
              <Stack.Screen name="Airtime"   component={AirtimeScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login"    component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
