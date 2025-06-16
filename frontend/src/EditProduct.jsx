import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_path: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/dashboard/product/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          image_path: data.image_path,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", product.price);

  // Add image only if user selected a new one
  if (product.newImageFile) {
    formData.append("image", product.newImageFile);
  } else {
    formData.append("image_path", product.image_path); // preserve old image if no new one selected
  }

  fetch(`http://localhost:5000/dashboard/edit/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    })
    .then(() => {
      alert("Product updated successfully!");
      navigate("/dashboard/home");
    })
    .catch((err) => alert(err.message));
};


  if (loading)
    return <p className="text-center my-5">Loading product details...</p>;
  if (error)
    return <p className="text-danger text-center my-5">Error: {error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4 rounded">
        <h2 className="text-center mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="form-control form-control-lg"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="form-control form-control-lg"
              rows={3}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="form-control form-control-lg"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control form-control-lg"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProduct((prev) => ({ ...prev, newImageFile: file }));
                }
              }}
            />
            <small className="form-text text-muted">
              Choose a new image to replace the current one.
            </small>
            {product.image_path && (
              <div className="mt-3">
                <img
                  src={`http://localhost:5000${product.image_path}`}
                  alt="Current"
                  className="img-fluid rounded border"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4">
              Update Product
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-3 px-4"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductForm;
