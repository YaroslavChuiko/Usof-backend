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
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const statuses = [
  { status: 'active', label: 'active' },
  { status: 'inactive', label: 'inactive' },
];

const postFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <ReferenceInput source="userId" label="User" reference="users">
    <SelectInput optionText="name" />
  </ReferenceInput>,
];

export const PostList = props => (
  <List {...props} filters={postFilters}>
    <Datagrid>
      <TextField source="id" />
      {/* <ReferenceField label="Login" source="login" reference="users"> */}
      <TextField source="author" />
      {/* <TextField source="login" /> */}
      {/* </ReferenceField> */}
      <TextField source="title" />
      <TextField source="status" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

const PostTitle = ({ record }) => {
  return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = () => (
  <Edit title={<PostTitle />}>
    <SimpleForm>
      <TextInput disabled source="id" />
      {/* <ReferenceInput label="User" source="userId" reference="users">
                <SelectInput optionText="name" />
            </ReferenceInput> */}
      {/* <ReferenceInput label="Status" source="staus" reference="posts"> */}
      <TextInput disabled label="Publication date" source="publish_date" />
      <SelectInput source="status" optionValue="status" optionText="status" choices={statuses} validate={required()} />
      {/* </ReferenceInput> */}
      <TextInput disabled source="title" fullWidth />
      <TextInput disabled multiline source="content" fullWidth />
    </SimpleForm>
  </Edit>
);

export const PostCreate = () => (
  <Create>
    <SimpleForm>
      {/* <ReferenceInput label="User" source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput> */}
      <SelectInput source="status" optionValue="status" optionText="status" choices={statuses} validate={required()} />
      <TextInput source="title" fullWidth />
      <RichTextInput multiline source="content" validate={required()} fullWidth />
    </SimpleForm>
  </Create>
);

export const PostShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="author" />
      <TextField source="status" />
      <DateField label="Publication date" source="publish_date" />
      <TextField source="title" />
      <RichTextField source="content" />
    </SimpleShowLayout>
  </Show>
);
