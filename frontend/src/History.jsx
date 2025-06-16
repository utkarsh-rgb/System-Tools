import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function History() {
  const [ordersByDate, setOrdersByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:5000/dashboard/admin_dashboard/history")
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setError("Unexpected data format received from server.");
          setLoading(false);
          return;
        }

        const grouped = groupAndSumByDate(res.data);
        setOrdersByDate(grouped);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch order history. Please try again later.");
        setLoading(false);
      });
  };

  const groupAndSumByDate = (data) => {
    const result = data.reduce((acc, { product_name, total_quantity, order_date }) => {
      if (!product_name || !order_date) return acc;

      const date = order_date.split("T")[0];

      if (!acc[date]) acc[date] = {};
      if (!acc[date][product_name]) acc[date][product_name] = 0;

      acc[date][product_name] += parseInt(total_quantity) || 0;
      return acc;
    }, {});

    const final = {};
    for (const date in result) {
      final[date] = Object.entries(result[date]).map(([product_name, total_quantity]) => ({
        product_name,
        total_quantity,
      }));
    }
    return final;
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
  };

  // Total items ordered overall
  const totalItemsOverall = Object.values(ordersByDate)
    .flat()
    .reduce((sum, item) => sum + Number(item.total_quantity), 0);

  if (loading)
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading order history...</p>
      </div>
    );

  if (error)
    return (
      <div className="container my-5 text-center text-danger">
        <h4>{error}</h4>
        <button className="btn btn-outline-primary mt-3" onClick={fetchOrderHistory}>
          Retry
        </button>
        <br />
        <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
      </div>
    );

  if (Object.keys(ordersByDate).length === 0)
    return (
      <div className="container my-5 text-center">
        <h4>No orders available to display.</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
      </div>
    );

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">📊 Daily Order Summary</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="alert alert-info fs-5 fw-semibold" role="alert">
        Total Items Ordered Overall: <span className="badge bg-primary">{totalItemsOverall}</span>
      </div>

      {Object.entries(ordersByDate).map(([date, items], idx) => {
        const dailyTotal = items.reduce(
          (sum, item) => sum + Number(item.total_quantity),
          0
        );

        return (
          <div key={idx} className="mb-5">
            <h5 className="bg-primary text-white p-3 rounded">
              Date: {formatDate(date)} — 🧾 Total Items Ordered:{" "}
              <span className="badge bg-warning text-dark">{dailyTotal}</span>
            </h5>

            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Quantity Ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{item.product_name}</td>
                      <td>{item.total_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
