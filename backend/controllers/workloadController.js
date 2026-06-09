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

const deleteWorkload = async (req, res) => {
  try {
    const workload = await Workload.findById(req.params.id);
    if (!workload) return res.status(404).json({ message: 'Workload not found' });

    // If allocated, free up the machine resources
    if (workload.status === 'Allocated' && workload.assignedMachine) {
      await Machine.findOneAndUpdate(
        { machineName: workload.assignedMachine },
        {
          $inc: {
            availableCpu: workload.cpuNeeded,
            availableRam: workload.ramNeeded
          }
        }
      );
    }

    await Workload.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workload deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    createWorkload,
    getWorkloads,
    deleteWorkload,
};