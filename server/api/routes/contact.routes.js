// server/api/routes/contact.routes.js
const express = require("express");
const router = express.Router();
const { handleContactForm } = require("../controllers/contact.controller");

router.post("/", handleContactForm);

module.exports = router;
