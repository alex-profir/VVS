import express from "express";
import NotFoundMiddleware from "./middlewares/404.middleware";

const app = express();

let maintananceMode = false;
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
    res.render("Welcome");
})
app.use(express.static("build"));
app.use(express.static("public"));

app.use(NotFoundMiddleware);
// app.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname + "/pages/404.html"));
// });


export default app;