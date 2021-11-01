import express from "express";
import path from "path";

const PORT = 8080;
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
app.use(express.static("build"));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.status(404);
    res.format({
        html: function () {
            res.render('404', { url: req.url })
        },
        json: function () {
            res.json({ error: 'Not found' })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    })
});
// app.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname + "/pages/404.html"));
// });

app.listen(PORT, () => {
    console.log(`App running on port: ${8080}`);
});