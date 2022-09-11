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

INSERT INTO post (author_id, title, status, content)
VALUES
  (1, 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', 'active', 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'),
  (1, 'qui est esse', 'active', 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla'),
  (4, 'ea molestias quasi exercitationem repellat qui ipsa sit aut', 'active', 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut'),
  (7, 'eum et est occaecati', 'active', 'ullam et saepe reiciendis voluptatem adipisci sit amet autem assumenda provident rerum culpa quis hic commodi nesciunt rem tenetur doloremque ipsam iure quis sunt voluptatem rerum illo velit'),
  (7, 'enesciunt quas odio', 'inactive', 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque'),
  (2, 'First post', 'active', 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque'),
  (3, 'Second post', 'active', 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque'),
  (5, 'Third post', 'active', 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque'),
  (6, 'Fourth post', 'active', 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque');


INSERT INTO comment (author_id, post_id, content)
VALUES
  (1, 2, 'laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus dolor quam autem quasi reiciendis et nam sapiente accusantium'),
  (2, 1, 'est natus enim nihil est dolore omnis voluptatem numquam et omnis occaecati quod ullam at voluptatem error expedita pariatur nihil sint nostrum voluptatem reiciendis et'),
  (3, 1, 'quia molestiae reprehenderit quasi aspernatur aut expedita occaecati aliquam eveniet laudantium omnis quibusdam delectus saepe quia accusamus maiores nam est cum et ducimus et vero voluptates excepturi deleniti ratione'),
  (4, 1, 'non et atque occaecati deserunt quas accusantium unde odit nobis qui voluptatem quia voluptas consequuntur itaque dolor et qui rerum deleniti ut occaecati'),
  (5, 1, 'harum non quasi et ratione tempore iure ex voluptates in ratione harum architecto fugit inventore cupiditate voluptates magni quo et'),
  (6, 2, 'doloribus at sed quis culpa deserunt consectetur qui praesentium accusamus fugiat dicta voluptatem rerum ut voluptate autem voluptatem repellendus aspernatur dolorem in'),
  (7, 2, 'maiores sed dolores similique labore et inventore et quasi temporibus esse sunt id et eos voluptatem aliquam aliquid ratione corporis molestiae mollitia quia et magnam dolor'),
  (8, 3, 'ut voluptatem corrupti velit ad voluptatem maiores et nisi velit vero accusamus maiores voluptates quia aliquid ullam eaque'),
  (9, 5, 'sapiente assumenda molestiae atque adipisci laborum distinctio aperiam et ab ut omnis et occaecati aspernatur odit sit rem expedita quas enim ipsam minus'),
  (10, 5, 'voluptate iusto quis nobis reprehenderit ipsum amet nulla quia quas dolores velit et non aut quia necessitatibus nostrum quaerat nulla et accusamus nisi facilis'),
  (11, 1, 'expedita maiores dignissimos facilis ipsum est rem est fugit velit sequi eum odio dolores dolor totam occaecati ratione eius rem velit');

INSERT INTO category (title, description)
VALUES
  ( 'javascript', 'For questions regarding programming in ECMAScript (JavaScript/JS) and its various dialects/implementations (excluding ActionScript).'),
  ( 'python', 'FPython is a multi-paradigm, dynamically typed, multi-purpose programming language. It is designed to be quick to learn, understand, and use, and enforces a clean and uniform syntax.'),
  ( 'java', 'Java is a high-level object-oriented programming language. Use this tag when you`re having problems using or understanding the language itself. This tag is frequently used alongside other tags for libraries and/or frameworks used by Java developers.'),
  ( 'c#', "C# (pronounced 'see sharp') is a high level, statically typed, multi-paradigm programming language developed by Microsoft. C# code usually targets Microsoft's .NET family of tools and run-times, which include .NET, .NET Framework and Xamarin among others. Use this tag for questions about code written in C# or about C#'s formal specification."),
  ( 'php', "PHP is a widely used, open source, general-purpose, multi-paradigm, dynamically typed and interpreted scripting language designed initially for server-side web development. Use this tag for questions about programming in the PHP language."),
  ( 'html', "HTML (HyperText Markup Language) is the markup language for creating web pages and other information to be displayed in a web browser. Questions regarding HTML should include a minimal reproducible example and some idea of what you're trying to achieve. This tag is rarely used alone and is often paired with [CSS] and [JavaScript]."),
  ( 'node.js', "Node.js is an event-based, non-blocking, asynchronous I/O runtime that uses Google's V8 JavaScript engine and libuv library. It is used for developing applications that make heavy use of the ability to run JavaScript both on the client as well as on the server side and therefore benefit from the re-usability of code and the lack of context switching."),
  ( 'reactjs', "React is a JavaScript library for building user interfaces. It uses a declarative, component-based paradigm and aims to be efficient and flexible."),
  ( 'mysql', "MySQL is a free, open-source Relational Database Management System (RDBMS) that uses Structured Query Language (SQL). DO NOT USE this tag for other DBs such as SQL Server, SQLite etc. Those are different DBs that all use their own dialects of SQL to manage the data.");

INSERT INTO post_categories (post_id, category_id)
VALUES
  (1, 1),
  (1, 6),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5),
  (6, 7),
  (6, 9),
  (7, 9),
  (8, 8),
  (8, 1),
  (9, 5),
  (9, 9);

INSERT INTO like_entity (author_id, target_post, type)
VALUES
  (1, 2, 'like'),
  (2, 1, 'like'),
  (3, 1, 'like'),
  (4, 1, 'like'),
  (5, 1, 'like'),
  (6, 2, 'dislike'),
  (7, 2, 'dislike'),
  (8, 3, 'dislike'),
  (9, 5, 'like'),
  (10, 5, 'like'),
  (11, 3, 'like');
