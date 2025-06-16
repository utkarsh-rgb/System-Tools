import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import profileImg from "./assets/profile.png";
import "./Dashboard.css";
import { io } from "socket.io-client";

export default function Dashboard() {
  const navigate = useNavigate();

  // Socket instance
  const [socket, setSocket] = useState(null);

  // State variables
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // User data
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const username = userData.username || "Guest";
  const role = userData.role || "user";

  // Initialize socket connection
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const userUsername = user.username;

    if (!userUsername) return;

    // Create socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Register user with socket
    newSocket.emit("register", userUsername);
    console.log(`Socket registered with username: ${userUsername}`);

    // Listen for notifications
    newSocket.on("notification", (data) => {
      console.log("📨 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    // Cleanup function
    return () => {
      newSocket.off("notification");
      newSocket.disconnect();
    };
  }, []);

  // Set cart count from localStorage
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartCount(cartItems.length);
  }, []);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/notification/${userData.username}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  const handleSignout = () => {
    // Disconnect socket before clearing localStorage
    if (socket) {
      socket.disconnect();
    }
    localStorage.clear();
    navigate("/");
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const toggleNotification = () => {
    setShowNotification((prev) => !prev);
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/notification/clear/${userData.username}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setNotifications([]);
        console.log("All notifications cleared");
      } else {
        console.error("Failed to clear notifications on server");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

const sidebarItems = [
  {
    path: "/dashboard/admin_dashboard",
    icon: "bi-house-door", // Dashboard/Home
    label: "Dashboard",
  },
  {
    path: "/dashboard/home",
    icon: "bi-box-seam", // Products
    label: "Products",
  },
  {
    path: "/dashboard/order-items",
    icon: "bi-cart-check", // Better for orders
    label: "Order Items",
  },
  ...(role === "admin"
    ? [
        {
          path: "/dashboard/addnewproduct",
          icon: "bi-plus-circle", // Add product
          label: "Add Product",
        },
      ]
    : []),
];

  return (
    <>
      {/* Notification Dropdown */}
      {showNotification && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            backgroundColor: "#fff",
            color: "#000",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            zIndex: 9999,
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h6 className="mb-0">Notifications</h6>

            <div>
              <button
                className="btn btn-sm btn-outline-danger me-2"
                onClick={handleClearAll}
              >
                Clear All
              </button>
              <button
                className="btn-close"
                style={{ fontSize: "0.8rem" }}
                onClick={() => setShowNotification(false)}
              />
            </div>
          </div>

          <hr />
          {notifications.length === 0 ? (
            <p className="text-muted">No notifications yet.</p>
          ) : (
            <ul className="list-unstyled mb-0">
              {notifications.map((note, idx) => (
                <li key={idx} className="mb-2">
                  {note.orderId && (
                    <div>
                      <strong>Order #{note.orderId}</strong>
                    </div>
                  )}
                  <div>{note.message}</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                    {note.status ? `Status: ${note.status} | ` : ""}
                    {new Date(
                      note.timestamp || note.created_at
                    ).toLocaleString()}
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
        <div className="container-fluid">
          {/* Mobile Sidebar Toggle - Only for Admin */}
          {role === "admin" && (
            <button
              className="btn btn-outline-light me-2 d-lg-none mobile-sidebar-toggle"
              onClick={toggleMobileSidebar}
              type="button"
            >
              <i className="bi bi-list"></i>
            </button>
          )}

          <Link className="navbar-brand fw-bold" to="/">
            <Shield size={24} className="me-2" />
            System Tools
          </Link>

          {/* Mobile Notification Bell - Always visible for users */}
          {role === "user" && (
            <button
              className="btn btn-outline-light d-lg-none"
              onClick={toggleNotification}
              style={{ position: "relative" }}
            >
              <i className="bi bi-bell-fill"></i>
              {notifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    textAlign: "center",
                  }}
                >
                  {notifications.length}
                </span>
              )}
            </button>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/home">
                  <i className="bi bi-house-door me-1"></i>Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/Offers">
                  <i className="bi bi-percent me-1"></i>Offers
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/solutions">
                  <i className="bi bi-lightbulb me-1"></i>Solutions
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/services">
                  <i className="bi bi-gear me-1"></i>Services
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/store">
                  <i className="bi bi-shop me-1"></i>Store
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav mb-2 mb-lg-0">
              {role === "user" && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/dashboard/userorders/${username}`}
                    >
                      <i className="bi bi-bag-check-fill me-2"></i>
                      My Orders
                    </Link>
                  </li>
                  {/* Desktop Notification Bell - Hidden on mobile */}
                  <li className="nav-item d-none d-lg-block">
                    <button
                      className="nav-link btn btn-link text-white text-decoration-none"
                      onClick={toggleNotification}
                    >
                      <i className="bi bi-bell-fill me-2"></i>
                      Notification
                      {notifications.length > 0 && (
                        <span
                          style={{
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            padding: "0 6px",
                            marginLeft: "5px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {notifications.length}
                        </span>
                      )}
                    </button>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center ms-lg-3">
              {/* Profile dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="d-none d-sm-inline">{username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <h6 className="dropdown-header">
                      <i className="bi bi-person-circle me-2"></i>
                      {greeting}, {username}!
                    </h6>
                  </li>
                  <li>
                    <span className="dropdown-item-text small text-muted">
                      Role: {role === "admin" ? "Administrator" : "User"}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleSignout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar - Only for Admin */}
      {role === "admin" && (
        <nav className="sidebar-desktop bg-white border-end shadow-sm">
          <div className="p-3">
            <div className="text-center mb-4 pb-3 border-bottom">
              <img
                src={profileImg}
                alt="Profile"
                className="rounded-circle mb-2"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
              <h6 className="mb-1">{username}</h6>
              <small className="text-muted">Administrator</small>
            </div>

            <nav className="nav flex-column">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-link-custom"
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </nav>
      )}

      {/* Mobile Sidebar Overlay - Only for Admin */}
      {role === "admin" && (
        <div
          className={`mobile-sidebar-overlay ${
            mobileSidebarOpen ? "show" : ""
          }`}
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Mobile Sidebar - Only for Admin */}
      {role === "admin" && (
        <nav className={`sidebar-mobile ${mobileSidebarOpen ? "show" : ""}`}>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mx-auto">Menu</h5>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={closeMobileSidebar}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="p-3">
            <div className="text-center mb-4 pb-3 border-bottom">
              <img
                src={profileImg}
                alt="Profile"
                className="rounded-circle mb-2"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
              <h6 className="mb-1">{username}</h6>
              <small className="text-muted">Administrator</small>
            </div>

            <nav className="nav flex-column">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-link-custom"
                  onClick={closeMobileSidebar}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <hr className="my-3" />

            <button
              className="nav-link-custom w-100 border-0 bg-transparent text-start"
              onClick={handleSignout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main content area */}
      <div
        className="main-content"
        style={{
          paddingTop: "76px",
          minHeight: "100vh",
          marginLeft: role === "admin" ? undefined : "0",
        }}
      >
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}
