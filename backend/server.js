const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const { initSocket } = require("./utlis/socket");
//Forgot Password
const forgotPasswordRoutes = require("./utlis/forgotPassword");

const authRoute = require('./Routes/authRoutes');
const contactRoute = require('./Routes/contactRoutes');
const productRoute = require('./Routes/productRoutes');
const cartRoute = require('./Routes/cartRoutes');
const orderRoute = require('./Routes/orderRoutes');
const adminRoute = require('./Routes/adminRoutes');
const verifyTokenRoute = require('./utlis/verify-token')
const resetPasswordRoute = require('./utlis/reset-password');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/', authRoute);
app.use('/', contactRoute);
app.use('/', productRoute);
app.use('/', cartRoute);
app.use('/', orderRoute);
app.use('/', adminRoute);
app.use('/',forgotPasswordRoutes );
app.use(verifyTokenRoute);
app.use(resetPasswordRoute);

const server = http.createServer(app);

// Initialize socket
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
