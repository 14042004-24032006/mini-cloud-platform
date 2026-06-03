const express = require("express");

const {
    createMachine,
    getMachines,
    heartbeat
} = require("../controllers/machineController");

const router = express.Router();

router.post("/", createMachine);

router.get("/", getMachines);

router.post("/heartbeat", heartbeat);

module.exports = router;