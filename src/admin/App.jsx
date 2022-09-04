import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import restProvider from 'ra-data-json-server';
// import jsonServerProvider from 'ra-data-json-server'; 

// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const dataProvider = restProvider('/api'); //???

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={ListGuesser} edit={EditGuesser}/>
    {/* <Resource name="comments" list={ListGuesser} /> */}
  </Admin>
);

export default App;