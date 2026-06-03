const Machine = require("../models/Machine");
const Workload = require("../models/Workload");

const getDashboardStats = async (req, res) => {
    try {

        const totalMachines = await Machine.countDocuments();

        const totalWorkloads = await Workload.countDocuments();

        const allocatedWorkloads =
            await Workload.countDocuments({
                status: "Allocated"
            });

        const pendingWorkloads =
            await Workload.countDocuments({
                status: "Pending"
            });

        const machines = await Machine.find();

        let totalCpu = 0;
        let totalRam = 0;

        machines.forEach(machine => {

            const availableCpu =
                machine.totalCpu -
                (machine.totalCpu * machine.cpuUsage / 100);

            const availableRam =
                machine.totalRam -
                (machine.totalRam * machine.ramUsage / 100);

            totalCpu += availableCpu;
            totalRam += availableRam;
        });

        res.json({
            totalMachines,
            totalWorkloads,
            allocatedWorkloads,
            pendingWorkloads,
            availableCpu: Number(totalCpu.toFixed(2)),
            availableRam: Number(totalRam.toFixed(2))
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getDashboardStats
};