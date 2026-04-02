/* derive.js */
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
  if (income === 0) return -1; // Flag internally
  return ((income - expense) / income) * 100;
}

export function getPersonalityTags(transactions) {
  const tags = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return ['Careful Spender'];
  
  const weekendTxns = expenses.filter(t => {
    const day = new Date(t.date).getDay();
    return day === 0 || day === 6; 
  });
  if (weekendTxns.length > expenses.length * 0.25) {
    tags.push('Weekend Warrior');
  }

  const lateNightTxns = expenses.filter(t => {
    const hour = new Date(t.date).getHours();
    return hour >= 22 || hour <= 4;
  });
  if (lateNightTxns.length >= 3) {
    tags.push('Night Owl Shopper');
  }

  const cats = getCategoryTotals(transactions);
  if (cats.length > 0 && cats[0].category === 'food' && cats[0].total > 5000) {
    tags.push('Foodie');
  } else if (cats.length > 0) {
    tags.push(`Big on ${cats[0].category.charAt(0).toUpperCase() + cats[0].category.slice(1)}`);
  }

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

  if (expenses.length === 0) return [{ level: 'green', type: 'Recurring Pattern', timestamp: new Date().toLocaleDateString(), message: 'No irregular spending patterns detected.' }];

  let maxBurstSize = 0;
  let latestBurstDate = null;
  for (let i = 0; i < expenses.length; i++) {
    const windowStart = new Date(expenses[i].date).getTime();
    let burstSize = 1;
    let burstEnd = expenses[i].date;
    for (let j = i + 1; j < expenses.length; j++) {
      const timeDiff = new Date(expenses[j].date).getTime() - windowStart;
      if (timeDiff <= 48 * 60 * 60 * 1000) {
        burstSize++;
        burstEnd = expenses[j].date;
      } else {
        break;
      }
    }
    if (burstSize > maxBurstSize) {
      maxBurstSize = burstSize;
      latestBurstDate = burstEnd;
    }
  }

  if (maxBurstSize >= 8) {
    patterns.push({ level: 'red', type: 'Unusual Behavior', timestamp: new Date(latestBurstDate).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}), message: `Severe spending burst detected: ${maxBurstSize} purchases made within a 48-hour window.` });
  } else if (maxBurstSize >= 5) {
    patterns.push({ level: 'yellow', type: 'Unusual Behavior', timestamp: new Date(latestBurstDate).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}), message: `Elevated spending activity: ${maxBurstSize} purchases in a 48-hour window.` });
  }

  if (expenses.length > 0) {
    const avgExpense = expenses.reduce((acc, t) => acc + t.amount, 0) / expenses.length;
    const extremeOutliers = expenses.filter(t => t.amount > avgExpense * 4);
    if (extremeOutliers.length > 0) {
       const latest = extremeOutliers[extremeOutliers.length - 1];
       patterns.push({ level: 'yellow', type: 'High Value Expense', timestamp: new Date(latest.date).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}), message: `Found ${extremeOutliers.length} unusually large outbound transactions relative to your average.` });
    }
  }

  const hours = new Array(24).fill(0);
  expenses.forEach(t => {
      const hour = new Date(t.date).getHours();
      hours[hour]++;
  });
  
  let maxFreq = 0;
  let maxWindowStart = 0;
  for (let i = 0; i < 24; i++) {
      const windowFreq = hours[i] + hours[(i+1)%24] + hours[(i+2)%24];
      if (windowFreq > maxFreq && windowFreq >= 5) {
          maxFreq = windowFreq;
          maxWindowStart = i;
      }
  }

  if (maxFreq > 0) {
      const formatHour = (h) => h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
      const startHourStr = formatHour(maxWindowStart);
      const endHourStr = formatHour((maxWindowStart + 3) % 24);
      patterns.push({
          level: 'yellow',
          type: 'Recurring Pattern',
          timestamp: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), 
          message: `Most spending happens between ${startHourStr}–${endHourStr} (${maxFreq} transactions).`
      });
  }

  if (patterns.length === 0) {
    patterns.push({ level: 'green', type: 'Recurring Pattern', timestamp: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), message: 'All transaction patterns look normal and secure.' });
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
  const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort().reverse();
  const last3 = months.slice(0, 3).reverse(); 
  
  return last3.map(m => {
    const totals = getMonthlyTotals(transactions, m);
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

export function getActionableSuggestions(transactions) {
  const suggestions = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return suggestions;
  
  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);

  const foodTotal = expenses.filter(t => t.category === 'food').reduce((a, b) => a + b.amount, 0);
  if (totalExpense > 0 && foodTotal / totalExpense > 0.3) {
      const projectedSaving = foodTotal * 0.2;
      suggestions.push({
          icon: 'food',
          message: 'Food expenses exceed 30% of your total outbound cash. Try cooking just 2 more meals at home.',
          saving: projectedSaving,
          priority: 'amber'
      });
  }

  const subs = expenses.filter(t => t.category === 'subscription');
  const uniqueSubs = new Map();
  subs.forEach(s => uniqueSubs.set(s.title.toLowerCase(), s.amount));
  if (uniqueSubs.size >= 2) {
      const combined = Array.from(uniqueSubs.values()).reduce((a,b) => a+b, 0);
      suggestions.push({
          icon: 'plugin',
          message: `You have ${uniqueSubs.size} active subscriptions draining cash. Review for duplicates.`,
          saving: combined,
          priority: 'red'
      });
  }

  const savingsRate = getSavingsRate(transactions);
  if (savingsRate < 20 && savingsRate !== -1) {
      const income = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
      const targetSaving = income * 0.2;
      const currentSaving = income * (savingsRate/100);
      suggestions.push({
          icon: 'trending-up',
          message: 'Your savings rate fell below the 20% threshold. Try pausing non-essential purchases.',
          saving: targetSaving - currentSaving,
          priority: 'amber'
      });
  }

  const datesRow = expenses.sort((a,b) => new Date(b.date) - new Date(a.date));
  const currentMonthDate = datesRow.length > 0 ? datesRow[0].date.substring(0, 7) : new Date().toISOString().substring(0, 7);
  const currentMonthTxns = expenses.filter(t => t.date.startsWith(currentMonthDate));
  const prevMonthTxns = expenses.filter(t => !t.date.startsWith(currentMonthDate));
  
  if (prevMonthTxns.length > 0 && currentMonthTxns.length > 0) {
      const currCats = {};
      currentMonthTxns.forEach(t => currCats[t.category] = (currCats[t.category] || 0) + t.amount);
      const prevCats = {};
      prevMonthTxns.forEach(t => prevCats[t.category] = (prevCats[t.category] || 0) + t.amount);
      let prevMonthsCount = [...new Set(prevMonthTxns.map(t => t.date.substring(0, 7)))].length || 1;

      for (const [cat, total] of Object.entries(currCats)) {
          const prevAvg = (prevCats[cat] || 0) / prevMonthsCount;
          if (prevAvg > 0 && total > prevAvg * 3) {
              suggestions.push({
                  icon: 'alert-triangle',
                  message: `Your ${cat} spending spiked 3x higher than your historical average.`,
                  saving: total - prevAvg,
                  priority: 'red'
              });
              break; 
          }
      }
  }

  if (suggestions.length === 0) {
      suggestions.push({
          icon: 'check-circle',
          message: 'Your spending is well optimized. No immediate red flags detected.',
          saving: 0,
          priority: 'green'
      });
  }

  return suggestions;
}

export function getNoSpendStreak(transactions) {
    const expenses = transactions.filter(t => t.type === 'expense').map(t => t.date.substring(0, 10));
    const uniqueExpenseDates = [...new Set(expenses)].sort();
    
    if (uniqueExpenseDates.length === 0) return { currentStreak: 0, bestStreak: 0 };
    
    const start = new Date(uniqueExpenseDates[0]);
    const end = new Date(); 
    
    if (start > end) {
       return { currentStreak: 0, bestStreak: 0 };
    }

    const loopStart = new Date(`${start.toISOString().split('T')[0]}T12:00:00Z`);
    
    const actualEnd = new Date(uniqueExpenseDates[uniqueExpenseDates.length - 1]);
    const loopEndActual = new Date(`${actualEnd.toISOString().split('T')[0]}T12:00:00Z`);
    
    let realisticMax = 0;
    let realisticCurr = 0;
    for (let d = new Date(loopStart); d <= loopEndActual; d.setDate(d.getDate() + 1)) {
        const dStr = d.toISOString().split('T')[0];
        if (!uniqueExpenseDates.includes(dStr)) {
            realisticCurr++;
            if (realisticCurr > realisticMax) realisticMax = realisticCurr;
        } else {
            realisticCurr = 0;
        }
    }
    
    return {
        currentStreak: realisticCurr,
        bestStreak: Math.max(realisticMax, 2) 
    };
}
