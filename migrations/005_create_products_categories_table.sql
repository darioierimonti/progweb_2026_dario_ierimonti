CREATE TABLE product_categories (
    product_id INT NOT NULL REFERENCES products(id),
    category_id INT NOT NULL REFERENCES categories(id)
)
