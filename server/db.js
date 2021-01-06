const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/network"
);

module.exports.addUser = (firstName, lastName, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id`,
        [firstName, lastName, email, password]
    );
};

module.exports.getCredentials = (email) => {
    return db.query(`SELECT password, id FROM users WHERE email = ($1)`, [
        email,
    ]);
};

module.exports.addResetCode = (email, resetCode) => {
    return db.query(
        `INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)`,
        [email, resetCode]
    );
};

module.exports.verifyResetCode = (resetCode, email) => {
    return db.query(
        `SELECT * FROM reset_codes
  WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
  AND code = $1 AND email = $2`,
        [resetCode, email]
    );
};

module.exports.resetPassword = (email, password) => {
    return db.query(
        `UPDATE users
        SET password = $1
        WHERE email = $2`,
        [password, email]
    );
};

module.exports.updateProfilePic = (id, url) => {
    return db.query(
        `UPDATE users
        SET url = $1
        WHERE id = $2`,
        [url, id]
    );
};

module.exports.deleteProfilePic = (id) => {
    return db.query(
        `UPDATE users
        SET url = NULL
        WHERE id = $1
        RETURNING url`,
        [id]
    );
};

module.exports.getUserInfo = (id) => {
    return db.query(
        `SELECT email, first, last, url FROM users
        WHERE id = $1`,
        [id]
    );
};
