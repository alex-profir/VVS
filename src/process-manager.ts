import express from "express";
import { ChildProcess, spawn } from "child_process";
import bodyParser from "body-parser";
import cors from "cors";


const app = express();
// const command = `${/^win/.test(process.platform) ? 'npm.cmd' : 'npm'} run start:node`.split(" ");
const command = `node dist/index.js`.split(" ");
function CommandProcess() {
    let child: ChildProcess | null = null as any;
    let runningPort: number = null as any;
    function isRunning() {
        console.log({ child });
        if (child === null) {
            return false;
        }
        return !child?.killed;
    }
    function getPort() {
        return runningPort;
    }
    function start(port: number) {
        if (!child || child.killed) {
            runningPort = port;
            child = spawn(command[0], [...command.slice(1), "-p", port as any], {
                // env: process.env,
                stdio: "inherit"
                // cwd: "../"
            });
        } else {
            console.log("Tryed to start while running ....");
        }
    }
    function stop() {
        console.log({ child });
        if (child && !child.killed) {
            child.kill("SIGINT");
            runningPort = null!;
            return true;
        } else {
            console.log("Process does not exist");
            return false;
        }
    }

    return {
        child,
        start,
        stop,
        isRunning,
        runningPort,
        getPort
    }
}
let prc = CommandProcess();
app.locals.prc = prc;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
}))
app.set('view engine', 'ejs');
app.get("/dashboard", (req, res) => {
    // const files = getFilesFromFileName(buildFile);
    // console.log({
    //     isRunning: app.locals.prc.isRunning()
    // })
    console.log(app.locals.prc);
    res.render("Dashboard", {
        port: 8080,
        isRunning: app.locals.prc.isRunning()
        // data: files,
        // relPath: "/",
    });
});
app.get("/status", (req, res) => {

    console.log(app.locals);
    const port = app.locals.prc.getPort();
    res.send({
        hostUrl: port ? `http://localhost:${port}` : null,
        port,
        isRunning: app.locals.prc.isRunning()
    })
})
app.post("/start", (req, res) => {
    // console.log(req.body);
    // console.log(req.body.port);
    if (req.body.port && +req.body.port) {
        // console.log(app.locals);
        app.locals.prc.start(req.body.port);
        res.send("ok");
    } else {
        res.status(400).send("Missing Port");
    }

})

app.post("/stop", (req, res) => {
    const stopped = app.locals.prc.stop();
    if (stopped) {
        res.send("stopped");
    } else {
        res.status(400).send("Could not stop ( Maybe not running? ) ");
    }
});

function handler() {
    process.exit(process.exitCode);
}


process.on("SIGTERM", handler)
process.on('SIGBREAK', handler)
process.on('SIGINT', handler)
process.on('SIGKILL', handler)
process.on("exit", () => {
    console.log("Exit");
    app.locals.prc.stop();
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Process manager opened on port: ${PORT}`);
    console.log(`Open http://localhost:${PORT}/dashboard`);
});