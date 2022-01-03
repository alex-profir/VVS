import express, { response } from "express";
import NotFoundMiddleware from "./middlewares/404.middleware";
import { getFilesFromFileName } from "./utils";
import cors from "cors";
const app = express();

let maintananceMode = false
app.set('view engine', 'ejs');
app.use(cors({
    origin: "*"
}))

app.get("/maintanance-state", (req, res) => {
    res.send({
        maintananceMode
    });
})
app.get("/maintanance", (req, res) => {
    maintananceMode = !maintananceMode;

    res.send(`Maintanance changed to ${maintananceMode}`);
})
app.use((req, res, next) => {
    if (maintananceMode) {
        res.status(503).send("Maintanance")
    } else {
        next();
    }
});
const buildFile = "build"; // this should be used to indicate the file locations.
app.get("/welcome", (req, res) => {
    const files = getFilesFromFileName(buildFile);
    res.render("Welcome", {
        data: files,
        relPath: "/",
    });
});
app.use(express.static(buildFile));
app.use(express.static("public"));
app.get("/static/*", (req, res, next) => {
    try {
        const fileRequest = `${buildFile}/${req.url.substring(1)}`;
        const fileNames = getFilesFromFileName(fileRequest);
        res.render("Welcome", {
            data: fileNames,
            relPath: req.url,
        });
    } catch (e) {
        next();
    }
});
// app.get("/*", (req, res) => {
//     res.redirect("/");
// })
app.use(NotFoundMiddleware);



export default app;
