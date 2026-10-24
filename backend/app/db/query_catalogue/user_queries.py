"""User SQL Query Catalogue.

Centralized parameterized SQL queries for the User resource.
Contains CRUD operations, authentication lookups, and profile updates.
"""

# Insert a new user (Signup / Registration)
CREATE_USER = """
INSERT INTO users (id, name, email, password, gender, age, shipping_address, role, created_at, updated_at)
VALUES (:id, :name, :email, :password, :gender, :age, :shipping_address, :role, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING id, name, email, password, gender, age, shipping_address, role, created_at, updated_at;
"""

# Fetch single user by ID
GET_USER_BY_ID = """
SELECT id, name, email, password, gender, age, shipping_address, role, created_at, updated_at
FROM users
WHERE id = :id;
"""

# Fetch single user by unique Email (Authentication / Duplicate Check)
GET_USER_BY_EMAIL = """
SELECT id, name, email, password, gender, age, shipping_address, role, created_at, updated_at
FROM users
WHERE email = :email;
"""

# Fetch all users with pagination
GET_ALL_USERS = """
SELECT id, name, email, password, gender, age, shipping_address, role, created_at, updated_at
FROM users
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset;
"""

# Update user details (dynamic fields merged with COALESCE or parameterized sets)
UPDATE_USER = """
UPDATE users
SET 
    name = COALESCE(:name, name),
    password = COALESCE(:password, password),
    gender = COALESCE(:gender, gender),
    age = COALESCE(:age, age),
    shipping_address = COALESCE(:shipping_address, shipping_address),
    role = COALESCE(:role, role),
    updated_at = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING id, name, email, password, gender, age, shipping_address, role, created_at, updated_at;
"""

# Delete user by ID (Cascades to related orders)
DELETE_USER = """
DELETE FROM users
WHERE id = :id
RETURNING id;
"""
