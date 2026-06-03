const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
{
    machineName: {
        type: String,
        required: true,
    },

    totalCpu: {
        type: Number,
        required: true,
    },

    totalRam: {
        type: Number,
        required: true,
    },

    cpuUsage: {
        type: Number,
        default: 0,
    },

    ramUsage: {
        type: Number,
        default: 0,
    },

    uptime: {
        type: String,
        default: "0 hours",
    },
    status: {
    type: String,
    default: "Online"
},

lastHeartbeat: {
    type: Date,
    default: Date.now
},
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Machine", machineSchema);