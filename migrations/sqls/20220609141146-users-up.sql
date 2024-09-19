CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    username VARCHAR(40),
    password_digest VARCHAR
)