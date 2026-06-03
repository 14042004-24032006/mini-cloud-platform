const Machine = require("../models/Machine");

const createMachine = async (req, res) => {
    try {
        const machine = await Machine.create(req.body);
        res.status(201).json(machine);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getMachines = async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const heartbeat = async (req, res) => {
    try {

        const {
            machineName,
            cpuUsage,
            ramUsage,
            uptime
        } = req.body;

        let machine = await Machine.findOne({
            machineName
        });

        if (machine) {

            machine.cpuUsage = cpuUsage;
            machine.ramUsage = ramUsage;
            machine.uptime = uptime;

            machine.status = "Online";
            machine.lastHeartbeat = new Date();

            await machine.save();

        } else {

            machine = await Machine.create({
                machineName,
                totalCpu: 8,
                totalRam: 16,
                cpuUsage,
                ramUsage,
                uptime
            });

        }

        res.status(200).json({
            success: true,
            message: "Heartbeat received",
            machine
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createMachine,
    getMachines,
    heartbeat
};