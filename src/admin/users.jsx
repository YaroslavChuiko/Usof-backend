import React from 'react';
import {
  Show,
  SimpleShowLayout,
  DateField,
  List,
  Edit,
  Create,
  Datagrid,
  ReferenceField,
  TextField,
  EditButton,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  EmailField,
  NumberField,
  PasswordInput,
  NumberInput,
  TabbedShowLayout,
  Tab,
  ReferenceManyField,
  useRecordContext,
  AutocompleteInput,
  Pagination,
} from 'react-admin';

const roles = [
  { role: 'user', label: 'user' },
  { role: 'admin', label: 'admin' },
];

const userFilters = [
  <ReferenceInput label="User" source="id" reference="users">
    <AutocompleteInput label="User" optionText="login" />
  </ReferenceInput>,
  <SelectInput label="Role" source="role" optionValue="role" optionText="label" choices={roles} />,
];

export const UserList = props => (
  <List {...props} filters={userFilters}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="login" />
      <TextField source="full_name" />
      <EmailField source="email" />
      <TextField source="role" />
      <NumberField source="rating" />
      <EditButton />
    </Datagrid>
  </List>
);

const UserTitle = () => {
  const record = useRecordContext();
  return <span>User: {record ? `${record.login}` : ''}</span>;
};

export const UserEdit = () => (
  <Edit title={<UserTitle />}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="login" validate={required()} />
      <TextInput source="full_name" validate={required()} />
      <SelectInput source="role" optionValue="role" optionText="label" choices={roles} validate={required()} />
      <TextInput disabled source="email" validate={required()} />
      <TextInput source="profile_picture" validate={required()} />
      <NumberInput disabled source="rating" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="login" validate={required()} />
      <TextInput source="full_name" validate={required()} />
      <PasswordInput source="password" validate={required()} />
      <TextInput source="email" validate={required()} />
      <TextInput source="profile_picture" validate={required()} />
      {/* <ImageInput source="pictures" label="Related pictures" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput> */}
      <SelectInput source="role" optionValue="role" optionText="label" choices={roles} validate={required()} />
    </SimpleForm>
  </Create>
);

export const UserShow = props => (
  <Show title={<UserTitle />} {...props}>
    <TabbedShowLayout spacing={2}>
      <Tab label="Summary">
        <SimpleShowLayout>
          <TextField source="login" />
          <TextField source="full_name" />
          {/* <DateField label="Publication date" source="publish_date" /> */}
          <EmailField source="email" />
          <NumberField source="rating" />
          <TextField source="role" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Posts" path="posts">
        <ReferenceManyField reference="posts" target="author_id" pagination={<Pagination />} label={false}>
          <Datagrid rowClick="show">
            <TextField source="id" />
            <ReferenceField label="Author" source="author_id" reference="users">
              <TextField source="login" />
            </ReferenceField>
            <TextField source="title" />
            <NumberField source="rating" />
            <TextField source="status" />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
      <Tab label="Answers" path="answers">
        <ReferenceManyField reference="answers" target="author_id" pagination={<Pagination />} label={false}>
          <Datagrid rowClick="show">
            <TextField source="id" />
            <ReferenceField source="post_id" reference="posts" />
            <ReferenceField label="Author" source="author_id" reference="users">
              <TextField source="login" />
            </ReferenceField>
            <TextField source="status" />
            <NumberField source="rating" />
            <TextField source="content" />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
      <Tab label="Comments" path="comments">
        <ReferenceManyField reference="comments" target="author_id" pagination={<Pagination />} label={false}>
          <Datagrid rowClick="show">
            <TextField source="id" />
            <ReferenceField source="answer_id" reference="answers" />
            <ReferenceField label="Author" source="author_id" reference="users">
              <TextField source="login" />
            </ReferenceField>
            <TextField source="status" />
            <TextField source="content" />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
      <Tab label="Likes" path="likes">
        <ReferenceManyField reference="likes" target="author_id" pagination={<Pagination />} label={false}>
          <Datagrid hover={false}>
            <TextField source="id" />
            <ReferenceField label="Author" source="author_id" reference="users">
              <TextField source="login" />
            </ReferenceField>
            <ReferenceField label="Post" source="target_post" emptyText="null" reference="posts"/>
            <ReferenceField label="Comment" source="target_answer" emptyText="null" reference="answers" />
            <DateField label="Publication date" source="publish_date" locales="uk-UA" showTime />
            <TextField source="type" />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
