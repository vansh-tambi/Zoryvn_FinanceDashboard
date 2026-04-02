export function getMonthlyTotals(transactions, monthString) {
  const filtered = transactions.filter(t => t.date.startsWith(monthString));
  const income = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export function getCategoryTotals(transactions) {
  const categories = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });
  return Object.keys(categories)
    .map(cat => ({ category: cat, total: categories[cat] }))
    .sort((a, b) => b.total - a.total);
}

export function getTotalBalance(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export function getSavingsRate(transactions) {
  const { income, expense } = getTotalBalance(transactions);
  if (income === 0) return 0;
  return ((income - expense) / income) * 100;
}

export function getPersonalityTags(transactions) {
  const tags = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return ['Careful Spender'];
  
  // Weekend spending
  const weekendTxns = expenses.filter(t => {
    const day = new Date(t.date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });
  if (weekendTxns.length > expenses.length * 0.25) {
    tags.push('Weekend Warrior');
  }

  // Late night orders
  const lateNightTxns = expenses.filter(t => {
    const hour = new Date(t.date).getHours();
    return hour >= 22 || hour <= 4;
  });
  if (lateNightTxns.length >= 3) {
    tags.push('Night Owl Shopper');
  }

  // Top category
  const cats = getCategoryTotals(transactions);
  if (cats.length > 0 && cats[0].category === 'food' && cats[0].total > 5000) {
    tags.push('Foodie');
  } else if (cats.length > 0) {
    tags.push(`Big on ${cats[0].category.charAt(0).toUpperCase() + cats[0].category.slice(1)}`);
  }

  // Subscription count
  const subs = expenses.filter(t => t.category === 'subscription');
  const uniqueSubs = new Set(subs.map(t => t.title)).size;
  if (uniqueSubs >= 2) {
    tags.push('Subscription Addict');
  }

  return tags.length > 0 ? tags : ['Balanced Spender'];
}

export function getSuspiciousPatterns(transactions) {
  const patterns = [];
  const expenses = transactions.filter(t => t.type === 'expense').sort((a, b) => new Date(a.date) - new Date(b.date));

  // 1. Rapid burst spending (e.g. tracking 48 hr windows)
  let maxBurstSize = 0;
  let burstDates = null;
  for (let i = 0; i < expenses.length; i++) {
    const windowStart = new Date(expenses[i].date).getTime();
    let burstSize = 1;
    for (let j = i + 1; j < expenses.length; j++) {
      const timeDiff = new Date(expenses[j].date).getTime() - windowStart;
      if (timeDiff <= 48 * 60 * 60 * 1000) {
        burstSize++;
      } else {
        break;
      }
    }
    if (burstSize > maxBurstSize) {
      maxBurstSize = burstSize;
    }
  }

  if (maxBurstSize >= 8) {
    patterns.push({ level: 'red', message: `Severe spending burst detected: ${maxBurstSize} purchases made within a 48-hour window.` });
  } else if (maxBurstSize >= 5) {
    patterns.push({ level: 'yellow', message: `Elevated spending activity: ${maxBurstSize} purchases in a 48-hour window.` });
  }

  // 2. Unusually large transaction outlier
  if (expenses.length > 0) {
    const avgExpense = expenses.reduce((acc, t) => acc + t.amount, 0) / expenses.length;
    const extremeOutliers = expenses.filter(t => t.amount > avgExpense * 4); // 4x the average
    if (extremeOutliers.length > 0) {
       patterns.push({ level: 'yellow', message: `Found ${extremeOutliers.length} unusually large outbound transactions relative to your average.` });
    }
  }

  if (patterns.length === 0) {
    patterns.push({ level: 'green', message: 'All transaction patterns look normal and secure.' });
  }

  return patterns;
}

export function getStoryInsights(transactions) {
  const insights = [];
  const { income, expense } = getTotalBalance(transactions);
  const savingsRate = getSavingsRate(transactions);

  insights.push({
    title: 'Financial Overview',
    description: `You've earned ₹${income.toLocaleString('en-IN')} and spent ₹${expense.toLocaleString('en-IN')}, saving roughly ${savingsRate.toFixed(1)}% of your income.`
  });

  const cats = getCategoryTotals(transactions);
  if (cats.length > 0) {
    const topCatInfo = cats[0];
    const percentage = ((topCatInfo.total / expense) * 100).toFixed(1);
    insights.push({
      title: 'Top Spending Area',
      description: `Your highest expense is ${topCatInfo.category}, hitting ₹${topCatInfo.total.toLocaleString('en-IN')} and taking up ${percentage}% of your outbound cash.`
    });
  }

  const expenses = transactions.filter(t => t.type === 'expense');
  const count = expenses.length;
  insights.push({
    title: 'Spending Frequency',
    description: `You've made ${count} total expense transactions, averaging about ₹${(count > 0 ? (expense / count) : 0).toFixed(0)} per purchase.`
  });

  return insights.slice(0, 3);
}

export function getMonthlyComparison(transactions) {
  // Extract all unique 'YYYY-MM' formats from the data
  const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort().reverse();
  const last3 = months.slice(0, 3).reverse(); // Ascending chrono order
  
  return last3.map(m => {
    const totals = getMonthlyTotals(transactions, m);
    // Formatting label nicely, e.g. "2025-08" -> "Aug"
    const dateObj = new Date(`${m}-01T12:00:00Z`);
    const label = dateObj.toLocaleDateString('en-US', { month: 'short' });

    return {
      month: m,
      label: label,
      income: totals.income,
      expense: totals.expense,
      balance: totals.balance
    };
  });
}

export function getMonthlyCategoryComparison(transactions) {
  const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort().reverse();
  const last3 = months.slice(0, 3).reverse();
  return last3.map(m => {
     const txns = transactions.filter(t => t.date.startsWith(m) && t.type === 'expense');
     const cats = {};
     txns.forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
     
     const dateObj = new Date(`${m}-01T12:00:00Z`);
     return {
        month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
        ...cats
     };
  });
}
