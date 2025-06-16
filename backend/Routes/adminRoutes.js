const express = require("express");
const router= express.Router()



const {adminDashboard,adminDashboardHistory} = require("../Controllers/adminController");

router.get("/dashboard/admin_dashboard",adminDashboard);
router.get('/dashboard/admin_dashboard/history',adminDashboardHistory);

module.exports=router