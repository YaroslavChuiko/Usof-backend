CREATE DATABASE IF NOT EXISTS usof;

SET GLOBAL event_scheduler = ON;
USE usof;

-- how to save password
-- https://stackoverflow.com/questions/247304/what-data-type-to-use-for-hashed-password-field-and-what-length 

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(30) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  full_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  active BOOLEAN DEFAULT false,
  profile_picture VARCHAR(255) NOT NULL,
  rating INT DEFAULT 0 NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
);

CREATE TABLE IF NOT EXISTS password_token (
  user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  token CHAR(36) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE EVENT password_token_cleaning ON SCHEDULE EVERY 30 MINUTE ENABLE
  DO 
  DELETE FROM password_token
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL 30 MINUTE;


CREATE TABLE IF NOT EXISTS email_token (
  user_id INT UNIQUE PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  token CHAR(36) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE EVENT email_token_cleaning ON SCHEDULE EVERY 30 DAY ENABLE
  DO 
  DELETE FROM email_token
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL 30 DAY;

CREATE TABLE IF NOT EXISTS post (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL, -- ?? size 150
  -- publish_date DATETIME DEFAULT NOW() NOT NULL, -- ??DATETIME https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  content VARCHAR(5000), -- ?? type size 10000
  status ENUM('active', 'inactive') DEFAULT 'active',
  rating INT DEFAULT 0 NOT NULL
  -- ??categories
);

CREATE TABLE IF NOT EXISTS answer (
  id INT AUTO_INCREMENT PRIMARY KEY, -- ??
  author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
  post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  content VARCHAR(1000) NOT NULL, -- ??type size 5000
  status ENUM('active', 'inactive') DEFAULT 'active',
  rating INT DEFAULT 0 NOT NULL,
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS comment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
  answer_id INT NOT NULL,
    FOREIGN KEY (answer_id) REFERENCES answer(id) ON DELETE CASCADE,
  content VARCHAR(500) NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  description VARCHAR(500) DEFAULT '' NOT NULL -- ?? size
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (post_id, category_id), -- ?? 
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS like_entity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
  target_post INT NULL,
    FOREIGN KEY (target_post) REFERENCES post(id) ON DELETE CASCADE,
  target_answer INT NULL,
    FOREIGN KEY (target_answer) REFERENCES answer(id) ON DELETE CASCADE,
  CONSTRAINT uc_like_authorPost UNIQUE(author_id, target_post),
  CONSTRAINT uc_like_authorAnswer UNIQUE(author_id, target_answer),
  CONSTRAINT CK_target_postAnswer CHECK (
      CASE WHEN target_post IS NULL THEN 0 ELSE 1 END +
      CASE WHEN target_answer  IS NULL THEN 0 ELSE 1 END = 1
    ),
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  type ENUM('like', 'dislike') DEFAULT 'like' NOT NULL
);

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_like_insert
AFTER INSERT
ON like_entity FOR EACH ROW
BEGIN
  DECLARE userRating, postRating, answerRating, ratingChange, authorId INT;

  CASE NEW.type
    WHEN 'like' THEN
      SET ratingChange = 1;
    WHEN 'dislike' THEN
      SET ratingChange = -1;
  END CASE;

  IF NEW.target_post IS NOT NULL THEN
    SET authorId = (SELECT author_id FROM post WHERE id = NEW.target_post);
    SET postRating = (SELECT rating FROM post WHERE id = NEW.target_post); 
    UPDATE post
    SET rating = postRating + ratingChange
    WHERE
      id = NEW.target_post;
  ELSE
    SET authorId = (SELECT author_id FROM answer WHERE id = NEW.target_answer);
    SET answerRating = (SELECT rating FROM answer WHERE id = NEW.target_answer);
    UPDATE answer
    SET rating = answerRating + ratingChange
    WHERE
      id = NEW.target_answer;
  END IF;
  
  SET userRating = (SELECT rating FROM user WHERE id = authorId);

  UPDATE user
  SET rating = userRating + ratingChange
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
  DECLARE userRating, postRating, answerRating, ratingChange, authorId INT;
  IF OLD.type != NEW.type THEN
    CASE NEW.type
      WHEN 'like' THEN
        SET ratingChange = 2;
      WHEN 'dislike' THEN
        SET ratingChange = -2;
    END CASE;

    IF NEW.target_post IS NOT NULL THEN
      SET authorId = (SELECT author_id FROM post WHERE id = NEW.target_post);
      SET postRating = (SELECT rating FROM post WHERE id = NEW.target_post); 
      UPDATE post
      SET rating = postRating + ratingChange
      WHERE
        id = NEW.target_post;
    ELSE
      SET authorId = (SELECT author_id FROM answer WHERE id = NEW.target_answer);
      SET answerRating = (SELECT rating FROM answer WHERE id = NEW.target_answer);
      UPDATE answer
      SET rating = answerRating + ratingChange
      WHERE
        id = NEW.target_answer;
    END IF;
    
    SET userRating = (SELECT rating FROM user WHERE id = authorId);
    
    UPDATE user
    SET rating = userRating + ratingChange
    WHERE
      id = authorId;
  END IF;
END
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_like_delete
AFTER DELETE
ON like_entity FOR EACH ROW
BEGIN
  DECLARE userRating, postRating, answerRating, ratingChange, authorId INT;
  
  CASE OLD.type
    WHEN 'like' THEN
      SET ratingChange = -1;
    WHEN 'dislike' THEN
      SET ratingChange = 1;
  END CASE;

  IF OLD.target_post IS NOT NULL THEN
    SET authorId = (SELECT author_id FROM post WHERE id = OLD.target_post);
    SET postRating = (SELECT rating FROM post WHERE id = OLD.target_post); 
    UPDATE post
    SET rating = postRating + ratingChange
    WHERE
      id = OLD.target_post;
  ELSE
    SET authorId = (SELECT author_id FROM answer WHERE id = OLD.target_answer);
    SET answerRating = (SELECT rating FROM answer WHERE id = OLD.target_answer);
    UPDATE answer
    SET rating = answerRating + ratingChange
    WHERE
      id = OLD.target_answer;
  END IF;
  
  SET userRating = (SELECT rating FROM user WHERE id = authorId);
  
  UPDATE user
  SET rating = userRating + ratingChange
  WHERE
    id = authorId;

END
//
DELIMITER ;
