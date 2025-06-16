import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";
import Chatbot from "./Chatbot";
import { Link } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const username = userData.username || "Guest";
  const role = userData.role || "user";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"
    );

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartCount(cartItems.length);

    fetchProductsFromBackend();
  }, []);

  const fetchProductsFromBackend = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/dashboard/show_product", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data);
      localStorage.setItem("products", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (
      !window.confirm(`Are you sure you want to delete product with ID ${id}?`)
    )
      return;
    try {
      const res = await fetch(`http://localhost:5000/dashboard/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert(`Product with ID ${id} deleted successfully.`);
        setProducts(products.filter((product) => product.id !== id));
      } else {
        const errorData = await res.json();
        alert(
          `Failed to delete product: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const exists = cartItems.find((item) => item.id === product.id);
    if (exists) {
      alert("This item is already in your cart.");
      return;
    }

      const productToAdd = {
    ...product,
    price: Number(product.price), // Convert price to number
  };
    cartItems.push(productToAdd);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCartCount(cartItems.length);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate random ratings for demo
  const generateRating = () => {
    const ratings = [4.0, 4.2, 4.5, 4.7, 3.8, 4.1, 4.6];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  const generateReviews = () => {
    return Math.floor(Math.random() * 5000) + 100;
  };
  
const handleBuyNow = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      alert("Product not found");
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const exists = cartItems.find((item) => item.id === productId);
    if (!exists) {
      const productToAdd = {
        ...product,
        price: Number(product.price),
      };
      cartItems.push(productToAdd);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setCartCount(cartItems.length);
    }
    navigate("/dashboard/cart");
  };

  // Admin Table View Component
  const AdminTableView = () => (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
         <thead className="table-dark">
      <tr>
        <th scope="col" className="text-center" style={{ width: '60px' }}>ID</th>
        <th scope="col" className="text-center" style={{ width: '80px' }}>Image</th>
        <th scope="col" className="text-center">Product Name</th>
        <th scope="col" className="text-center" style={{ width: '400px' }}>Description</th>
        <th scope="col" className="text-end" style={{ width: '100px' }}>Price</th>
        <th scope="col" className="text-center" style={{ width: '150px' }}>Actions</th>
      </tr>
    </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td className="fw-bold text-primary">#{product.id}</td>
              <td>
                <img
                  src={`http://localhost:5000${product.image_path}`}
                  alt={product.name}
                  className="rounded"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover',
                    border: '2px solid #e9ecef'
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yNSAxNUMyMS42ODYzIDE1IDE5IDEyLjMxMzcgMTkgOUMxOSA1LjY4NjI5IDIxLjY4NjMgMyAyNSAzQzI4LjMxMzcgMyAzMSA1LjY4NjI5IDMxIDlDMzEgMTIuMzEzNyAyOC4zMTM3IDE1IDI1IDE1WiIgZmlsbD0iI0RFRTJFNiIvPgo8cGF0aCBkPSJNMzkgMzlWMzVDMzkgMjcuMjY4IDMyLjczMiAyMSAyNSAyMUMxNy4yNjggMjEgMTEgMjcuMjY4IDExIDM1VjM5SDM5WiIgZmlsbD0iI0RFRTJFNiIvPgo8L3N2Zz4K';
                  }}
                />
              </td>
              <td>
                <div className="fw-semibold text-dark text-center" style={{ fontSize: '0.95rem' }}>
                  {product.name || "Unnamed Product"}
                </div>
              </td>
              <td>
                <div 
                  className="text-muted small"
                  style={{ 
                    maxHeight: '60px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4'
                  }}
                  title={product.description}
                >
                  {product.description || "No description available"}
                </div>
              </td>
              <td>
                <span className="fw-bold text-success h6 mb-0">
                  ₹{Number(product.price).toLocaleString()}
                </span>
              </td>
             
         
              <td>
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/dashboard/edit/${product.id}`)}
                    title="Edit Product"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteProduct(product.id)}
                    title="Delete Product"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // User Card View Component (existing card layout)
  const UserCardView = () => (
    <div className="row g-3">
      {filteredProducts.map((product) => {
        const rating = generateRating();
        const reviews = generateReviews();
        const discount = Math.floor(Math.random() * 30) + 10; // 10-40% discount
        const originalPrice = Math.floor(Number(product.price) * (1 + discount / 100));
        
        return (
          <div
            key={product.id}
            className={
              sidebarCollapsed
                ? "col-sm-6 col-md-4 col-lg-3"
                : "col-sm-6 col-md-4 col-lg-4"
            }
          >
            <div 
              className="card h-100 border-0 shadow-sm position-relative"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              {/* Discount Badge */}
              <div 
                className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small fw-bold"
                style={{ 
                  zIndex: 10,
                  borderRadius: '0 0 8px 0',
                  fontSize: '0.75rem'
                }}
              >
                {discount}% OFF
              </div>

              {/* Image Container */}
              <div 
                className="position-relative overflow-hidden"
                style={{ height: '200px', backgroundColor: '#f8f9fa' }}
              >
                <img
                  loading="lazy"
                  src={`http://localhost:5000${product.image_path}`}
                  className="w-100 h-100"
                  alt={`Image of ${product.name}`}
                  style={{ 
                    objectFit: 'contain',
                    padding: '10px',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>

              <div className="card-body d-flex flex-column p-3">
                {/* Product Title */}
                <h6 
                  className="card-title text-dark mb-2 lh-sm"
                  style={{ 
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '2.4rem'
                  }}
                >
                  {product.name ?? "Unnamed Product"}
                </h6>

                {/* Rating Section */}
                <div className="d-flex align-items-center mb-2">
                  <div className="d-flex text-warning me-2">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i}
                        className={`bi ${i < Math.floor(rating) ? 'bi-star-fill' : 'bi-star'}`}
                        style={{ fontSize: '0.75rem' }}
                      ></i>
                    ))}
                  </div>
                  <span className="text-primary small fw-bold me-1">{rating}</span>
                  <span className="text-muted small">({reviews.toLocaleString()})</span>
                </div>

                {/* Price Section */}
                <div className="mb-3">
                  <div className="d-flex align-items-baseline">
                    <span className="h5 text-dark fw-bold mb-0 me-2">
                      ₹{Number(product.price)}
                    </span>
                    <span 
                      className="text-muted small text-decoration-line-through me-2"
                    >
                      ₹{originalPrice}
                    </span>
                  </div>
                  <div className="text-success small fw-bold">
                    You Save: ₹{originalPrice - Number(product.price)} ({discount}%)
                  </div>
                </div>

                {/* Software Features */}
                <div className="mb-3">
                  <div className="text-success small">
                    <i className="bi bi-download me-1"></i>
                    Instant Download
                  </div>
                  <div className="text-primary small">
                    <i className="bi bi-shield-check me-1"></i>
                    Lifetime License
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-warning fw-bold py-2"
                      onClick={() => handleAddToCart(product)}
                      style={{ 
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-dark py-2"
                      onClick={() =>handleBuyNow(product.id)}
                      style={{ 
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="bi bi-lightning me-2"></i>Buy Now
                    </button>
                  </div>
                </div>

                {/* Prime Badge (Optional) */}
                <div className="position-absolute top-0 end-0 p-2">
                  <span 
                    className="badge bg-primary"
                    style={{ fontSize: '0.65rem' }}
                  >
                    <i className="bi bi-check-circle-fill me-1"></i>Prime
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="container-fluid py-0">
      
      {role === "user" && (
  <section className="bg-primary text-white p-4 rounded mb-4 shadow-sm">
    <h2>
      {`${greeting}, ${username.charAt(0).toUpperCase() + username.slice(1)}!`}
    </h2>
    <p className="mb-0">
      Browse and discover great products at great prices!
    </p>
  </section>
)}


      {/* Search Bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>

      {/* Section Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-secondary">
          {role === "admin" ? "Manage Products" : "Available Products"}
        </h3>
        
        {role === "user" && (
          <Link to="/dashboard/cart">
            <span className="badge bg-info text-dark fs-6">
              <i className="bi bi-cart me-1"></i>Cart: {cartCount}
            </span>
          </Link>
        )}
      </div>

      {/* Product Display */}
      {loading ? (
        <div className="text-center py-5 w-100">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        role === "admin" ? <AdminTableView /> : <UserCardView />
      ) : (
        <div className="text-center py-5 text-muted w-100">
          <h4>No products available</h4>
          <p>Check back later for new arrivals!</p>
        </div>
      )}
      <Chatbot/>
    </div>
    
  );
}

export default Home;