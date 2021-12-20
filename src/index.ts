import app from "./server";
import yargs from "yargs";

const argv = yargs
    .option("port", {
        alias: "-p",
        type: "number",
    })
    .option("directory", {
        alias: "-s",
        type: "string",
        demandOption: false,
    })
    .help()
    .alias("help", "h")
    .argv;

const PORT = argv.port || 8080;
if (!argv.port) {
    console.log("Port not declared , trying to use 8080 ");
}
app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
    console.log(`Open http://localhost:${PORT}/welcome`);
});