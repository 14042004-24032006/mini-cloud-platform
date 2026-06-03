const Machine = require("../models/Machine");

const checkOfflineMachines = async () => {

    const machines = await Machine.find();

    const now = new Date();

    for (const machine of machines) {

        const diffSeconds =
            (now - machine.lastHeartbeat) / 1000;

        if (diffSeconds > 30) {

            machine.status = "Offline";

            await machine.save();
        }
    }
};

module.exports = checkOfflineMachines;