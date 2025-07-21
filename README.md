# 🛠️ System Tools – Full Stack Web Application

**System Tools** is a full-stack web application built using the MERN stack (React, Node.js, Express, MySQL) that offers cybersecurity software products such as antivirus tools, firewalls, and more. The app supports secure authentication, role-based access, real-time order tracking, and admin functionalities.

---

## 📽️ Video Walkthroughs

### 🔹 User Side Demo

> This video demonstrates the user journey — from landing on the homepage, logging in, browsing products, adding them to the cart, and placing an order.

[▶️ Download/View User Demo](./user-demo.mp4)

### 🔹 Admin Side Demo

> This video showcases the admin panel where admins can view orders, update product details (price, image, description), change order status (e.g., Processing, Shipped), and manage user notifications.

[▶️ Download/View Admin Demo](./admin-demo.mp4)

---

## 🚀 Features

### 👤 User Features:
- User Registration & Login
- Forgot Password (via Nodemailer)
- View and search cybersecurity products
- Add to Cart and Place Orders
- Track order status in real-time via Socket.io
- Notifications about order updates
- Protected routes with redirection after login

### 🛠️ Admin Features:
- Admin login with secure credentials
- View all orders placed today
- View complete order history (with unique `order_id`)
- Change order statuses: *Processing*, *Shipped*, *Delivered*, *Cancelled*
- Add, edit, and delete products
- View and manage users

---

## 🔐 Technologies Used

| Frontend        | Backend           | Database       | Real-Time & Mail |
|----------------|-------------------|----------------|------------------|
| React.js        | Node.js, Express.js | MySQL          | Socket.io, Nodemailer |

---

## 🧠 Architecture
- **MVC Pattern** used to separate concerns (Models, Controllers, Routes)
- **JWT-based Authentication** for secure sessions
- **Role-based Authorization** for route protection
- **Responsive UI** with React
- **Real-Time Updates** using Socket.io

---

## 📦 Installation

### Clone the repository
```bash
git clone https://github.com/utkarsh-rgb/System-Tools.git
cd system_tools
