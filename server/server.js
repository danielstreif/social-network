const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
const cryptoRandomString = require("crypto-random-string");
const { hash, compare } = require("./bc");
const db = require("./db/db");
const fDb = require("./db/friendships");
const ses = require("./ses");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `${__dirname}/uploads`);
    },
    filename: (req, file, callback) => {
        uidSafe(24)
            .then((uid) => {
                callback(null, `${uid}${path.extname(file.originalname)}`);
            })
            .catch((err) => {
                callback(err);
            });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const cookieSessionMiddleware = cookieSession({
    secret: secrets.sessionSecret,
    maxAge: secrets.maxAge,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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

app.post("/user/wall/post", uploader.single("image"), s3.upload, (req, res) => {
    if (req.file) {
        const id = req.session.userId;
        const url = `${s3Url}${req.file.filename}`;
        const description =
            req.body.description != "undefined" ? req.body.description : null;
        db.addWallPost(id, url, description)
            .then(({ rows }) => {
                res.json({ success: rows[0] });
            })
            .catch((err) => {
                console.log("Wall post error: ", err);
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.get("/user/wall/:id", (req, res) => {
    const { id } = req.params;
    db.getWallPost(id)
        .then(({ rows }) => {
            res.json({ success: rows });
        })
        .catch((err) => {
            console.log("Get wall posts error: ", err);
            res.json({ error: true });
        });
});

app.get("/friendships", (req, res) => {
    const userId = req.session.userId;
    fDb.getFriendships(userId)
        .then(({ rows }) => {
            res.json({ users: rows, idSelf: userId });
        })
        .catch((err) => {
            console.log("Get friendships error: ", err);
            res.json({ error: true });
        });
});

app.post("/friendship-action/:action/:otherId", (req, res) => {
    const { action, otherId } = req.params;
    const userId = req.session.userId;

    if (action == "Add Friend") {
        fDb.addPendingRequest(userId, otherId)
            .then((result) => {
                res.json({ success: result });
            })
            .catch((err) => {
                console.log("Request error: ", err);
                res.json({ error: true });
            });
    } else if (action == "Accept") {
        fDb.acceptPendingRequest(userId, otherId)
            .then((result) => {
                res.json({ success: result });
            })
            .catch((err) => {
                console.log("Accept error: ", err);
                res.json({ error: true });
            });
    } else if (
        action == "Cancel" ||
        action == "Decline" ||
        action == "Unfriend"
    ) {
        fDb.deleteFriendshipStatus(userId, otherId)
            .then((result) => {
                res.json({ success: result });
            })
            .catch((err) => {
                console.log("Delete error: ", err);
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.get("/friendship-status/:otherId", (req, res) => {
    const { otherId } = req.params;
    const userId = req.session.userId;
    fDb.getFriendshipStatus(userId, otherId)
        .then((action) => {
            res.json({ success: action });
        })
        .catch((err) => {
            res.json({ error: true });
            console.log("Get friendship status error: ", err);
        });
});

app.get("/user/search", (req, res) => {
    const val = req.query.q;
    if (val !== "undefined" && val.length !== 0) {
        db.getMatchingUsers(val, req.session.userId)
            .then(({ rows }) => {
                return res.json(rows);
            })
            .catch((err) => {
                console.log("Get matching users error: ", err);
                return res.json({ error: true });
            });
    } else {
        db.getRecentUsers(req.session.userId)
            .then(({ rows }) => {
                return res.json(rows);
            })
            .catch((err) => {
                console.log("Get recent users error: ", err);
                return res.json({ error: true });
            });
    }
});

app.post("/user/profile/edit", (req, res) => {
    const userId = req.session.userId;
    const { first, last, email, password, deleteAcc } = req.body;
    if (deleteAcc) {
        db.getWallPost(userId)
            .then(async ({ rows }) => {
                for (let i in rows) {
                    const filename = rows[i].url.replace(s3Url, "");
                    await s3.delete(filename);
                }
            })
            .then(() => {
                db.deleteUser(userId).then(async ({ rows }) => {
                    const filename = rows[0].url.replace(s3Url, "");
                    await s3.delete(filename);
                    req.session = null;
                    res.json({ success: true });
                });
            })
            .catch((err) => {
                console.log("Account deletion error: ", err);
                res.json({ error: true });
            });
    } else if (password) {
        hash(password).then((hash) => {
            db.updateCredentialsPW(userId, first, last, email, hash)
                .then(() => res.json({ success: true }))
                .catch((err) => {
                    console.log("Account setting error: ", err);
                    res.json({ error: true });
                });
        });
    } else {
        db.updateCredentials(userId, first, last, email)
            .then(() => res.json({ success: true }))
            .catch((err) => {
                console.log("Account setting error: ", err);
                res.json({ error: true });
            });
    }
});

app.get("/user/profile", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => console.log("GetUserInfo error: ", err));
});

app.get("/user/profile/:id", (req, res) => {
    const { id } = req.params;
    if (id == req.session.userId) {
        return res.json({ invalid: true });
    }
    if (id == "null") {
        return res.json({ invalid: true });
    }
    db.getUserInfo(id)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return res.json({ invalid: true });
            } else {
                return res.json(rows[0]);
            }
        })
        .catch((err) => {
            console.log("Get user info error: ", err);
            res.json({ error: true });
        });
});

app.post("/user/bio/edit", (req, res) => {
    db.updateUserBio(req.session.userId, req.body.bio)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return res.json({ error: true });
            } else {
                return res.json({ success: true });
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
});

app.get("/user/image/delete", (req, res) => {
    const id = req.session.userId;
    db.getProfilePic(id)
        .then(({ rows }) => {
            const url = rows[0].url;
            if (url) {
                return url;
            } else {
                throw new Error("No image in database");
            }
        })
        .then((url) => {
            db.deleteProfilePic(id).then(() => {
                const filename = url.replace(s3Url, "");
                s3.delete(filename);
                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({ success: false });
        });
});

app.post(
    "/user/image/upload",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        if (req.file) {
            const url = `${s3Url}${req.file.filename}`;
            db.updateProfilePic(req.session.userId, url)
                .then(({ rows }) => {
                    if (rows[0].url) {
                        const filename = rows[0].url.replace(s3Url, "");
                        s3.delete(filename);
                    }
                    res.json({ url: url });
                })
                .catch((err) => {
                    console.log("Upload error: ", err);
                    res.json({ error: true });
                });
        } else {
            res.json({ error: true });
        }
    }
);

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    const secretCode = cryptoRandomString({ length: 6 });
    db.checkEmailValid(email)
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

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// let onlineUsers = {};
io.on("connection", (socket) => {
    const userId = socket.request.session.userId;

    if (!userId) {
        return socket.disconnect(true);
    }

    // onlineUsers[socket.id] = userId;

    // socket.on("disconnect", () => {
    //     delete onlineUsers[socket.id];
    // });

    if (userId) {
        db.getRecentChat()
            .then(({ rows }) => {
                for (let i in rows) {
                    rows[i].time = rows[i].created_at.toLocaleString();
                }
                const result = {
                    result: rows.sort((a, b) => {
                        return a.id - b.id;
                    }),
                };
                socket.emit("get messages", result, userId);
            })
            .catch((err) => console.log("Get recent messages error: ", err));
    }

    socket.on("post message", (message) => {
        db.addChatMessage(userId, message)
            .then(({ rows }) => {
                db.getNewMessage(rows[0].id)
                    .then(({ rows }) => {
                        const newMessage = rows[0];
                        newMessage.time = newMessage.created_at.toLocaleString();
                        io.emit("new message and user", newMessage);
                    })
                    .catch((err) =>
                        console.log("Get new message error: ", err)
                    );
            })
            .catch((err) => console.log("Post message error: ", err));
    });
});
