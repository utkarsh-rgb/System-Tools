import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

function Cart() {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData || !userData.username) {
    alert("User not logged in properly.");
    setLoading(false);
    return;
  }

  const username = userData.username;
  // Load cart from localStorage when component mounts
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const initializedItems = storedItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(initializedItems);
  }, []);

  // Update quantity of an item
  const updateQuantity = (id, delta) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  // Payment handler
 const handlePayment = async () => {
  setLoading(true);

  try {
    const userData = localStorage.getItem("userData");
    const cart_Items = localStorage.getItem("cartItems");

    const response = await fetch("http://localhost:5000/dashboard/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userData: JSON.parse(userData),
        cartItems: JSON.parse(cart_Items),
      }),
    });

    if (response.ok) {
      localStorage.removeItem("cartItems");
      setCartItems([]);

      const result = await Swal.fire({
        title: "Your order has been placed successfully",
        text: "Click OK to go to My Orders",
        icon: "success",
        confirmButtonText: "Go to My Orders",
        showCancelButton: true,
        cancelButtonText: "Stay here",
      });

      if (result.isConfirmed) {
        navigate(`/dashboard/userorders/${username}`);
      } else {
        alert("You can visit 'My Orders' anytime from the dashboard.");
      }
    } else {
      alert("❌ Payment failed. Please try again.");
    }
  } catch (error) {
    alert("Error during payment");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between bg-white rounded-3 shadow-sm p-4">
              <div>
                <h2 className="mb-1 text-primary">
                  <i className="bi bi-cart3 me-2"></i>Your Cart
                </h2>
                <p className="text-muted mb-0">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
              <div className="text-end">
                <div className="badge bg-primary fs-6 px-3 py-2">
                  Total: ₹{total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty cart state
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center bg-white rounded-3 shadow-sm p-5">
                <div className="mb-4">
                  <i
                    className="bi bi-cart-x text-muted"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </div>
                <h4 className="text-muted mb-3">Your cart is empty</h4>
                <p className="text-muted mb-4">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link to="/dashboard/home">
                  <button className="btn btn-primary btn-lg">
                    <i className="bi bi-shop me-2"></i>Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8 mb-4">
              <div className="bg-white rounded-3 shadow-sm">
                <div className="p-4 border-bottom">
                  <h5 className="mb-0 text-dark">Cart Items</h5>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 ps-4">Product</th>
                        <th className="border-0 text-center">Price</th>
                        <th className="border-0 text-center">Quantity</th>
                        <th className="border-0 text-center">Total</th>
                        <th className="border-0 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="ps-4 py-4">
                            <div className="d-flex align-items-center">
                              <img
                                src={`http://localhost:5000${item.image_path}`}
                                alt={item.name}
                                className="rounded-2 shadow-sm me-3"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <h6 className="mb-1 fw-semibold">
                                  {item.name}
                                </h6>
                                <p
                                  className="text-muted small mb-0"
                                  style={{
                                    maxWidth: "250px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4">₹{item.price}</td>
                          <td className="text-center py-4">
                            <div className="d-flex justify-content-center align-items-center">
                              <button
                                className="btn btn-outline-secondary btn-sm rounded-circle"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="mx-3 fw-semibold">
                                {item.quantity}
                              </span>
                              <button
                                className="btn btn-outline-secondary btn-sm rounded-circle"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td className="text-center py-4">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="text-center py-4">
                            <button
                              className="btn btn-outline-danger btn-sm rounded-2"
                              onClick={() => removeItem(item.id)}
                              title="Remove item"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div
                className="bg-white rounded-3 shadow-sm sticky-top"
                style={{ top: "20px" }}
              >
                <div className="p-4 border-bottom">
                  <h5 className="mb-0 text-dark">Order Summary</h5>
                </div>
                <div className="p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">GST (18%)</span>
                    <span className="fw-semibold">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Shipping</span>
                    <span className="fw-semibold text-success">Free</span>
                  </div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="h6 mb-0">Total to Pay</span>
                    <span className="h5 mb-0 text-primary fw-bold">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-success btn-lg rounded-3 fw-semibold py-3"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-credit-card me-2"></i>
                          Proceed to Payment
                        </>
                      )}
                    </button>
                    <Link to="/dashboard/home">
                      <button className="btn btn-outline-primary rounded-3">
                        <i className="bi bi-arrow-left me-2"></i>
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                  <div className="text-center mt-4 p-3 bg-light rounded-3">
                    <div className="d-flex align-items-center justify-content-center text-muted small">
                      <i className="bi bi-shield-check me-2 text-success"></i>
                      Secure checkout guaranteed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
