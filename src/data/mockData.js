export const mockData = [
  // ── INCOME ──────────────────────────────────────────────────────
  // Salary
  { id: 'TXN-001', title: 'Salary credited', amount: 84500, type: 'income', category: 'salary', date: '2025-08-01T09:47:00Z', note: 'Aug paycheck' },
  { id: 'TXN-002', title: 'Salary credited', amount: 84500, type: 'income', category: 'salary', date: '2025-09-01T09:51:00Z', note: 'Sep paycheck' },
  { id: 'TXN-003', title: 'Salary credited', amount: 84500, type: 'income', category: 'salary', date: '2025-10-01T09:43:00Z', note: 'Oct paycheck' },

  // Freelance
  { id: 'TXN-004', title: 'Toptal - UI project payment', amount: 32400, type: 'income', category: 'freelance', date: '2025-08-15T14:22:00Z', note: '' },
  { id: 'TXN-005', title: 'Figma audit - Startup client', amount: 18750, type: 'income', category: 'freelance', date: '2025-08-26T11:07:00Z', note: '' },
  { id: 'TXN-006', title: 'Designjoy contract', amount: 27300, type: 'income', category: 'freelance', date: '2025-09-12T16:34:00Z', note: '' },
  { id: 'TXN-007', title: 'Invoice settled - Priya Co.', amount: 14800, type: 'income', category: 'freelance', date: '2025-09-29T10:18:00Z', note: '' },
  { id: 'TXN-008', title: 'Framer template sale', amount: 9200, type: 'income', category: 'freelance', date: '2025-10-10T07:12:00Z', note: '' },
  { id: 'TXN-009', title: 'Monthly retainer - client', amount: 22500, type: 'income', category: 'freelance', date: '2025-10-22T13:45:00Z', note: '' },

  // Special income
  { id: 'TXN-010', title: 'Mom sent money', amount: 3000, type: 'income', category: 'freelance', date: '2025-09-18T19:03:00Z', note: 'Emergency top-up' },

  // ── RENT ────────────────────────────────────────────────────────
  { id: 'TXN-011', title: 'Rent - Aug', amount: 9200, type: 'expense', category: 'rent', date: '2025-08-03T10:15:00Z', note: '' },
  { id: 'TXN-012', title: 'Rent - Sep', amount: 9200, type: 'expense', category: 'rent', date: '2025-09-03T10:09:00Z', note: '' },
  { id: 'TXN-013', title: 'Rent - Oct', amount: 9200, type: 'expense', category: 'rent', date: '2025-10-03T10:22:00Z', note: '' },

  // ── SUBSCRIPTIONS ───────────────────────────────────────────────
  { id: 'TXN-014', title: 'Netflix', amount: 649, type: 'expense', category: 'subscription', date: '2025-08-05T10:00:00Z', note: '' },
  { id: 'TXN-015', title: 'Hotstar Premium', amount: 299, type: 'expense', category: 'subscription', date: '2025-08-05T10:03:00Z', note: '' },
  { id: 'TXN-016', title: 'Netflix', amount: 649, type: 'expense', category: 'subscription', date: '2025-09-05T10:00:00Z', note: '' },
  { id: 'TXN-017', title: 'Hotstar Premium', amount: 299, type: 'expense', category: 'subscription', date: '2025-09-05T10:03:00Z', note: '' },
  { id: 'TXN-018', title: 'Netflix', amount: 649, type: 'expense', category: 'subscription', date: '2025-10-05T10:00:00Z', note: '' },
  { id: 'TXN-019', title: 'Hotstar Premium', amount: 299, type: 'expense', category: 'subscription', date: '2025-10-05T10:03:00Z', note: '' },
  { id: 'TXN-020', title: 'AWS bill', amount: 1847, type: 'expense', category: 'subscription', date: '2025-10-07T08:31:00Z', note: '' },

  // ── TRANSPORT ───────────────────────────────────────────────────
  { id: 'TXN-021', title: 'Ola ride to airport', amount: 643, type: 'expense', category: 'transport', date: '2025-08-10T04:38:00Z', note: '' },
  { id: 'TXN-022', title: 'Uber - office commute', amount: 187, type: 'expense', category: 'transport', date: '2025-08-12T08:54:00Z', note: '' },
  { id: 'TXN-023', title: 'Rapido bike - quick errand', amount: 64, type: 'expense', category: 'transport', date: '2025-08-14T17:21:00Z', note: '' },
  { id: 'TXN-024', title: 'Uber - late night cab', amount: 312, type: 'expense', category: 'transport', date: '2025-08-16T23:47:00Z', note: '' },
  { id: 'TXN-025', title: 'Metro recharge', amount: 200, type: 'expense', category: 'transport', date: '2025-08-20T07:12:00Z', note: '' },
  { id: 'TXN-026', title: 'Ola - weekend trip', amount: 534, type: 'expense', category: 'transport', date: '2025-09-07T11:30:00Z', note: '' },
  { id: 'TXN-027', title: 'Rapido - pharmacy run', amount: 73, type: 'expense', category: 'transport', date: '2025-09-14T20:15:00Z', note: '' },
  { id: 'TXN-028', title: 'Uber - office late drop', amount: 246, type: 'expense', category: 'transport', date: '2025-09-21T22:09:00Z', note: '' },
  { id: 'TXN-029', title: 'Fuel top-up - tank full', amount: 2034, type: 'expense', category: 'transport', date: '2025-09-25T07:48:00Z', note: '' },
  { id: 'TXN-030', title: 'Uber - client meeting', amount: 423, type: 'expense', category: 'transport', date: '2025-10-08T09:17:00Z', note: '' },

  // ── SHOPPING ────────────────────────────────────────────────────
  { id: 'TXN-031', title: 'Amazon - monitor stand', amount: 2187, type: 'expense', category: 'shopping', date: '2025-09-10T21:38:00Z', note: '' },
  { id: 'TXN-032', title: 'Nykaa - skincare restock', amount: 1344, type: 'expense', category: 'shopping', date: '2025-09-15T19:52:00Z', note: '' },
  { id: 'TXN-033', title: 'Ikea - desk organiser', amount: 894, type: 'expense', category: 'shopping', date: '2025-09-22T15:40:00Z', note: '' },
  { id: 'TXN-034', title: 'Myntra - 3 tees + jeans', amount: 3127, type: 'expense', category: 'shopping', date: '2025-10-09T18:05:00Z', note: '' },

  // ── FOOD — Oct 12–13 burst (9 orders in 48 hrs) ─────────────────
  { id: 'TXN-035', title: 'Zomato - biryani', amount: 487, type: 'expense', category: 'food', date: '2025-10-12T09:15:00Z', note: '' },
  { id: 'TXN-036', title: 'Blinkit - Curd + bread', amount: 127, type: 'expense', category: 'food', date: '2025-10-12T10:44:00Z', note: '' },
  { id: 'TXN-037', title: 'Zomato - chicken rolls', amount: 348, type: 'expense', category: 'food', date: '2025-10-12T13:22:00Z', note: '' },
  { id: 'TXN-038', title: 'Swiggy - milkshake + fries', amount: 267, type: 'expense', category: 'food', date: '2025-10-12T16:47:00Z', note: '' },
  { id: 'TXN-039', title: 'Zomato - pan pizza', amount: 612, type: 'expense', category: 'food', date: '2025-10-12T22:33:00Z', note: '' },
  { id: 'TXN-040', title: 'Blinkit - munchies haul', amount: 344, type: 'expense', category: 'food', date: '2025-10-13T01:14:00Z', note: '' },
  { id: 'TXN-041', title: 'Swiggy - breakfast bowl', amount: 218, type: 'expense', category: 'food', date: '2025-10-13T08:59:00Z', note: '' },
  { id: 'TXN-042', title: 'Zomato - pasta + garlic bread', amount: 543, type: 'expense', category: 'food', date: '2025-10-13T13:35:00Z', note: '' },
  { id: 'TXN-043', title: 'Swiggy - late night momos', amount: 189, type: 'expense', category: 'food', date: '2025-10-13T23:52:00Z', note: '' },

  // ── FOOD — spread across Aug–Oct ────────────────────────────────
  { id: 'TXN-044', title: 'Swiggy - Sunday lunch', amount: 423, type: 'expense', category: 'food', date: '2025-08-11T12:30:00Z', note: '' },
  { id: 'TXN-045', title: 'Zomato - dinner with work call', amount: 677, type: 'expense', category: 'food', date: '2025-08-13T20:17:00Z', note: '' },
  { id: 'TXN-046', title: 'Blinkit - groceries', amount: 1034, type: 'expense', category: 'food', date: '2025-08-17T11:05:00Z', note: '' },
  { id: 'TXN-047', title: 'Swiggy - chai + snacks', amount: 148, type: 'expense', category: 'food', date: '2025-08-19T17:42:00Z', note: '' },
  { id: 'TXN-048', title: 'Zomato - biriyani weekend', amount: 512, type: 'expense', category: 'food', date: '2025-08-23T13:11:00Z', note: '' },
  { id: 'TXN-049', title: 'Swiggy - pav bhaji', amount: 234, type: 'expense', category: 'food', date: '2025-08-27T19:28:00Z', note: '' },
  { id: 'TXN-050', title: 'Zepto - quick grocery run', amount: 783, type: 'expense', category: 'food', date: '2025-09-04T10:22:00Z', note: '' },
  { id: 'TXN-051', title: 'Swiggy - office lunch', amount: 318, type: 'expense', category: 'food', date: '2025-09-09T13:02:00Z', note: '' },
  { id: 'TXN-052', title: 'Zomato - chicken burger', amount: 287, type: 'expense', category: 'food', date: '2025-09-16T22:41:00Z', note: '' },
  { id: 'TXN-053', title: 'Blinkit - eggs + veggies', amount: 432, type: 'expense', category: 'food', date: '2025-09-19T07:58:00Z', note: '' },
  { id: 'TXN-054', title: 'Split bill - Rohan', amount: 344, type: 'expense', category: 'food', date: '2025-09-24T21:17:00Z', note: 'Dinner split' },
  { id: 'TXN-055', title: 'Swiggy - friday night', amount: 561, type: 'expense', category: 'food', date: '2025-10-04T23:12:00Z', note: '' },

  // ── ENTERTAINMENT ───────────────────────────────────────────────
  { id: 'TXN-056', title: 'BookMyShow - 2 tickets', amount: 687, type: 'expense', category: 'entertainment', date: '2025-08-24T19:30:00Z', note: '' },
  { id: 'TXN-057', title: 'Steam - game sale', amount: 1247, type: 'expense', category: 'entertainment', date: '2025-09-11T23:47:00Z', note: '' },
  { id: 'TXN-058', title: 'PVR IMAX - Oppenheimer rerun', amount: 534, type: 'expense', category: 'entertainment', date: '2025-10-18T18:00:00Z', note: '' },
];
