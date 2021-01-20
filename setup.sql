-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS reset_codes;
-- DROP TABLE IF EXISTS friendships;
-- DROP TABLE IF EXISTS chat_messages;
-- DROP TABLE IF EXISTS private_messages;
-- DROP TABLE IF EXISTS user_wall CASCADE;
-- DROP TABLE IF EXISTS wall_comments;


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
   user_id INT REFERENCES users(id) ON DELETE SET NULL,
   message VARCHAR NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_messages (
   id SERIAL PRIMARY KEY,
   sender_id INT REFERENCES users(id) ON DELETE SET NULL,
   recipient_id INT REFERENCES users(id) ON DELETE SET NULL,
   message VARCHAR NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_wall(
   id SERIAL PRIMARY KEY,
   user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   url VARCHAR NOT NULL,
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wall_comments(
   id SERIAL PRIMARY KEY,
   post_id INT NOT NULL REFERENCES user_wall(id) ON DELETE CASCADE,
   author_id INT REFERENCES users(id) ON DELETE SET NULL,
   comment TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (user_id, message) VALUES (100, 'Hey, how is everyone doing?'), (1, 'Good! Great weather today 🙂'), (3, 'Raining here 🙁');

CREATE UNIQUE INDEX ON friendships (least(sender_id, recipient_id), greatest(sender_id, recipient_id));
