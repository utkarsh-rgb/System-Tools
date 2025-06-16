import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import AuthGuard from "./Check_Auth";
import AddProduct from "./AddProduct";
import Home from "./Home";
import EditProduct from "./EditProduct";
import Cart from "./Cart";
import Landing from "./Landing";
import UnderDevelopment from "./UnderDevelopment";
import Admin_Dashboard from "./Admin_Dashboard";
import UserOrders from "./UserOrders";
import History from "./History";
import Unauthorized from "./Unauthorized";
import OrderItems from "./OrderItems";
import OrderDetailsPage from "./OrderDetailsPage";
import NotificationTestPage from "./NotificationTestPage";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ForgotPassword />} />
        

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        >
          {/* Nested Routes under /dashboard */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />

          {/* Admin Routes */}
          <Route
            path="addnewproduct"
            element={
              <AuthGuard allowedRoles={["admin"]}>
                <AddProduct />
              </AuthGuard>
            }
          />
          <Route
            path="edit/:id"
            element={
              <AuthGuard allowedRoles={["admin"]}>
                <EditProduct />
              </AuthGuard>
            }
          />
          <Route
            path="admin_dashboard"
            element={
              <AuthGuard allowedRoles={["admin"]}>
                <Admin_Dashboard />
              </AuthGuard>
            }
          />


<Route
  path="notification"
  element={
    <AuthGuard allowedRoles={["admin", "user"]}>
      <NotificationTestPage />
    </AuthGuard>
  }/>

          
          <Route
            path="admin_dashboard/history"
            element={
              <AuthGuard allowedRoles={["admin"]}>
                <History />
              </AuthGuard>
            }
          />
          <Route
            path="order-items"
            element={
              <AuthGuard allowedRoles={["admin"]}>
                <OrderItems />
              </AuthGuard>
            }
          />
          <Route
            path="order-items/:search"
            element={
              <AuthGuard allowedRoles={["admin"]}>
                <OrderDetailsPage />
              </AuthGuard>
            }
          />

          {/* User Routes */}
          <Route
            path="userorders/:username"
            element={
              <AuthGuard allowedRoles={["user"]}>
                <UserOrders />
              </AuthGuard>
            }
          />
          <Route
            path="cart"
            element={
              <AuthGuard allowedRoles={["user"]}>
                <Cart />
              </AuthGuard>
            }
          />

          {/* Other placeholder routes */}
          <Route path="products" element={<UnderDevelopment />} />
          <Route path="offers" element={<UnderDevelopment />} />
          <Route path="solutions" element={<UnderDevelopment />} />
          <Route path="services" element={<UnderDevelopment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
