import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#007bff",
  "#ffc107",
  "#28a745",
  "#dc3545",
  "#6f42c1",
  "#17a2b8",
  "#fd7e14",
  "#20c997",
];

const Admin_Dashboard = () => {
  const [ordersByDate, setOrdersByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/dashboard/admin_dashboard")
      .then((res) => {
        const grouped = groupAndSumByDate(res.data);
        setOrdersByDate(grouped);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching orders data:", err);
        setError("Failed to fetch orders data. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Group and sum quantities per product per date using reduce
  const groupAndSumByDate = (data) => {
    const result = data.reduce(
      (acc, { product_name, total_quantity, order_date }) => {
        const date = order_date.split("T")[0];
        if (!acc[date]) acc[date] = {};
        if (!acc[date][product_name]) acc[date][product_name] = 0;
        acc[date][product_name] += parseInt(total_quantity);
        return acc;
      },
      {}
    );

    const final = {};
    for (const date in result) {
      final[date] = Object.entries(result[date]).map(
        ([product_name, total_quantity]) => ({
          product_name,
          total_quantity,
        })
      );
    }

    return final;
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
  };

  // Calculate total quantity for a date
  const getTotalQuantity = (items) =>
    items.reduce((sum, item) => sum + item.total_quantity, 0);


  const formatDateOrToday = (dateStr) => {
  const todayStr = new Date().toISOString().split("T")[0]; // yyyy-mm-dd of today
  if (dateStr === todayStr) return "Today's Data";
  
  // Otherwise format the date nicely
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};


  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold border-bottom pb-2">
          📊 Order Dashboard
        </h2>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary me-2"
            title="Go Back"
          >
            ← Back
          </button>
          <Link to="/dashboard/admin_dashboard/history" className="btn btn-primary">
            View History
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <div>Loading orders data...</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && Object.keys(ordersByDate).length === 0 && (
        <div className="alert alert-warning text-center">
          No order data available.
        </div>
      )}

      {!loading &&
        !error &&
        Object.entries(ordersByDate).map(([date, items]) => (
          <div key={date} className="card shadow-sm mb-5">
            <div className="card-header bg-primary text-white fw-bold fs-5 d-flex justify-content-between align-items-center">
            <span>{formatDateOrToday(date)} - {formatDate(date)}</span>
              <span className="badge bg-warning text-dark fs-6">
                Total Items: {getTotalQuantity(items)}
              </span>
            </div>
            <div className="card-body row">
              <div className="col-md-6 mb-4 mb-md-0">
                <h5 className="fw-semibold">🧾 Product Totals</h5>
                <ul className="list-group">
                  {items.map((item, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      aria-label={`${item.product_name}: ${item.total_quantity}`}
                    >
                      <span>{item.product_name}</span>
                      <span className="badge bg-success rounded-pill">
                        {item.total_quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-md-6">
                <h5 className="fw-semibold mb-3">📈 Product Distribution</h5>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={items}
                      dataKey="total_quantity"
                      nameKey="product_name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={false}
                    >
                      {items.map((_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        `Quantity of ${name}`,
                      ]}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Admin_Dashboard;
