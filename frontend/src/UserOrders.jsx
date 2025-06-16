import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

function UserOrders() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData") || "null");

  // Frontend Authorization Check
  if (userData?.role === "user" && userData.username !== username) {
    // Redirect or render unauthorized message
    return <Navigate to="/unauthorized" replace />;
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(
          `http://localhost:5000/dashboard/orders/${username}`
        );

        if (response.status === 404) {
          // User not found or no orders yet
          setOrders([]); // no orders
          setError(null); // no error
          return;
        }

        if (!response.ok) {
          // Other errors like 500 etc.
          throw new Error("Failed to fetch orders. Please try again later.");
        }

        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [username]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger mt-3" role="alert">
        <i className="bi bi-exclamation-triangle-fill"></i> Error: {error}
      </div>
    );

  return (
    <div className="container mt-4">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>

      <h2 className="mb-4">
        Orders for{" "}
        <span className="text-primary">
          {username.charAt(0).toUpperCase() + username.slice(1)}
        </span>
      </h2>

      {orders.length === 0 ? (
        <div
          className="alert alert-info d-flex flex-column flex-md-row align-items-center justify-content-center text-center text-md-start p-4 rounded-4 shadow-sm"
          style={{ minHeight: "150px" }}
        >
          <i
            className="bi bi-emoji-neutral text-info"
            style={{ fontSize: "3rem", marginRight: "1rem" }}
          ></i>
          <div>
            <h4 className="mb-2 fw-bold">No Orders Yet</h4>
            <p className="mb-0 fs-5">
              Looks like you didn’t order anything yet.
              <br />
              Start exploring and place your first order!
            </p>
          </div>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="card mb-4 shadow-sm rounded-4 border-0"
            style={{ transition: "transform 0.2s", cursor: "pointer" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-header bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center">
              <div>
                <strong>Order ID:</strong> {order.id}
              </div>
              <div className="text-end">
                <strong>Total Price:</strong>{" "}
                <span className="fs-5">
                  ₹{Number(order.total_order_price).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="card-body">
             <div className="mb-3 text-muted fst-italic">
  <div>
    <i className="bi bi-calendar-event me-2"></i>
    Ordered on:{" "}
    <span className="text-dark">
      {order.order_date || order.created_at
        ? formatDate(order.order_date || order.created_at)
        : "To be updated"}
    </span>
  </div>
  <div>
    <i className="bi bi-info-circle me-2"></i>
    <span className="fw-bold">Current Status:</span> {order.status}
    <span className="ms-2">
      {order.status_timestamp
        ? `(${formatDate(order.status_timestamp)})`
        : "(To be updated)"}
    </span>
  </div>
</div>


              <h5 className="card-title border-bottom pb-2 mb-3">
                <i className="bi bi-box-seam me-2"></i> Products
              </h5>

              {order.items && order.items.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {order.items.map((item) => {
                    const unitPrice = Number(
                      item.price || item.unit_price || 0
                    );
                    const quantity = Number(item.quantity || 0);
                    return (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{item.product_name}</strong>
                          <br />
                          Quantity: {quantity}
                          <br />
                          Price per unit: ₹{unitPrice.toFixed(2)}
                        </div>
                        <span
                          className="badge bg-success rounded-pill fs-6 d-flex align-items-center justify-content-center"
                          style={{
                            minWidth: "80px",
                            transition: "transform 0.2s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.2)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                          title="Total price"
                        >
                          ₹{(unitPrice * quantity).toFixed(2)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted">No products in this order.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserOrders;
