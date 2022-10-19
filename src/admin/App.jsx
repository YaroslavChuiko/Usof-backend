import restProvider from 'ra-data-json-server';
import { Admin, Resource } from 'react-admin';
import authProvider from './authProvider';
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from './categories';
import { AnswerCreate, AnswerEdit, AnswerList, AnswerShow } from './answers';
import { CommentCreate, CommentEdit, CommentList, CommentShow } from './comments';
import { PostCreate, PostEdit, PostList, PostShow } from './posts';
import { UserCreate, UserEdit, UserList, UserShow } from './users';

const dataProvider = restProvider('/api');

const App = () => (
  <Admin title="My Custom Admin" dataProvider={dataProvider} authProvider={authProvider} requireAuth>
    <Resource
      name="users"
      list={UserList}
      show={UserShow}
      edit={UserEdit}
      create={UserCreate}
    />
    <Resource
      name="posts"
      list={PostList}
      show={PostShow}
      edit={PostEdit}
      create={PostCreate}
    />
    <Resource
      name="answers"
      list={AnswerList}
      show={AnswerShow}
      edit={AnswerEdit}
      create={AnswerCreate}
    />
    <Resource
      name="comments"
      list={CommentList}
      show={CommentShow}
      edit={CommentEdit}
      create={CommentCreate}
    />
    <Resource
      name="categories"
      list={CategoryList}
      show={CategoryShow}
      edit={CategoryEdit}
      create={CategoryCreate}
    />
  </Admin>
);

export default App;
