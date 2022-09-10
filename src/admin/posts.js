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
  DateInput,
  useRecordContext,
  AutocompleteInput,
  TabbedShowLayout,
  Tab,
  ReferenceManyField,
  NumberField,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const statuses = [
  { status: 'active', label: 'active' },
  { status: 'inactive', label: 'inactive' },
];

const postFilters = [
  <TextInput source="q" label="Search in title" alwaysOn />,
  <ReferenceInput label="Author" source="author_id" reference="users">
    <AutocompleteInput optionText="login" />
  </ReferenceInput>,
  <SelectInput source="status" optionValue="status" optionText="label" choices={statuses} />,
];

export const PostList = props => (
  <List {...props} filters={postFilters}>
    <Datagrid hover={false}>
      <TextField source="id" />
      <ReferenceField label="Author" source="author_id" reference="users">
        <TextField source="login" />
      </ReferenceField>
      <TextField source="title" />
      <TextField source="status" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

const PostTitle = () => {
  const record = useRecordContext();
  return <span>Post: {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = () => (
  <Edit title={<PostTitle />}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput label="Author" source="author_id" reference="users">
        <AutocompleteInput disabled optionText="login" />
      </ReferenceInput>
      <DateInput disabled label="Publication date" source="publish_date" />
      <SelectInput source="status" optionValue="status" optionText="status" choices={statuses} validate={required()} />
      <TextInput disabled source="title" fullWidth />
      <TextInput disabled multiline source="content" fullWidth />
    </SimpleForm>
  </Edit>
);

export const PostCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput label="Author" source="author_id" reference="users">
        <AutocompleteInput optionText="login" validate={required()} />
      </ReferenceInput>
      <SelectInput source="status" optionValue="status" optionText="label" choices={statuses} validate={required()} />
      <TextInput source="title" validate={required()} fullWidth />
      <RichTextInput multiline source="content" validate={required()} fullWidth />
    </SimpleForm>
  </Create>
);

export const PostShow = props => (
  <Show {...props} title={<PostTitle />}>
    <TabbedShowLayout spacing={2}>
      <Tab label="Summary">
        <SimpleShowLayout>
          <ReferenceField label="Author" source="author_id" reference="users">
            <TextField source="login" />
          </ReferenceField>
          <TextField source="status" />
          <DateField label="Publication date" source="publish_date" locales="uk-UA" showTime />
          <TextField source="title" />
          <RichTextField source="content" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Comments" path="comments">
        <ReferenceManyField reference="comments" target="post_id" label={false}>
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
    </TabbedShowLayout>
  </Show>
);
