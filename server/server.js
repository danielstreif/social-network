const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const path = require("path");
const { hash, compare } = require("./bc");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

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

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    const secretCode = cryptoRandomString({ length: 6 });
    db.getCredentials(email)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return res.json({ error: true });
            }
            return db.addResetCode(email, secretCode).then(() => {
                return ses
                    .sendEmail(email, secretCode, "Reset Password")
                    .then(() => {
                        res.json({ success: true });
                    });
            });
        })
        .catch((err) => {
            console.log("Reset error: ", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { code, email, password } = req.body;
    db.verifyResetCode(code, email)
        .then(({ rows }) => {
            console.log(rows);
            if (rows.length === 0) {
                return res.json({ error: true });
            }
            hash(password)
                .then((hash) => {
                    db.resetPassword(email, hash);
                })
                .then(() => {
                    res.json({ success: true });
                });
        })
        .catch((err) => {
            console.log("Verification error: ", err);
            res.json({ error: true });
        });
});

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

app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ logout: true });
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
