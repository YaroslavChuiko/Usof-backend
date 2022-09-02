CREATE DATABASE IF NOT EXISTS usof;

USE usof;

-- how to save password
-- https://stackoverflow.com/questions/247304/what-data-type-to-use-for-hashed-password-field-and-what-length 

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loign VARCHAR(30) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  full_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255) NOT NULL,
  rating INT NOT NULL, -- https://metanit.com/sql/sqlserver/12.1.php#:~:text=%D0%A2%D1%80%D0%B8%D0%B3%D0%B3%D0%B5%D1%80%D1%8B%20%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D1%8F%D1%8E%D1%82%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D1%82%D0%B8%D0%BF%20%D1%85%D1%80%D0%B0%D0%BD%D0%B8%D0%BC%D0%BE%D0%B9,%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%20INSERT%2C%20UPDATE%2C%20DELETE.
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
);

CREATE TABLE IF NOT EXISTS post (
  id INT AUTO_INCREMENT PRIMARY KEY, -- id INT AUTO_INCREMENT PRIMARY KEY
  author INT NOT NULL,
  title VARCHAR(100) NOT NULL, -- ?? size
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, -- https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
  status ENUM('active', 'inactive') DEFAULT 'active',
  content VARCHAR(5000), -- ?? type size
  -- ??categories
  FOREIGN KEY (author) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment (
  id INT AUTO_INCREMENT PRIMARY KEY, -- ??
  author INT NOT NULL,
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  content VARCHAR(1000) NOT NULL, -- ??type size
  FOREIGN KEY (author) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_comments (
  post_id INT NOT NULL,
  comment_id INT NOT NULL,
  PRIMARY KEY(post_id, comment_id), -- ??
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category (
  -- id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) PRIMARY KEY,
  description VARCHAR(100) NOT NULL -- ?? size
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INT NOT NULL,
  category VARCHAR(30) NOT NULL,
  PRIMARY KEY(post_id, category), -- ?? 
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (category) REFERENCES category(title) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS like_entity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author INT NOT NULL,
  FOREIGN KEY (author) REFERENCES user(id),
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  target_id INT NOT NULL, -- post/comment id -- ?? https://stackoverflow.com/questions/8112831/implementing-comments-and-likes-in-database
  type ENUM('like', 'dislike') DEFAULT 'like' NOT NULL
);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id INT NOT NULL,
  like_id INT NOT NULL,
  PRIMARY KEY(post_id, like_id), -- ?? 
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (like_id) REFERENCES like_entity(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id INT NOT NULL,
  like_id INT NOT NULL,
  PRIMARY KEY(comment_id, like_id), -- ?? 
  FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE,
  FOREIGN KEY (like_id) REFERENCES like_entity(id) ON DELETE CASCADE
);