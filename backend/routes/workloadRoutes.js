const express = require("express");

const {
    createWorkload,
    getWorkloads,
} = require("../controllers/workloadController");

const router = express.Router();

router.post("/", createWorkload);

router.get("/", getWorkloads);

module.exports = router;