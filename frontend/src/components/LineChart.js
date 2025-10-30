import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TransactionLineChart = ({ transactions = [],showDates=true }) => {
  // Ensure transactions is always an array
  if (!Array.isArray(transactions)) transactions = [];

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const labels = sortedTransactions.map((t) =>
    new Date(t.date).toLocaleDateString("en-GB")
  );

  const incomeData = sortedTransactions
    .filter((t) => t.type === "income")
    .map((t) => t.amount);

  const expenseData = sortedTransactions
    .filter((t) => t.type === "expense")
    .map((t) => t.amount);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Transactions Over Time" },
    },
    scales: {
      x: {
        display: showDates, // hides or shows x-axis completely
        grid: { display: showDates },
        ticks: { display: showDates },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(200, 200, 200, 0.23)" },
      },}
  };

  return <Line data={data} options={options} />;
};

export default TransactionLineChart;
