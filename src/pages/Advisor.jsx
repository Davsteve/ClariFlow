import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useBusiness } from "../context/BusinessContext";

export default function Advisor() {
  const { businessId, loading } = useBusiness();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!businessId) return;
    fetchTransactions();
  }, [businessId]);

  async function fetchTransactions() {
    const { data } = await supabase
      .from("transactions")
      .select("*, categories(name, type)")
      .eq("business_id", businessId)
      .order("created_at", { ascending: true });

    if (data) setTransactions(data);
  }

  if (loading) return <div>Loading...</div>;

  if (!transactions.length) {
  return <p>No financial data yet.</p>
}

  // ------------------------
  // BASIC METRICS
  // ------------------------

  const income = transactions
    .filter((t) => t.categories?.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((t) => t.categories?.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const net = income - expense;

  // ------------------------
  // MONTHLY BURN + RUNWAY
  // ------------------------

  const monthlyExpenses = {};
  transactions.forEach((t) => {
    if (t.categories?.type !== "expense") return;
    const d = new Date(t.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthlyExpenses[key] = (monthlyExpenses[key] || 0) + t.amount;
  });

  const avgMonthlyBurn =
    Object.values(monthlyExpenses).length > 0
      ? Object.values(monthlyExpenses).reduce((a, b) => a + b, 0) /
        Object.values(monthlyExpenses).length
      : 0;

  const runway =
    avgMonthlyBurn > 0 ? (net / avgMonthlyBurn).toFixed(1) : 0;

  // ------------------------
  // EXPENSE DEPENDENCY
  // ------------------------

  const expenseMap = {};
  transactions.forEach((t) => {
    if (t.categories?.type !== "expense") return;
    const name = t.categories?.name || "Other";
    expenseMap[name] = (expenseMap[name] || 0) + t.amount;
  });

  let topCategory = "None";
  let topCategoryPercent = 0;

  Object.entries(expenseMap).forEach(([name, value]) => {
    const percent = expense > 0 ? (value / expense) * 100 : 0;
    if (percent > topCategoryPercent) {
      topCategoryPercent = percent;
      topCategory = name;
    }
  });

  // ------------------------
  // GROWTH (Last 2 Months)
  // ------------------------

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = new Date(currentYear, currentMonth - 1, 1);

  let thisMonthIncome = 0;
  let lastMonthIncome = 0;

  transactions.forEach((t) => {
    if (t.categories?.type !== "income") return;
    const d = new Date(t.created_at);

    if (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    ) {
      thisMonthIncome += t.amount;
    }

    if (
      d.getMonth() === lastMonth.getMonth() &&
      d.getFullYear() === lastMonth.getFullYear()
    ) {
      lastMonthIncome += t.amount;
    }
  });

  const growth =
    lastMonthIncome > 0
      ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
      : 0;

  // ------------------------
  // HEALTH SCORE
  // ------------------------


      // ------------------------
// VOLATILITY (Income Stability)
// ------------------------

const monthlyIncomeMap = {};

transactions.forEach((t) => {
  if (t.categories?.type !== "income") return;
  const d = new Date(t.created_at);
  const key = `${d.getFullYear()}-${d.getMonth()}`;
  monthlyIncomeMap[key] = (monthlyIncomeMap[key] || 0) + t.amount;
});

const monthlyIncomes = Object.values(monthlyIncomeMap);

let volatility = 0;

if (monthlyIncomes.length > 1) {
  const avg =
    monthlyIncomes.reduce((a, b) => a + b, 0) /
    monthlyIncomes.length;

  const variance =
    monthlyIncomes.reduce(
      (acc, val) => acc + Math.pow(val - avg, 2),
      0
    ) / monthlyIncomes.length;

  volatility = Math.sqrt(variance);
}


let score = 0;

// Profitability
if (net > 0) score += 25;
if (net > income * 0.2) score += 5;

// Runway
if (runway >= 6) score += 25;
else if (runway >= 3) score += 15;
else if (runway > 0) score += 5;

// Growth
if (growth > 10) score += 15;
else if (growth > 0) score += 8;

// Expense concentration
if (topCategoryPercent < 40) score += 15;
else if (topCategoryPercent < 60) score += 8;

// Volatility
if (volatility < 500) score += 10;
else if (volatility < 1500) score += 5;

if (score > 100) score = 100;

let risk = "High";

if (score >= 75) risk = "Low";
else if (score >= 50) risk = "Moderate";

// ------------------------
// CASH FLOW TREND (Last 3 Months)
// ------------------------

const last3Months = [];

for (let i = 2; i >= 0; i--) {
  const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
  const key = `${d.getFullYear()}-${d.getMonth()}`;

  const incomeVal =
    monthlyIncomeMap[key] || 0;

  last3Months.push(incomeVal);
}

let trend = "Stable";

if (last3Months.length === 3) {
  if (last3Months[2] > last3Months[1] &&
      last3Months[1] > last3Months[0]) {
    trend = "Upward";
  } else if (
    last3Months[2] < last3Months[1] &&
    last3Months[1] < last3Months[0]
  ) {
    trend = "Downward";
  }
}



  // ------------------------
  // UI
  // ------------------------

  return (
  <div style={{ padding: "40px" }}>

    <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
      AI Strategic Advisor
    </h1>

    {/* HEALTH CARD */}
    <div style={{
      background: "linear-gradient(145deg, #0f172a, #111827)",
      padding: "30px",
      borderRadius: "18px",
      marginBottom: "40px",
      boxShadow: "0 0 40px rgba(0, 255, 157, 0.05)"
    }}>
      <h2 style={{ fontSize: "26px" }}>
        Health Score:{" "}
        <span style={{
          color:
            score >= 75
              ? "#00ff9d"
              : score >= 50
              ? "#ffaa00"
              : "#ff4d4d"
        }}>
          {score}/100
        </span>
      </h2>

      <p>Risk Level: {risk}</p>
      <p>Trend: {trend}</p>
      <p>Volatility Index: {volatility.toFixed(0)}</p>
    </div>

    {/* METRICS GRID */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "40px"
    }}>
      <MetricCard label="Net Position" value={`₹ ${net}`} />
      <MetricCard label="Avg Monthly Burn" value={`₹ ${avgMonthlyBurn.toFixed(0)}`} />
      <MetricCard label="Runway" value={`${runway} months`} />
      <MetricCard label="Top Expense" value={`${topCategory} (${topCategoryPercent.toFixed(1)}%)`} />
    </div>

    {/* SUMMARY */}
    <PremiumSection title="Executive Summary">
      Net position is ₹{net}. Estimated runway is {runway} months.
      Revenue trend is {trend}. Income volatility index is {volatility.toFixed(0)}.
    </PremiumSection>

    <PremiumSection title="Key Risks">
      <ul>
        {runway < 3 && <li>Runway critically low.</li>}
        {growth < 0 && <li>Revenue declining month-over-month.</li>}
        {topCategoryPercent > 60 && (
          <li>Heavy dependency on {topCategory} expenses.</li>
        )}
        {volatility > 1500 && (
          <li>Income highly volatile.</li>
        )}
      </ul>
    </PremiumSection>

    <PremiumSection title="Recommendations">
      <ul>
        {runway < 3 && <li>Reduce burn immediately.</li>}
        {growth <= 0 && <li>Focus on revenue growth initiatives.</li>}
        {topCategoryPercent > 50 && (
          <li>Optimize {topCategory} spending.</li>
        )}
        {volatility > 1500 && (
          <li>Stabilize revenue sources.</li>
        )}
        {score >= 75 && (
          <li>Reinvest surplus into growth channels.</li>
        )}
      </ul>
    </PremiumSection>

  </div>
);

// ------------------------
// UI Components
// ------------------------

function MetricCard({ label, value }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #111827, #0f172a)",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 0 25px rgba(0, 191, 255, 0.05)",
      }}
    >
      <p style={{ opacity: 0.7, marginBottom: "8px" }}>{label}</p>
      <h3 style={{ fontSize: "22px" }}>{value}</h3>
    </div>
  );
}

function PremiumSection({ title, children }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0f172a, #111827)",
        padding: "30px",
        borderRadius: "18px",
        marginBottom: "30px",
        border: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 0 35px rgba(0, 191, 255, 0.03)",
      }}
    >
      <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
}