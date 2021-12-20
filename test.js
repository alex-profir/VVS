const { spawn } = require("child_process");

const command = `${/^win/.test(process.platform) ? 'npm.cmd' : 'npm'} run start:node`.split(" ");
function CommandProcess() {
    let child = null;

    function start() {
        if (!child || !child.killed) {
            child = spawn(command[0], command.slice(1), {
                // env: process.env,
                stdio: "inherit"
                // cwd: "../"
            });
        } else {
            console.log("Tryed to start while running ....");
        }
    }
    function stop() {
        if (child) {
            child.kill("SIGINT");
        } else {
            console.log("Process does not exist");
        }
    }

    return {
        child,
        start,
        stop
    }
}
const prc = CommandProcess();
prc.start();

function handler() {
    process.exit(process.exitCode);
}

process.on("SIGTERM", handler)
process.on('SIGBREAK', handler)
process.on('SIGINT', handler)
process.on('SIGKILL', handler)
process.on("exit", () => {
    console.log("Exit");
    prc.stop();
});