-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS reset_codes;
-- DROP TABLE IF EXISTS friendships;
-- DROP TABLE IF EXISTS chat_messages;

CREATE TABLE users(
   id SERIAL PRIMARY KEY,
   first VARCHAR(255) NOT NULL,
   last VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   url VARCHAR(255),
   bio VARCHAR,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
   id SERIAL PRIMARY KEY,
   email VARCHAR(255) NOT NULL,
   code VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
   id SERIAL PRIMARY KEY,
   sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   recipient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   accepted BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
   id SERIAL PRIMARY KEY,
   user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   message VARCHAR NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (user_id, message) VALUES (100, 'Test'), (1, 'Test Test'), (3, 'More Tests');

CREATE UNIQUE INDEX ON friendships (least(sender_id, recipient_id), greatest(sender_id, recipient_id));
