const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const path = require("path");
const secrets = require("../secrets");
const { hash, compare } = require("./bc");
const db = require("./db");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: secrets.sessionSecret,
        maxAge: secrets.maxAge,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(
    express.urlencoded({
        extended: true,
    }),
    express.json()
);

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hash) => {
            return db.addUser(first, last, email, hash);
        })
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Registration error: ", err);
            res.json({ error: true });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    let userId;
    db.getCredentials(email)
        .then(({ rows }) => {
            userId = rows[0].id;
            return compare(password, rows[0].password);
        })
        .then((result) => {
            if (result) {
                req.session.userId = userId;
                res.json({ success: true });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("Login error: ", err);
            res.json({ error: true });
        });
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
