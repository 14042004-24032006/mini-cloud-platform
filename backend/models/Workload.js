const mongoose = require("mongoose");

const workloadSchema = new mongoose.Schema(
{
    containerName: {
        type: String,
        required: true,
    },

    cpuNeeded: {
        type: Number,
        required: true,
    },

    ramNeeded: {
        type: Number,
        required: true,
    },

    assignedMachine: {
        type: String,
        default: null,
    },

    status: {
        type: String,
        default: "Pending",
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Workload", workloadSchema);