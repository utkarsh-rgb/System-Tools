import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function OrderItems() {
  const [orders, setOrders] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    axios
      .get("http://localhost:5000/dashboard/order-items")
      .then((res) => {
        console.log("Fetched order items:", res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching order items:", err);
      })
      
  }, []);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedOrderId(null);
    setShowPopup(false);
  };

  const handleChange = (e) => setSearch(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchLoading(true);
      localStorage.setItem("searchedOrderId", search);
      navigate(`/dashboard/order-items/${search}`);
    }
  };

  const getOrderTotal = (orderItems) => {
    return orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
  };

  const getOrderItemCount = (orderItems) => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

 

  return (
    <div className="min-vh-100">
      <div className="container py-0">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div className="mb-3 mb-md-0">
                    <h2 className="display-6 fw-bold text-primary mb-2">
                      <i className="fas fa-shopping-bag me-3"></i>Order
                      Management
                    </h2>
                    <p className="text-muted mb-0">
                      <i className="fas fa-chart-line me-2"></i>
                      Total Orders:{" "}
                      <span className="fw-bold text-success">
                        {Object.keys(orders).length}
                      </span>
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="badge fs-6 px-3 py-2 me-3"
                      style={{
                        borderRadius: "15px",
                        background: "linear-gradient(45deg, #28a745, #20c997)",
                      }}
                    >
                      <i className="fas fa-check-circle me-2"></i>Active
                    </div>
                    <div
                      className="badge fs-6 px-3 py-2"
                      style={{
                        borderRadius: "15px",
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                      }}
                    >
                      <i className="fas fa-clock me-2"></i>Live Data
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-header bg-transparent border-0 p-4">
                <h4 className="card-title mb-0 text-primary">
                  <i className="fas fa-search me-3"></i>Quick Order Search
                </h4>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 align-items-end">
                    <div className="col-md-8">
                      <label
                        htmlFor="order-id-input"
                        className="form-label fw-semibold text-muted"
                      >
                        <i className="fas fa-hashtag me-2"></i>Enter Order ID
                      </label>
                      <input
                        id="order-id-input"
                        type="text"
                        placeholder="e.g., ORD123456"
                        value={search}
                        onChange={handleChange}
                        className="form-control form-control-sm shadow-sm"
                        style={{
                          borderRadius: "10px",
                          border: "2px solid #e9ecef",
                          fontSize: "0.9rem",
                          padding: "6px 10px",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn btn-sm w-100 shadow-sm"
                        disabled={searchLoading}
                        style={{
                          borderRadius: "12px",
                          background:
                            "linear-gradient(45deg, #007bff, #0056b3)",
                          border: "none",
                          color: "white",
                          fontSize: "0.9rem",
                          padding: "8px 12px",
                        }}
                      >
                        {searchLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Searching...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-search me-2"></i>Search Order
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="row">
          <div className="col-12">
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-header bg-transparent border-0 p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="card-title mb-0 text-primary">
                    <i className="fas fa-list-ul me-3"></i>All Orders
                  </h4>
                  <div
                    className="badge bg-light text-dark fs-6 px-3 py-2"
                    style={{ borderRadius: "10px" }}
                  >
                    {Object.keys(orders).length} Orders Found
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                {Object.keys(orders).length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                      <h4 className="text-muted">No Orders Available</h4>
                      <p className="text-muted">
                        Orders will appear here once they are created.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="row g-0 "
                    style={{
                      maxHeight: "80vh",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {Object.keys(orders).map((orderId, index) => (
                      <div key={orderId} className="col-12">
                        <div
                          onClick={() => handleOrderClick(orderId)}
                          className="d-flex align-items-center p-2 border-bottom position-relative"
                          style={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: index % 2 === 0 ? "#f8f9fa" : "white",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(45deg, #667eea15, #764ba215)";
                            e.currentTarget.style.transform =
                              "translateX(10px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              index % 2 === 0 ? "#f8f9fa" : "white";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          {/* <div className="me-4">
                            <div
                              className="rounded-circle p-2"
                              style={{
                                background:
                                  "linear-gradient(45deg, #667eea, #764ba2)",
                              }}
                            >
                              <i className="fas fa-receipt text-white"></i>
                            </div>
                          </div> */}
                          <div className="flex-grow-1">
                            <div className="row align-items-center">
                              <div className="col-md-3">
                                <h6 className="mb-1 fw-bold text-primary">
                                  <i className="fas fa-hashtagwe me-2"></i>Order
                                  #{orderId}
                                </h6>
                              </div>
                              <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                  <i className="fas fa-shopping-cart text-info me-2"></i>
                                  <span className="fw-semibold ">
                                    {getOrderItemCount(orders[orderId])} Items
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                  <i className="fas fa-rupee-sign text-success me-2"></i>
                                  <span className="fw-bold text-success fs-6">
                                    ₹{getOrderTotal(orders[orderId]).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-3 text-end">
                                <span
                                  className="badge bg-primary p-1 small"
                                  style={{ borderRadius: "10px" }}
                                >
                                  <i className="fas fa-eye me-2"></i>View
                                  Details
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showPopup &&
        selectedOrderId &&
        Array.isArray(orders[selectedOrderId]) && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={closePopup}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content border-0 shadow-lg"
                style={{ borderRadius: "20px" }}
              >
                {/* Modal Header */}
                <div
                  className="modal-header border-0 p-4"
                  style={{
                    background: "#0d6efd",
                    borderRadius: "20px 20px 0 0",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                      <i className="fas fa-receipt text-white"></i>
                    </div>
                    <div>
                      <h4 className="modal-title text-white mb-1 fw-bold">
                        Order Details
                      </h4>
                      <p className="text-white-50 mb-0">
                        Order ID: #{selectedOrderId}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={closePopup}
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body p-4">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card bg-primary bg-opacity-10 border-0 h-100">
                        <div className="card-body text-center">
                          <i className="fas fa-shopping-cart fa-2x text-primary mb-2"></i>
                          <h5 className="fw-bold">
                            {getOrderItemCount(orders[selectedOrderId])}
                          </h5>
                          <small className="text-muted">Total Items</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-success bg-opacity-10 border-0 h-100">
                        <div className="card-body text-center">
                          <i className="fas fa-rupee-sign fa-2x text-success mb-2"></i>
                          <h5 className="fw-bold">
                            ₹{getOrderTotal(orders[selectedOrderId]).toFixed(2)}
                          </h5>
                          <small className="text-muted">Total Amount</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead
                        style={{
                          background:
                            "linear-gradient(45deg, #667eea, #764ba2)",
                        }}
                      >
                        <tr>
                          <th className="text-black fw-bold py-3 px-4 border-0">
                            <i className="fas fa-box me-2"></i>Product
                          </th>
                          <th className="text-black fw-bold py-3 px-4 border-0 text-center">
                            <i className="fas fa-rupee-sign me-2"></i>Unit Price
                          </th>
                          <th className="text-black fw-bold py-3 px-4 border-0 text-center">
                            <i className="fas fa-sort-numeric-up me-2"></i>
                            Quantity
                          </th>
                          <th className="text-black fw-bold py-3 px-4 border-0 text-center">
                            <i className="fas fa-calculator me-2"></i>Total
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders[selectedOrderId].map((item, idx) => (
                          <tr
                            key={idx}
                            className="border-0"
                            style={{
                              background: idx % 2 === 0 ? "#f8f9fa" : "white",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <td className="p-1">
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                  <i className="fas fa-cube text-primary"></i>
                                </div>
                                <span className="fw-semibold">
                                  {item.product_name}
                                </span>
                              </div>
                            </td>
                            <td className="p-1 text-center">
                              <span
                                className="badge bg-light text-dark fs-6 px-3 py-2"
                                style={{ borderRadius: "10px" }}
                              >
                                ₹{Number(item.unit_price).toFixed(2)}
                              </span>
                            </td>
                            <td className="p-1 text-center">
                              <span
                                className="badge bg-info fs-6 px-3 py-2"
                                style={{ borderRadius: "10px" }}
                              >
                                {item.quantity}
                              </span>
                            </td>
                            <td className="p-1 text-center">
                              <span className="fw-bold text-success fs-5">
                                ₹{(item.unit_price * item.quantity).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr
                          style={{
                            background:
                              "linear-gradient(45deg, #28a745, #20c997)",
                          }}
                        >
                          <td
                            colSpan="3"
                            className="text-white fw-bold py-3 px-4 border-0 text-end fs-5"
                          >
                            <i className="fas fa-receipt me-2"></i>Grand Total:
                          </td>
                          <td className="text-white fw-bold py-3 px-4 border-0 text-center fs-4">
                            ₹{getOrderTotal(orders[selectedOrderId]).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer border-0 p-4">
                  <button
                    type="button"
                    className="btn btn-lg px-4 shadow-sm"
                    onClick={closePopup}
                    style={{
                      borderRadius: "15px",
                      background: "linear-gradient(45deg, #6c757d, #495057)",
                      border: "none",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-times me-2"></i>Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg px-4 shadow-sm ms-2"
                    onClick={() => {
                      navigate(`/dashboard/order-items/${selectedOrderId}`);
                      closePopup();
                    }}
                    style={{
                      borderRadius: "15px",
                      background: "#0d6efd",
                      border: "none",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-edit me-2"></i>Edit Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Custom Styles */}
      <style jsx>{`
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        .table tbody tr:hover {
          background: linear-gradient(45deg, #667eea15, #764ba215) !important;
          transform: scale(1.01);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card {
          animation: fadeIn 0.6s ease-out;
        }
        .modal-content {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
