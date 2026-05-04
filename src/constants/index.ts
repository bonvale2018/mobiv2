// ─── Colors ───────────────────────────────────────────────────
export const C = {
  primary:     '#C8102E',
  primaryDark: '#9A0B23',
  primaryBg:   '#FFF0F2',
  white:       '#FFFFFF',
  black:       '#111827',
  bg:          '#F4F5F7',
  card:        '#FFFFFF',
  border:      '#E5E7EB',
  gray:        '#9CA3AF',
  text:        '#111827',
  textSub:     '#6B7280',
  textMuted:   '#9CA3AF',
  green:       '#10B981',
  greenBg:     '#D1FAE5',
  red:         '#EF4444',
  redBg:       '#FEE2E2',
  amber:       '#F59E0B',
  amberBg:     '#FEF3C7',
  blue:        '#3B82F6',
  blueBg:      '#DBEAFE',
  purple:      '#8B5CF6',
  purpleBg:    '#EDE9FE',
  teal:        '#059669',
  tealBg:      '#D1FAE5',
};

// ─── App info ──────────────────────────────────────────────────
export const APP = {
  name:     'Kenya Baroda Mobi',
  bank:     'Bank of Baroda (Kenya) Ltd',
  version:  '1.0.0',
  paybill:  '902363',
  phone:    '+254 20 222 4400',
  email:    'kenyabaroda@in.bofa.com',
  web:      'https://www.bankofbaroda.co.ke',
  lostCard: '0800 720 264',
};

// ─── Utility providers ─────────────────────────────────────────
export const BILL_PROVIDERS = [
  { id: 'kplc_pre',  name: 'KPLC Prepaid',  icon: 'flash-outline',   min: 50,   max: 35000  },
  { id: 'kplc_post', name: 'KPLC Postpaid', icon: 'flash-outline',   min: 100,  max: 100000 },
  { id: 'nwsc',      name: 'Nairobi Water', icon: 'water-outline',   min: 100,  max: 50000  },
  { id: 'dstv',      name: 'DStv',          icon: 'tv-outline',      min: 100,  max: 20000  },
  { id: 'gotv',      name: 'GOtv',          icon: 'tv-outline',      min: 50,   max: 5000   },
  { id: 'zuku',      name: 'Zuku',          icon: 'wifi-outline',    min: 1000, max: 20000  },
  { id: 'nhif',      name: 'NHIF',          icon: 'medical-outline', min: 500,  max: 10000  },
];

// ─── Airtime providers ─────────────────────────────────────────
export const AIRTIME_PROVIDERS = [
  { id: 'safaricom', name: 'Safaricom', color: '#007A33', amounts: [10, 20, 50, 100, 200, 500] },
  { id: 'airtel',    name: 'Airtel',    color: '#E4002B', amounts: [10, 20, 50, 100, 200, 500] },
  { id: 'telkom',    name: 'Telkom',    color: '#0067B3', amounts: [10, 20, 50, 100, 200]      },
];

// ─── Branches ──────────────────────────────────────────────────
export const BRANCHES = [
  { id: '1', name: 'Nairobi Main Branch',  city: 'Nairobi',  address: 'Baroda House, Loita Street, CBD',   phone: '+254 20 222 4400', hours: 'Mon–Fri  8:30am – 4:00pm' },
  { id: '2', name: 'Westlands Branch',     city: 'Nairobi',  address: 'ABC Place, Waiyaki Way',            phone: '+254 20 444 5600', hours: 'Mon–Fri  8:30am – 4:00pm' },
  { id: '3', name: 'Mombasa Branch',       city: 'Mombasa',  address: 'Nkrumah Road, Mombasa CBD',        phone: '+254 41 222 3300', hours: 'Mon–Fri  8:30am – 3:30pm' },
  { id: '4', name: 'Kisumu Branch',        city: 'Kisumu',   address: 'Oginga Odinga Street',             phone: '+254 57 202 5500', hours: 'Mon–Fri  8:30am – 3:30pm' },
  { id: '5', name: 'Nakuru Branch',        city: 'Nakuru',   address: 'Kenyatta Avenue, Nakuru CBD',      phone: '+254 51 221 5600', hours: 'Mon–Fri  8:30am – 3:30pm' },
  { id: '6', name: 'Eldoret Branch',       city: 'Eldoret',  address: 'Uganda Road, Eldoret',             phone: '+254 53 206 3300', hours: 'Mon–Fri  8:30am – 3:30pm' },
];

// ─── Mock account data (used until real core-banking API is added) ──
export const MOCK_ACCOUNTS = [
  { accountNumber: '1234567890', accountType: 'Savings',  balance: 124930.50, currency: 'KES' },
  { accountNumber: '0987654321', accountType: 'Current',  balance:  45000.00, currency: 'KES' },
];

export const MOCK_TRANSACTIONS = [
  { id: 't1', type: 'credit', amount: 85000,  description: 'Salary Credit',              date: '2024-04-15', account: '1234567890' },
  { id: 't2', type: 'debit',  amount: 5000,   description: 'Transfer to Jane Mwangi',    date: '2024-04-22', account: '1234567890' },
  { id: 't3', type: 'debit',  amount: 3500,   description: 'DStv Subscription',          date: '2024-04-14', account: '1234567890' },
  { id: 't4', type: 'credit', amount: 5000,   description: 'MPESA Deposit',              date: '2024-04-25', account: '1234567890' },
  { id: 't5', type: 'debit',  amount: 2000,   description: 'KPLC Prepaid',               date: '2024-04-23', account: '1234567890' },
  { id: 't6', type: 'debit',  amount: 500,    description: 'Safaricom Airtime',          date: '2024-04-20', account: '1234567890' },
];
