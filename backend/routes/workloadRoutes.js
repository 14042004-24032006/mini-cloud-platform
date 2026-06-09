const express = require("express");

const {
    createWorkload,
    getWorkloads,
    deleteWorkload,
} = require("../controllers/workloadController");

const router = express.Router();

router.post("/", createWorkload);

router.get("/", getWorkloads);

router.delete('/:id',deleteWorkload);

module.exports = router;