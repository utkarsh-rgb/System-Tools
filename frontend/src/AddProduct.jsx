import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Invalid file",
          text: "Please upload a valid image file.",
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File too large",
          text: "Image size must be less than 2MB.",
        });
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/dashboard/addproduct", formData, {
        withCredentials: true,
      });

      setName("");
      setDesc("");
      setPrice("");
      setImage(null);
      document.getElementById("productImage").value = "";

      Swal.fire({
        icon: 'success',
        title: 'Product Added',
        text: 'Your product has been added successfully!',
        timer: 2000,
        showConfirmButton: false,
      });

      
       navigate("/dashboard/home");

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.error || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-lg rounded-4 p-4 bg-light">
        <h2 className="mb-4 text-center text-primary fw-bold">Add New Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="productName" className="form-label fw-semibold">Product Name</label>
            <input
              id="productName"
              type="text"
              className="form-control form-control-lg rounded-3"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="productDesc" className="form-label fw-semibold">Description</label>
            <input
              id="productDesc"
              type="text"
              className="form-control form-control-lg rounded-3"
              placeholder="Enter product description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              maxLength={250}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="productPrice" className="form-label fw-semibold">Price (₹)</label>
            <input
              id="productPrice"
              type="number"
              className="form-control form-control-lg rounded-3"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="productImage" className="form-label fw-semibold">Upload Image</label>
            <input
              id="productImage"
              type="file"
              className="form-control form-control-lg rounded-3"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>

          {image && (
            <div className="mb-4 text-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="img-fluid rounded-3 border border-secondary"
                style={{ maxHeight: "250px", objectFit: "contain" }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
