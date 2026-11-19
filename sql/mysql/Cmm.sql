SET NAMES utf8mb4; -- 文字化け防止（UTF-8 として読み込む）
-- レシピ管理システムの MySQL データベーススキーマを作成
-- データベースを作成
CREATE DATABASE IF NOT EXISTS recipe_management;
USE recipe_management;

-- users テーブル
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    country VARCHAR(50),
    role ENUM('ADMIN', 'USER'),
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- ingredients テーブル
-- ingredients テーブル
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(20),
    INDEX idx_ingredient_name (Name)
);

-- recipes テーブル（調理時間 time 列を追加）
CREATE TABLE recipes (
    recipe_id INT AUTO_INCREMENT  PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    instructions TEXT,
    imageurl VARCHAR(500),
    cuisine_type VARCHAR(50),
    time INT ,
    INDEX idx_cuisine_type (cuisine_type),
    INDEX idx_recipe_name (name),
    INDEX idx_cooking_time (time)
);

-- recipe_ingredients テーブル（多対多の中間テーブル）
CREATE TABLE recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(255),
    optional BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    INDEX idx_recipe_ingredients_recipe (recipe_id),
    INDEX idx_recipe_ingredients_ingredient (ingredient_id)
);

-- user_ingredients テーブル（多対多の中間テーブル）
CREATE TABLE user_ingredients (
    user_id INT,
    ingredient_id INT,
    quantity_available DECIMAL(10,2),
    PRIMARY KEY (user_id, ingredient_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    INDEX idx_user_ingredients_user (user_id),
    INDEX idx_user_ingredients_ingredient (ingredient_id)
);

-- ingredient_substitutes テーブル（代替食材・多対多）
CREATE TABLE ingredient_substitutes (
    original_ingredient_id INT,
    substitute_ingredient_id INT,
    similarity_score TINYINT,
    comment INT, -- recipe_id
    PRIMARY KEY (original_ingredient_id, substitute_ingredient_id),
    FOREIGN KEY (original_ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    FOREIGN KEY (substitute_ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    INDEX idx_original_ingredient (original_ingredient_id),
    INDEX idx_substitute_ingredient (substitute_ingredient_id)
);
