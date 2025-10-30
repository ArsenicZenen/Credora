import React, { useState, useEffect } from "react";
import "./Stats.css";
import { getTransactions } from "../services/api";
import { useNavigate } from "react-router-dom";
import TransactionLineChart from "../components/LineChart";

import {
  FaMoneyBillWave,
  FaArrowCircleDown,
  FaPiggyBank,
} from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function Stats() {
  const navigate = useNavigate();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const incomeData = await getTransactions("income", token);
        const expenseData = await getTransactions("expense", token);

        const totalIncome = incomeData.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );
        const totalExpense = expenseData.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

        setIncome(totalIncome);
        setExpense(totalExpense);
        setBalance(totalIncome - totalExpense);
        const allTransactions = [
          ...incomeData.map((t) => ({ ...t, type: "income" })),
          ...expenseData.map((t) => ({ ...t, type: "expense" })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(allTransactions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);
  const donutData = {
    labels: ["Income", "Expenses", "Balance"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense, balance],
        backgroundColor: [
          "rgba(19, 224, 94, 0.86)", // vibrant green
          "rgba(202, 84, 84, 1)", // bright red
          "rgba(255, 205, 40, 0.7)", // bright yellow/gold
        ],
        borderColor: [
          "rgba(26, 168, 97, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(252, 211, 77, 1)",
        ],
        borderWidth: 3,
        hoverOffset: 10, // slight pop on hover
      },
    ],
  };
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // donut hole
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333", font: { weight: "600" } },
      },
      title: { display: true, color: "#111", font: { size: 20 } },
    },
  };
  const formatAmount = (amount) => {
    if (amount >= 1_000_000_000)
      return (amount / 1_000_000_000).toFixed(1) + "B";
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + "M";
    if (amount >= 1_000) return (amount / 1_000).toFixed(1) + "K";
    return amount;
  };

  return (
    <>
      <div className="Headers">
        <div className="stats-card income">
          <FaMoneyBillWave size={40} className="icon" />
          <h3>Income</h3>
          <p>₹{formatAmount(income)}</p>
        </div>

        <div className="stats-card expense">
          <FaArrowCircleDown size={40} className="icon" />
          <h3>Expenses</h3>
          <p>₹{formatAmount(expense)}</p>
        </div>

        <div className="stats-card balance">
          <FaPiggyBank size={40} className="icon" />
          <h3>Balance</h3>
          <p>₹{formatAmount(balance)}</p>
        </div>
      </div>
      <div className="chart-container">
        <div
          className="chart-card line"
          style={{
            marginTop: "40px",
            width: "90%",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <TransactionLineChart transactions={transactions} showDates={false} />
        </div>
        <div
          className="chart-card donut"
          style={{
            marginTop: "50px",
            width: "90%",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <div className="transactions-list">
          {transactions.map((t) => (
            <div key={t.id} className={`transaction-item ${t.type}`}>
              <span className={`transaction ${t.type}`}>
                {t.type === "income" ? "₹" : "₹"}
              </span>
              <span className="transaction-title">{t.title}</span>
              <span className="transaction-amount">
                {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
              </span>
              <span className="transaction-date">
                {new Date(t.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Stats;
