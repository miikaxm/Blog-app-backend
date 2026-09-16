-- command for blogs table creation
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

-- command for adding blogs
insert into blogs (author, url, title) values ('Miika Valkonen', 'https://aiven.io/', 'testi blogi yksi');
insert into blogs (author, url, title) values ('Miika Valkonen', 'https://aiven.io/', 'testi blogi kaksi');
insert into blogs (author, url, title) values ('Miika Valkonen', 'https://aiven.io/', 'testi blogi kolme');