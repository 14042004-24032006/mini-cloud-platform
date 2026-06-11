const axios = require("axios");
const si = require("systeminformation");

async function sendHeartbeat() {

    try {

        const cpuLoad = await si.currentLoad();

        const memory = await si.mem();

        const osInfo = await si.osInfo();

        const time = await si.time();

        const data = {

            machineName: osInfo.hostname,

            cpuUsage: Number(
                cpuLoad.currentLoad.toFixed(2)
            ),

            ramUsage: Number(
                (
                    (memory.used / memory.total) *
                    100
                ).toFixed(2)
            ),

            uptime:
                Math.floor(time.uptime / 3600) +
                " hours"

        };

        const response = await axios.post(
            "http://54.234.231.49:5000/api/machines/heartbeat",
            data
        );

        console.log("Heartbeat Sent");
        console.log(response.data);

    } catch (error) {

        console.log(
            "Heartbeat Error:",
            error.message
        );

    }
}

sendHeartbeat();

setInterval(sendHeartbeat, 10000);