import React from 'react';
import {
  Show,
  ShowButton,
  SimpleShowLayout,
  RichTextField,
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
  ChipField,
  ImageInput,
  ImageField,
  AutocompleteInput,
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
      {/* <ChipField source="role" /> */}
      <EditButton />
      {/* <ShowButton /> */}
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
      <TextInput source="email" validate={required()} />
      <NumberInput disabled source="rating" />
      {/* <PasswordInput disabled source="password" /> */}
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="login" validate={required()} />
      <TextInput source="full_name" validate={required()} />
      <PasswordInput source="password" validate={required()} />
      <TextInput source="profile_picture" validate={required()} />
      {/* <ImageInput source="pictures" label="Related pictures" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput> */}
      <TextInput source="email" validate={required()} />
      <SelectInput source="role" optionValue="role" optionText="label" choices={roles} validate={required()} />
    </SimpleForm>
  </Create>
);

export const UserShow = props => (
  <Show title={<UserTitle />} {...props}>
    <TabbedShowLayout spacing={2}>
      <Tab label="Summary">
        <TextField source="login" />
        <TextField source="full_name" />
        {/* <DateField label="Publication date" source="publish_date" /> */}
        <EmailField source="email" />
        <NumberField source="rating" />
        <TextField source="role" />
      </Tab>
      <Tab label="Posts" path="posts">
        <ReferenceManyField reference="posts" target="author_id" label={false}>
          <Datagrid>
            <TextField source="id" />
            <ReferenceField label="Author" source="author_id" reference="users">
              <TextField source="login" />
            </ReferenceField>
            <TextField source="title" />
            <TextField source="status" />
            <EditButton />
            <ShowButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);