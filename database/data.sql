USE usof;

INSERT INTO user (login, password, full_name, email, profile_picture, role)
VALUES
  ('ychuiko', '1111', 'Yaroslav Chuiko', 'jarik.tchuicko@gmail.com', 'test.png', 'admin'),
  ('Bret', '1111', 'Leanne Graham', 'Sincere@april.biz', 'test.png', 'user'),
  ('Antonette', '1111', 'Ervin Howell', 'Shanna@melissa.tv', 'test.png', 'user'),
  ('Samantha', '1111', 'Clementine Bauch', 'Nathan@yesenia.net', 'test.png', 'user'),
  ('Karianne', '1111', 'Patricia Lebsack', 'Julianne.OConner@kory.org', 'test.png', 'user'),
  ('Kamren', '1111', 'Chelsey Dietrich', 'Lucio_Hettinger@annie.ca', 'test.png', 'user'),
  ('Leopoldo_Corkery', '1111', 'Mrs. Dennis Schulist', 'Karley_Dach@jasper.info', 'test.png', 'user'),
  ('Elwyn_Skiles', '1111', 'Kurtis Weissnat', 'Telly.Hoeger@billy.biz', 'test.png', 'user'),
  ('Maxime_Nienow', '1111', 'Nicholas Runolfsdottir V', 'Sherwood@rosamond.me', 'test.png', 'user'),
  ('Delphine', '1111', 'Glenna Reichert', 'Chaim_McDermott@dana.io', 'test.png', 'user'),
  ('Moriah_Stanton', '1111', 'Clementina DuBuque', 'Rey.Padberg@karina.biz', 'test.png', 'user');

INSERT INTO post (author, title, status, content)
VALUES
  ('ychuiko', 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', 'active', 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'),
  ('ychuiko', 'qui est esse', 'active', 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla'),
  ('Samantha', 'ea molestias quasi exercitationem repellat qui ipsa sit aut', 'active', 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut'),
  ('Leopoldo_Corkery', 'eum et est occaecati', 'active', 'ullam et saepe reiciendis voluptatem adipisci sit amet autem assumenda provident rerum culpa quis hic commodi nesciunt rem tenetur doloremque ipsam iure quis sunt voluptatem rerum illo velit'),
  ('Leopoldo_Corkery', 'enesciunt quas odio', 'inactive', 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque');

INSERT INTO comment (author, content)
VALUES
  ('ychuiko', 'laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus dolor quam autem quasi reiciendis et nam sapiente accusantium'),
  ('Bret', 'est natus enim nihil est dolore omnis voluptatem numquam et omnis occaecati quod ullam at voluptatem error expedita pariatur nihil sint nostrum voluptatem reiciendis et'),
  ('Antonette', 'quia molestiae reprehenderit quasi aspernatur aut expedita occaecati aliquam eveniet laudantium omnis quibusdam delectus saepe quia accusamus maiores nam est cum et ducimus et vero voluptates excepturi deleniti ratione'),
  ('Samantha', 'non et atque occaecati deserunt quas accusantium unde odit nobis qui voluptatem quia voluptas consequuntur itaque dolor et qui rerum deleniti ut occaecati'),
  ('Karianne', 'harum non quasi et ratione tempore iure ex voluptates in ratione harum architecto fugit inventore cupiditate voluptates magni quo et'),
  ('Kamren', 'doloribus at sed quis culpa deserunt consectetur qui praesentium accusamus fugiat dicta voluptatem rerum ut voluptate autem voluptatem repellendus aspernatur dolorem in'),
  ('Leopoldo_Corkery', 'maiores sed dolores similique labore et inventore et quasi temporibus esse sunt id et eos voluptatem aliquam aliquid ratione corporis molestiae mollitia quia et magnam dolor'),
  ('Elwyn_Skiles', 'ut voluptatem corrupti velit ad voluptatem maiores et nisi velit vero accusamus maiores voluptates quia aliquid ullam eaque'),
  ('Maxime_Nienow', 'sapiente assumenda molestiae atque adipisci laborum distinctio aperiam et ab ut omnis et occaecati aspernatur odit sit rem expedita quas enim ipsam minus'),
  ('Delphine', 'voluptate iusto quis nobis reprehenderit ipsum amet nulla quia quas dolores velit et non aut quia necessitatibus nostrum quaerat nulla et accusamus nisi facilis'),
  ('Moriah_Stanton', 'expedita maiores dignissimos facilis ipsum est rem est fugit velit sequi eum odio dolores dolor totam occaecati ratione eius rem velit');

INSERT INTO post_comments (post_id, comment_id)
VALUES
  (1, 2),
  (1, 3),
  (2, 1),
  (1, 4),
  (1, 5),
  (2, 6),
  (2, 7),
  (3, 8),
  (5, 9),
  (5, 10);

INSERT INTO like_entity (author, type)
VALUES
  ('ychuiko', 'like'),
  ('Bret', 'like'),
  ('Antonette', 'like'),
  ('Samantha', 'like'),
  ('Karianne', 'like'),
  ('Kamren', 'dislike'),
  ('Leopoldo_Corkery', 'dislike'),
  ('Elwyn_Skiles', 'dislike'),
  ('Maxime_Nienow', 'like'),
  ('Delphine', 'like'),
  ('Moriah_Stanton', 'like');

INSERT INTO post_likes (post_id, like_id)
VALUES
  (1, 2),
  (1, 3),
  (2, 1),
  (1, 4),
  (1, 5),
  (2, 6),
  (2, 7),
  (3, 8),
  (5, 9),
  (5, 10);
