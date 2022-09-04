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
  -- author INT NOT NULL,
  author VARCHAR(30) NOT NULL,
  title VARCHAR(100) NOT NULL, -- ?? size
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, -- ??DATETIME https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
  status ENUM('active', 'inactive') DEFAULT 'active',
  content VARCHAR(5000), -- ?? type size
  -- ??categories
  -- FOREIGN KEY (author) REFERENCES user(id) ON DELETE CASCADE
  FOREIGN KEY (author) REFERENCES user(login) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment (
  id INT AUTO_INCREMENT PRIMARY KEY, -- ??
  -- author INT NOT NULL,
  author VARCHAR(30) NOT NULL,
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  content VARCHAR(1000) NOT NULL, -- ??type size
  -- FOREIGN KEY (author) REFERENCES user(id) ON DELETE CASCADE
  FOREIGN KEY (author) REFERENCES user(login) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_comments (
  post_id INT NOT NULL,
  comment_id INT NOT NULL,
  PRIMARY KEY(post_id, comment_id), -- ??
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE,
  description VARCHAR(100) NOT NULL -- ?? size
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY(post_id, category_id), -- ?? 
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS like_entity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- author INT NOT NULL,
  author VARCHAR(30) NOT NULL,
  -- FOREIGN KEY (author) REFERENCES user(id),
  FOREIGN KEY (author) REFERENCES user(login),
  publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  -- target_id INT NOT NULL, -- post/comment id -- ?? https://stackoverflow.com/questions/8112831/implementing-comments-and-likes-in-database
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


-- DELIMITER //
-- CREATE TRIGGER IF NOT EXISTS user_calc_rating
-- AFTER INSERT
-- ON post_likes FOR EACH ROW
-- BEGIN
--   DECLARE likeId, authorId, postsRating, commentsRating INT;

--   -- IF NEW THEN
--   --   SET likeId = NEW.like_id;
--   -- ELSE
--   --   SET likeId = OLD.like_id
--   -- END IF;

--   SELECT
--     author
--   INTO
--     authorId
--   FROM
--     like_entity
--   WHERE
--     id = NEW.post_id;

--   -- SET authorId = (SELECT author FROM like_entity WHERE id = likeId);
--   -- SET authorId = (SELECT author FROM like_entity WHERE id = NEW.like_id);
--   -- SET authorId = (SELECT Id FROM inserted);

--   CALL calcUserPostsRating(authorId, postsRating);
--   CALL calcUserCommentsRating(authorId, commentssRating);

--   -- UPDATE user
--   -- SET rating = postsRating + commentsRating
--   -- WHERE
--   --   id = authorId;

--   UPDATE user
--   SET rating = 10
--   WHERE
--     id = authorId;
  
-- END
-- //
-- DELIMITER ;


-- DELIMITER //
-- CREATE TRIGGER IF NOT EXISTS user_calc_rating
-- AFTER INSERT
-- ON post_likes FOR EACH ROW
-- BEGIN
--   DECLARE likes, dislikes, authorId, postsRating, commentsRating INT;

--   -- IF NEW THEN
--   --   SET likeId = NEW.like_id;
--   -- ELSE
--   --   SET likeId = OLD.like_id
--   -- END IF;

--   SELECT
--     author
--   INTO
--     authorId
--   FROM
--     post
--   WHERE
--     id = NEW.post_id;

--   SELECT
--     COUNT(*)
--   INTO
--     likes
--   FROM 
--     post_likes pl
--     INNER JOIN post p ON p.id = pl.post_id
--     INNER JOIN like_entity le ON le.id = pl.like_id
--   WHERE
--     p.author = authorId AND le.type = 'like';

--   SELECT
--     COUNT(*)
--   INTO
--     dislikes
--   FROM 
--     post_likes pl
--     INNER JOIN post p ON p.id = pl.post_id
--     INNER JOIN like_entity le ON le.id = pl.like_id
--   WHERE
--     p.author = authorId AND le.type = 'dislike';

--   -- SET postsRating = likes - dislikes;

--   UPDATE user
--   SET rating = likes - dislikes
--   WHERE
--     id = authorId;
  
-- END
-- //
-- DELIMITER ;

-- delete rating--
-- insert rating++

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_post_likes_insert
AFTER INSERT
ON post_likes FOR EACH ROW
BEGIN
  DECLARE newRating INT;
  DECLARE authorLogin VARCHAR(30);
  DECLARE likeType VARCHAR(10);

  SET likeType = (SELECT type FROM like_entity WHERE id = NEW.like_id);
  SET authorLogin = (SELECT author FROM post WHERE id = NEW.post_id);
  SET newRating = (SELECT rating FROM user WHERE login = authorLogin);

  CASE likeType
    WHEN 'like' THEN
      SET newRating = newRating + 1;
    WHEN 'dislike' THEN
      SET newRating = newRating - 1;
  END CASE;

  UPDATE user
  SET rating = newRating
  WHERE
    login = authorLogin;
  
END
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_post_likes_update
AFTER UPDATE
ON post_likes FOR EACH ROW
BEGIN
  DECLARE newRating INT;
  DECLARE authorLogin VARCHAR(30);
  DECLARE likeType VARCHAR(10);

  SET likeType = (SELECT type FROM like_entity WHERE id = NEW.like_id);
  SET authorLogin = (SELECT author FROM post WHERE id = NEW.post_id);
  SET newRating = (SELECT rating FROM user WHERE login = authorLogin);
  -- можливо додати перевірку попередніх занчень в OLD щоб уникнути  OLD = 'like' & NEW = 'like'
  -- post_likes тип в цый таблицы не змынюеться а лише в like_entity отже update не працює

  CASE likeType
    WHEN 'like' THEN
      SET newRating = newRating + 2;
    WHEN 'dislike' THEN
      SET newRating = newRating - 2;
  END CASE;

  UPDATE user
  SET rating = newRating
  WHERE
    login = authorLogin;
  
END
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_post_likes_delete
AFTER DELETE
ON post_likes FOR EACH ROW
BEGIN
  DECLARE newRating INT;
  DECLARE authorLogin VARCHAR(30);
  DECLARE likeType VARCHAR(10);

  SET likeType = (SELECT type FROM like_entity WHERE id = OLD.like_id);
  SET authorLogin = (SELECT author FROM post WHERE id = OLD.post_id);
  SET newRating = (SELECT rating FROM user WHERE login = authorLogin);

  CASE likeType
    WHEN 'like' THEN
      SET newRating = newRating - 1;
    WHEN 'dislike' THEN
      SET newRating = newRating + 1;
  END CASE;

  UPDATE user
  SET rating = newRating
  WHERE
    login = authorLogin;
  
END
//
DELIMITER ;