import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function OrderDetailsPage() {
  const { search } = useParams(); 
  const [orderData, setOrderData] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [notification, setNotification] = useState('');
  const [updateResponse, setUpdateResponse] = useState('');
  

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        
        const res = await axios.get(`http://localhost:5000/dashboard/order-items/${search}`);
        setOrderData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching order.");
      }
    };

    fetchOrder();
  }, [search]);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);

    if (selectedStatus) {
      let message = '';
      switch (selectedStatus.toLowerCase()) {
        case 'delivered':
          message = `Your order #${search} has been successfully delivered.`;
          break;
        case 'cancelled':
          message = `Your order #${search} has been cancelled.`;
          break;
        case 'shipped':
          message = `Your order #${search} has been shipped.`;
          break;
        case 'processing':
          message = `Your order #${search} is being processed.`;
          break;
        default:
          message = `Your order #${search} status updated to ${selectedStatus}.`;
      }
      setNotification(message);
    } else {
      setNotification('');
    }
    setUpdateResponse('');
  };

  const handleUpdateClick = async () => {
    if (!status) {
      setUpdateResponse('Please select a status before updating.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/dashboard/update-order-status`, {
        orderId: search,
        username: orderData[0]?.username,
        status,
        message: notification,
      });

      setUpdateResponse(res.data.message || 'Status updated and notification sent successfully.');
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateResponse(error.response?.data?.message || 'Failed to update status.');
    }
  };

  const getStatusBadge = (orderStatus) => {
    const statusMap = {
      'processing': 'bg-warning text-dark',
      'shipped': 'bg-info text-white',
      'delivered': 'bg-success text-white',
      'cancelled': 'bg-danger text-white'
    };
    return statusMap[orderStatus?.toLowerCase()] || 'bg-secondary text-white';
  };
  return (
    <div className="min-vh-100">
      <div className="container py-0">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h2 className="display-6 fw-bold text-primary mb-2">
                      <i className="fas fa-box me-3"></i>Order Details
                    </h2>
                    <p className="text-muted mb-0">Order ID: <span className="fw-bold text-dark">#{search}</span></p>
                  </div>
                  <div className="text-end">
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <i className="fas fa-exclamation-triangle me-2"></i>{error}
              </div>
            </div>
          </div>
        )}

        {orderData.length > 0 && (
          <>
            {/* Customer Information */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <div className="card-header bg-transparent border-0 p-4">
                    <h4 className="card-title mb-0 text-primary">
                      <i className="fas fa-user-circle me-3"></i>Customer Information
                    </h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                            <i className="fas fa-user text-primary"></i>
                          </div>
                          <div>
                            <p className="text-muted mb-1 small">Customer Name</p>
                            <h6 className="mb-0">{orderData[0].user_name}</h6>
                            <small className="text-muted">@{orderData[0].username}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                            <i className="fas fa-envelope text-success"></i>
                          </div>
                          <div>
                            <p className="text-muted mb-1 small">Email Address</p>
                            <h6 className="mb-0">{orderData[0].user_email}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                            <i className="fas fa-calendar text-info"></i>
                          </div>
                          <div>
                            <p className="text-muted mb-1 small">Order Date</p>
                            <h6 className="mb-0">{new Date(orderData[0].order_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                            <i className="fas fa-rupee-sign text-warning"></i>
                          </div>
                          <div>
                            <p className="text-muted mb-1 small">Total Amount</p>
                            <h5 className="mb-0 text-success fw-bold">₹{orderData[0].total_order_price}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Update */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <div className="card-header bg-transparent border-0 p-4">
                    <h4 className="card-title mb-0 text-primary">
                      <i className="fas fa-edit me-3"></i>Update Order Status
                    </h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
  <div className="col-12 col-md-4">
    <label htmlFor="order-status" className="form-label fw-semibold">
      <i className="fas fa-tags me-2"></i>Select New Status
    </label>
    <select
      id="order-status"
      value={status}
      onChange={handleStatusChange}
      className="form-select form-select-sm shadow-sm"
      style={{ borderRadius: '10px', border: '1px solid #e9ecef' }}
    >
      <option value="">-- Select Status --</option>
      <option value="Processing">🔄 Processing</option>
      <option value="Shipped">🚚 Shipped</option>
      <option value="Delivered">✅ Delivered</option>
      <option value="Cancelled">❌ Cancelled</option>
    </select>
  </div>

  <div className="col-12 col-md-4 d-flex align-items-end">
    <button
      onClick={handleUpdateClick}
      className="btn btn-sm px-3 shadow-sm w-100"
      style={{ 
        borderRadius: '10px',
        background: 'linear-gradient(45deg, #28a745, #20c997)',
        border: 'none',
        color: 'white'
      }}
    >
      <i className="fas fa-paper-plane me-1"></i>Update & Notify
    </button>
  </div>
</div>


                    {notification && (
                      <div className="mt-4">
                        <div className="alert alert-success border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-bell me-3 fs-5"></i>
                            <div>
                              <h6 className="alert-heading mb-1">Notification Preview</h6>
                              <p className="mb-0">{notification}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {updateResponse && (
                      <div className="mt-3">
                        <div className={`alert border-0 shadow-sm ${updateResponse.includes('success') ? 'alert-success' : 'alert-warning'}`} 
                             style={{ borderRadius: '15px' }}>
                          <i className={`fas ${updateResponse.includes('success') ? 'fa-check-circle' : 'fa-info-circle'} me-2`}></i>
                          {updateResponse}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="row">
              <div className="col-12">
                <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <div className="card-header bg-transparent border-0 p-4">
                    <h4 className="card-title mb-0 text-primary">
                      <i className="fas fa-shopping-cart me-3"></i>Order Items
                    </h4>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                          <tr>
                            <th className="text-black fw-bold py-3 px-4 border-0">
                              <i className="fas fa-barcode me-2"></i>Product ID
                            </th>
                            <th className="text-black fw-bold py-3 px-4 border-0">
                              <i className="fas fa-box me-2"></i>Product Name
                            </th>
                            <th className="text-black fw-bold py-3 px-4 border-0 text-center">
                              <i className="fas fa-rupee-sign me-2"></i>Price/Unit
                            </th>
                            <th className="text-black fw-bold py-3 px-4 border-0 text-center">
                              <i className="fas fa-sort-numeric-up me-2"></i>Quantity
                            </th>
                            <th className="text-black fw-bold py-3 px-4 border-0 text-center">
                              <i className="fas fa-calculator me-2"></i>Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.map((item, index) => (
                            <tr key={item.order_item_id} className="border-0" style={{ 
                              background: index % 2 === 0 ? '#f8f9fa' : 'white',
                              transition: 'all 0.3s ease'
                            }}>
                              <td className="py-3 px-4 fw-bold text-primary">#{item.product_id}</td>
                              <td className="py-3 px-4">
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className="fas fa-cube text-primary"></i>
                                  </div>
                                  <span className="fw-semibold">{item.product_name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="badge bg-light text-dark fs-6 px-3 py-2" style={{ borderRadius: '10px' }}>
                                  ₹{item.price_per_unit}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="badge bg-info fs-6 px-3 py-2" style={{ borderRadius: '10px' }}>
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="fw-bold text-success fs-5">₹{item.total_price_per_item}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: 'linear-gradient(45deg, #28a745, #20c997)' }}>
                            <td colSpan="4" className="text-white fw-bold py-3 px-4 border-0 text-end fs-5">
                              <i className="fas fa-receipt me-2"></i>Grand Total:
                            </td>
                            <td className="text-white fw-bold py-3 px-4 border-0 text-center fs-4">
                              ₹{orderData[0].total_order_price}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .table tbody tr:hover {
          background: linear-gradient(45deg, #667eea15, #764ba215) !important;
          transform: scale(1.01);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default OrderDetailsPage;