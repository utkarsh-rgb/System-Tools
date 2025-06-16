import React, { useState, useEffect } from "react";
import { Shield, CheckCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import cyber_img from "./assets/cyber.jpg";
import "./Landing.css";
import Swal from "sweetalert2";


export default function Landing() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const userData = localStorage.getItem("userData");
    setIsLoggedIn(userData ? true : false);

    fetch("http://localhost:5000/dashboard/show_product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExplore = () => {
    navigate(isLoggedIn ? "/dashboard/home" : "/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: `Thank you, ${formData.name}. Your message has been submitted.`,
          confirmButtonText: "OK",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send message. Try again later.",
      });
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar-custom navbar navbar-expand-md navbar-dark bg-dark sticky-top ">
        <div className="container-fluid">
          {/* Brand */}
          <div
            className="navbar-brand d-flex align-items-center"
            onClick={() => scrollToSection("top")}
            role="button"
          >
            <Shield size={24} className="me-2" />
           {/* <img src={logo} alt="System Tools Logo" height={30} className="me-2" /> */}
            <span>SecureTools</span> 

          
          </div>

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span
                  onClick={() => scrollToSection("top")}
                  className="nav-link"
                  role="button"
                >
                  Home
                </span>
              </li>

              <li className="nav-item">
                {isLoggedIn && (
                  <span
                    onClick={() => {
                      const userData = JSON.parse(
                        localStorage.getItem("userData")
                      );
                      const role = userData?.role;
                      if (role === "admin") {
                        navigate("/dashboard/admin_dashboard");
                      } else {
                        navigate("/dashboard/home");
                      }
                    }}
                    className="nav-link"
                    role="button"
                  >
                    Dashboard
                  </span>
                )}
              </li>
              <li className="nav-item">
                <span
                  onClick={() => scrollToSection("products")}
                  className="nav-link"
                  role="button"
                >
                  Products & Services
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={() => scrollToSection("contact")}
                  className="nav-link"
                  role="button"
                >
                  Contact
                </span>
              </li>

              <li className="nav-item">
                {isLoggedIn ? (
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="top" className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 text-center" data-aos="fade-right">
              <img
                src={cyber_img}
                className="product-image-cyber"
                alt="Cyber Security"
              />
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
              <h1 className="display-4 fw-bold mb-4">
                Stay Safe in the Digital World
              </h1>
              <p className="lead mb-4">
                Explore powerful tools that protect your identity, secure your
                devices, and give you peace of mind online.
              </p>
              <ul className="list-unstyled mb-4">
                <li>
                  <CheckCircle className="me-2 text-light" /> Antivirus, VPN,
                  Firewall & more
                </li>
                <li>
                  <CheckCircle className="me-2 text-light" /> Trusted by
                  thousands of users
                </li>
                <li>
                  <CheckCircle className="me-2 text-light" /> Start protecting
                  in minutes
                </li>
              </ul>
              <button className="btn btn-light btn-lg">Start Free Trial</button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container my-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Our Essential Tools</h2>
          <p className="text-muted">
            Choose what best fits your protection needs
          </p>
          <input
            type="text"
            className="form-control w-100 w-md-50 mx-auto mt-3"
            placeholder="Search tools (e.g., Antivirus, VPN...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                className="col-12 mb-5"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className={`d-flex align-items-center shadow-sm p-3 rounded bg-white gap-4 flex-column flex-md-row ${
                    index % 2 === 0 ? "" : "flex-md-row-reverse"
                  }`}
                >
                  <img
                    src={`http://localhost:5000${product.image_path}`}
                    alt={product.name}
                    className="product-image"
                  />
                  <div style={{ maxWidth: "600px" }}>
                    <h5 className="fw-bold">{product.name}</h5>
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No tools found.</div>
          )}
        </div>

        <div
          className="text-center mt-4"
          data-aos="fade-left"
          data-aos-delay={200}
        >
          <button className="btn btn-primary btn-lg" onClick={handleExplore}>
            Explore Our Products
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ background: "#eee", padding: "2rem" }}>
        <div className="text-center mb-4">
          <h2>Contact Us</h2>
          <p>Email: example@example.com</p>
          <p>Phone: +91-12345-67890</p>
        </div>
        <form className="contact-form" onSubmit={handleContactSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="contact-input"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="contact-input"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="contact-textarea"
            required
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
          <button type="submit" className="contact-submit-button">
            Get in Touch
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container d-flex justify-content-between flex-wrap">
          <div>
            <Shield size={20} className="me-2 text-light" />
            <strong>SecureTools</strong> © 2025
          </div>
          <div>
            <a href="#" className="text-decoration-none text-light me-3">
              Privacy
            </a>
            <a href="#" className="text-decoration-none text-light me-3">
              Terms
            </a>
            <a href="#" className="text-decoration-none text-light">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
