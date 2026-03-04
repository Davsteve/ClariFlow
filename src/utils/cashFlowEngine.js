export function calculateCashFlow(transactions) {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  const monthlyMap = {};

  // ----------------------------
  // 1️⃣ GROUP TRANSACTIONS
  // ----------------------------
  transactions.forEach((t) => {
    if (!t.created_at) return;

    const date = new Date(t.created_at);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = { income: 0, expense: 0 };
    }

    if (t.categories?.type === "income") {
      monthlyMap[key].income += t.amount;
    } else {
      monthlyMap[key].expense += t.amount;
    }
  });

  // ----------------------------
  // 2️⃣ BUILD LAST 12 MONTHS (PADDED)
  // ----------------------------
  const now = new Date();
  const last12Months = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    const data = monthlyMap[key] || { income: 0, expense: 0 };

    last12Months.push({
      date: d,
      label: d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    });
  }

  // ----------------------------
  // 3️⃣ KPIs
  // ----------------------------
  const latestMonthNet =
    last12Months[last12Months.length - 1].net;

  const averageNet =
    last12Months.reduce((acc, curr) => acc + curr.net, 0) /
    last12Months.length;

  const averageExpense =
    last12Months.reduce((acc, curr) => acc + curr.expense, 0) /
    last12Months.length;

  // ----------------------------
  // 4️⃣ TREND DETECTION
  // ----------------------------
  const firstHalf = last12Months
    .slice(0, 6)
    .reduce((acc, curr) => acc + curr.net, 0);

  const secondHalf = last12Months
    .slice(6)
    .reduce((acc, curr) => acc + curr.net, 0);

  let trend = "Stable";
  if (secondHalf > firstHalf) trend = "Upward";
  if (secondHalf < firstHalf) trend = "Downward";

  // ----------------------------
  // 5️⃣ VOLATILITY
  // ----------------------------
  const mean = averageNet;

  const variance =
    last12Months.reduce((acc, curr) => {
      return acc + Math.pow(curr.net - mean, 2);
    }, 0) / last12Months.length;

  const volatilityScore = Math.sqrt(variance);

  let volatilityLevel = "Stable";

  if (volatilityScore > Math.abs(mean) * 0.8) {
    volatilityLevel = "High Volatility";
  } else if (volatilityScore > Math.abs(mean) * 0.4) {
    volatilityLevel = "Moderate Volatility";
  }

  // ----------------------------
  // RETURN (Dashboard Safe)
  // ----------------------------
  return {
    monthlyData: last12Months,   // contains net, income, expense
    latestMonthNet,
    averageNet,
    averageExpense,
    trend,
    volatilityScore: volatilityScore.toFixed(0),
    volatilityLevel,
    periodLabel: "Last 12 Months",
  };
}