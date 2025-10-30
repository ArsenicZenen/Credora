import React, { useEffect, useState } from "react";
import "./Adminstyles.css"
const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions([...data].reverse()); // newest first
    } catch (err) {
      console.error(err);
      alert("Error fetching transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/transactions/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Delete failed");
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting transaction");
    }
  };

  // Add transaction


  // Edit transaction
  const handleEdit = async (t) => {
    const title = prompt("Update title:", t.title);
    const amount = prompt("Update amount:", t.amount);
    // const category = prompt("Update category:", t.category);
    if (!title || !amount ) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/transactions/${t._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title, amount}),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      const updatedTransaction = await res.json();
      setTransactions((prev) =>
        prev.map((tr) => (tr._id === updatedTransaction._id ? updatedTransaction : tr))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating transaction");
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) 
     
  );

  return (
    
    <div className="manage-transactions-container">
      <h1>Manage Transactions</h1>

      <div className="manage-transactions-controls">
        {/* <button onClick={handleAdd}>Add Transaction</button> */}
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="manage-transactions-list">
        {filteredTransactions.map((t) => (
          <li key={t._id}>
            <span>
              {t.title} | ₹{t.amount} 
            </span>
            <div>
              <button onClick={() => handleEdit(t)}>Edit</button>
              <button onClick={() => handleDelete(t._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );}


export default ManageTransactions;
