const Workload = require("../models/Workload");
const Machine = require("../models/Machine");

const createWorkload = async (req, res) => {
    try {

        const { containerName, cpuNeeded, ramNeeded } = req.body;

        const machines = await Machine.find();

        let selectedMachine = null;

        for (const machine of machines) {

            const availableRam =
                machine.totalRam -
                (machine.totalRam * machine.ramUsage / 100);

            const availableCpu =
                machine.totalCpu -
                (machine.totalCpu * machine.cpuUsage / 100);

            if (
                availableRam >= ramNeeded &&
                availableCpu >= cpuNeeded
            ) {
                selectedMachine = machine;
                break;
            }
        }

        const workload = await Workload.create({
            containerName,
            cpuNeeded,
            ramNeeded,
            assignedMachine: selectedMachine
                ? selectedMachine.machineName
                : null,
            status: selectedMachine
                ? "Allocated"
                : "Pending",
        });

        res.status(201).json(workload);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getWorkloads = async (req, res) => {

    try {

        const workloads = await Workload.find();

        res.json(workloads);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

module.exports = {
    createWorkload,
    getWorkloads,
};