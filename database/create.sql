CREATE DATABASE IF NOT EXISTS usof;

USE usof;

-- how to save password
-- https://stackoverflow.com/questions/247304/what-data-type-to-use-for-hashed-password-field-and-what-length 

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(30) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  full_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255) NOT NULL,
  rating INT DEFAULT 0 NOT NULL, -- https://metanit.com/sql/sqlserver/12.1.php#:~:text=%D0%A2%D1%80%D0%B8%D0%B3%D0%B3%D0%B5%D1%80%D1%8B%20%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D1%8F%D1%8E%D1%82%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D1%82%D0%B8%D0%BF%20%D1%85%D1%80%D0%B0%D0%BD%D0%B8%D0%BC%D0%BE%D0%B9,%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%20INSERT%2C%20UPDATE%2C%20DELETE.
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
);

CREATE TABLE IF NOT EXISTS post (
  id INT AUTO_INCREMENT PRIMARY KEY, -- id INT AUTO_INCREMENT PRIMARY KEY
  author_id INT NOT NULL,
  title VARCHAR(100) NOT NULL, -- ?? size
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, -- ??DATETIME https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
  content VARCHAR(5000), -- ?? type size
  status ENUM('active', 'inactive') DEFAULT 'active',
  -- ??categories
  FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment (
  id INT AUTO_INCREMENT PRIMARY KEY, -- ??
  author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
  post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  content VARCHAR(1000) NOT NULL, -- ??type size
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  description VARCHAR(100) NOT NULL -- ?? size
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY(post_id, category_id), -- ?? 
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS like_entity ( -- Foreign Key to multiple tables https://stackoverflow.com/questions/7844460/foreign-key-to-multiple-tables
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id),
  target_post INT NULL,
    FOREIGN KEY (target_post) REFERENCES post(id),
  target_comment INT NULL,
    FOREIGN KEY (target_comment) REFERENCES comment(id),
  CONSTRAINT uc_like_authorPost UNIQUE(author_id, target_post),
  CONSTRAINT uc_like_authorComment UNIQUE(author_id, target_comment),
  CONSTRAINT CK_target_postComment CHECK (
      CASE WHEN target_post IS NULL THEN 0 ELSE 1 END +
      CASE WHEN target_comment  IS NULL THEN 0 ELSE 1 END = 1
    ),
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  type ENUM('like', 'dislike') DEFAULT 'like' NOT NULL
);

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_like_insert
AFTER INSERT
ON like_entity FOR EACH ROW
BEGIN
  DECLARE newRating, authorId INT;

  IF NEW.target_post IS NOT NULL THEN
    SET authorId = (SELECT author_id FROM post WHERE id = NEW.target_post);
  ELSE
    SET authorId = (SELECT author_id FROM comment WHERE id = NEW.target_comment);
  END IF;
  
  SET newRating = (SELECT rating FROM user WHERE id = authorId);

  CASE NEW.type
    WHEN 'like' THEN
      SET newRating = newRating + 1;
    WHEN 'dislike' THEN
      SET newRating = newRating - 1;
  END CASE;

  UPDATE user
  SET rating = newRating
  WHERE
    id = authorId;
  
END
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_like_update
AFTER UPDATE
ON like_entity FOR EACH ROW
BEGIN
  DECLARE newRating, authorId INT;

  IF NEW.target_post IS NOT NULL THEN
    SET authorId = (SELECT author_id FROM post WHERE id = NEW.target_post);
  ELSE
    SET authorId = (SELECT author_id FROM comment WHERE id = NEW.target_comment);
  END IF;

  SET newRating = (SELECT rating FROM user WHERE id = authorId);

  CASE NEW.type
    WHEN 'like' THEN
      SET newRating = newRating + 2;
    WHEN 'dislike' THEN
      SET newRating = newRating - 2;
  END CASE;

  UPDATE user
  SET rating = newRating
  WHERE
    id = authorId;
  
END
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_like_delete
AFTER DELETE
ON like_entity FOR EACH ROW
BEGIN
  DECLARE newRating, authorId INT;

  IF OLD.target_post IS NOT NULL THEN
    SET authorId = (SELECT author_id FROM post WHERE id = OLD.target_post);
  ELSE
    SET authorId = (SELECT author_id FROM comment WHERE id = OLD.target_comment);
  END IF;
  SET newRating = (SELECT rating FROM user WHERE id = authorId);

  CASE OLD.type
    WHEN 'like' THEN
      SET newRating = newRating - 1;
    WHEN 'dislike' THEN
      SET newRating = newRating + 1;
  END CASE;

  UPDATE user
  SET rating = newRating
  WHERE
    id = authorId;
  
END
//
DELIMITER ;
