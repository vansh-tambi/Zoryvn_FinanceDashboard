export const mockData = (() => {
  const data = [];
  let id = 1;

  // Salary - Aug, Sep, Oct (3)
  ['2025-08-01', '2025-09-01', '2025-10-01'].forEach(date => data.push({id: `TXN-${id++}`, title: 'Salary Income', amount: 85000, type: 'income', category: 'salary', date: new Date(`${date}T10:00:00Z`).toISOString(), note: 'Monthly paycheck'}));

  // Freelance - Aug, Sep, Oct (6)
  ['2025-08-15', '2025-08-25', '2025-09-12', '2025-09-28', '2025-10-10', '2025-10-22'].forEach(date => data.push({id: `TXN-${id++}`, title: 'Freelance Project', amount: 35000, type: 'income', category: 'freelance', date: new Date(`${date}T14:30:00Z`).toISOString(), note: 'Contract work'}));

  // Rent - Aug, Sep, Oct (3)
  ['2025-08-03', '2025-09-03', '2025-10-03'].forEach(date => data.push({id: `TXN-${id++}`, title: 'Apartment Rent', amount: 20000, type: 'expense', category: 'rent', date: new Date(`${date}T09:00:00Z`).toISOString(), note: 'Monthly rent'}));

  // Subscriptions - Aug, Sep, Oct (6)
  ['2025-08-05', '2025-09-05', '2025-10-05'].forEach(date => {
    data.push({id: `TXN-${id++}`, title: 'Netflix', amount: 799, type: 'expense', category: 'subscription', date: new Date(`${date}T10:00:00Z`).toISOString(), note: 'Monthly plan'});
    data.push({id: `TXN-${id++}`, title: 'Hotstar', amount: 799, type: 'expense', category: 'subscription', date: new Date(`${date}T10:05:00Z`).toISOString(), note: 'Monthly plan'});
  });

  // Transport (10 items)
  for(let i=0; i<10; i++) { data.push({id: `TXN-${id++}`, title: 'Uber Ride', amount: 350 + (i*10), type: 'expense', category: 'transport', date: new Date(`2025-08-${10+i < 30 ? 10+i : 10}T18:00:00Z`).toISOString(), note: 'Commute'}); }

  // Shopping (4 items)
  for(let i=0; i<4; i++) { data.push({id: `TXN-${id++}`, title: 'Amazon Purchase', amount: 2500 + (i*500), type: 'expense', category: 'shopping', date: new Date(`2025-09-${10+i < 30 ? 10+i : 10}T20:00:00Z`).toISOString(), note: 'Miscellaneous supplies'}); }

  // Food Orders (Oct 12-13 Burst = 9, others = 14) -> Total 23
  // 9 in 48-hr window Oct 12-13
  for(let i=1; i<=9; i++) {
    const h = 8 + i; // 9 to 17
    const day = i <= 4 ? 12 : 13;
    data.push({id: `TXN-${id++}`, title: 'Zomato Order', amount: 450 + (i*20), type: 'expense', category: 'food', date: new Date(`2025-10-${day}T${h < 10 ? '0'+h : h}:00:00Z`).toISOString(), note: 'Food delivery weekend burst'});
  }
  // Remaining 14 food orders spread throughout
  for(let i=1; i<=14; i++) {
    data.push({id: `TXN-${id++}`, title: 'Swiggy Order', amount: 300 + (i*10), type: 'expense', category: 'food', date: new Date(`2025-08-${10+i < 30 ? 10+i : 10}T19:30:00Z`).toISOString(), note: 'Dinner order'});
  }

  return data;
})();
