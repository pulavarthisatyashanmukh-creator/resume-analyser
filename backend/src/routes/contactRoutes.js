/**
 * contactRoutes.js
 * Routing for contact form submissions.
 */

const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contactController");

router.post("/", submitContact);

module.exports = router;
