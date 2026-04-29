CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    image VARCHAR(255),
    price NUMERIC(10,2) NOT NULL,
    sale_price NUMERIC(10,2),
    stock INT NOT NULL DEFAULT 0,
    featured SMALLINT DEFAULT 1,
    active SMALLINT DEFAULT 1
)
