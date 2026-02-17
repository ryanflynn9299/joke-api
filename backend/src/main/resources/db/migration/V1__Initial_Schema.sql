CREATE TABLE author(
    author_id SERIAL NOT NULL PRIMARY KEY,
    author_first_name VARCHAR(255) NOT NULL,
    author_last_name VARCHAR(255),
    last_posted_date DATE
);

CREATE TABLE jokes(
    joke_id SERIAL NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    joke_type VARCHAR(50),
    author_id INT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_jotd_datetime DATE DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_jokes_author 
        FOREIGN KEY (author_id) 
        REFERENCES author (author_id)
        ON DELETE RESTRICT
);