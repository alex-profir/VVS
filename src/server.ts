import express from "express";
import NotFoundMiddleware from "./middlewares/404.middleware";
import fs from "fs";
const app = express();

let maintananceMode = false
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    if (maintananceMode) {
        res.send("Maintanance")
    } else {
        next();
    }
});
app.get("/maintanance", (req, res) => {
    maintananceMode = !maintananceMode;
    res.send(`Maintanance changed to ${maintananceMode}`);
})
app.get("/welcome", (req, res) => {
    const files = fs.readdirSync("build", { encoding: "utf8" })
    console.log({ files });
    res.render("Welcome", {
        data: files,
        relPath: "/build/",
    });
})
app.use("/build", express.static("build"));
app.use(express.static("public"));
app.get("*", (req, res, next) => {
    try {

        const files = fs.readdirSync(req.url.substr(1), { encoding: "utf8" })
        res.render("Welcome", {
            data: files,
            relPath: req.url,
        });
    } catch (e) {
        next();
    }
})
app.use(NotFoundMiddleware);



export default app;