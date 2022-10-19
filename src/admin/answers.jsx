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
  NumberField,
  TabbedShowLayout,
  Tab,
  ReferenceManyField,
  useRecordContext,
  AutocompleteInput,
  DateInput,
  Pagination,
} from 'react-admin';

const statuses = [
  { status: 'active', label: 'active' },
  { status: 'inactive', label: 'inactive' },
];

const answerFilters = [
  <ReferenceInput label="Author" source="author_id" reference="users">
    <AutocompleteInput optionText="login" />
  </ReferenceInput>,
  <ReferenceInput label="Post" source="post_id" reference="posts">
    <AutocompleteInput optionText="title" />
  </ReferenceInput>,
  <SelectInput source="status" optionValue="status" optionText="label" choices={statuses} />,
];

export const AnswerList = props => (
  <List {...props} filters={answerFilters}>
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
  </List>
);

const AnswerTitle = () => {
  const record = useRecordContext();
  return <span>Answer: id{record ? `${record.id}` : ''}</span>;
};

export const AnswerEdit = () => (
  <Edit title={<AnswerTitle />}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput label="Author" source="author_id" reference="users">
        <SelectInput disabled optionText="login" />
      </ReferenceInput>
      <DateInput disabled label="Publication date" source="publish_date" />
      <SelectInput source="status" optionValue="status" optionText="status" choices={statuses} validate={required()} />
      <TextInput disabled multiline source="content" fullWidth />
    </SimpleForm>
  </Edit>
);

export const AnswerCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput label="Author" source="author_id" reference="users">
        <AutocompleteInput optionText="login" validate={required()} />
      </ReferenceInput>
      <ReferenceInput label="Post" source="post_id" reference="posts">
        <AutocompleteInput optionText="title" validate={required()} />
      </ReferenceInput>
      <SelectInput source="status" optionValue="status" optionText="label" choices={statuses} validate={required()} />
      <TextInput multiline source="content" validate={required()} fullWidth />
    </SimpleForm>
  </Create>
);

export const AnswerShow = props => (
  <Show title={<AnswerTitle />} {...props}>
    <TabbedShowLayout spacing={2}>
      <Tab label="Summary">
        <SimpleShowLayout>
          <NumberField source="id" />
          <ReferenceField label="Post" source="post_id" reference="posts">
            <TextField source="id" />
          </ReferenceField>
          <ReferenceField label="Author" source="author_id" reference="users">
            <TextField source="login" />
          </ReferenceField>
          <DateField label="Publication date" source="publish_date" />
          <TextField source="content" />
          <NumberField source="rating" />
          <TextField source="status" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Comments" path="comments">
        <ReferenceManyField reference="comments" target="answer_id" pagination={<Pagination />} label={false}>
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
        <ReferenceManyField reference="likes" target="target_answer" pagination={<Pagination />} label={false}>
          <Datagrid hover={false}>
            <TextField source="id" />
            <ReferenceField label="Author" source="author_id" reference="users">
              <TextField source="login" />
            </ReferenceField>
            <DateField label="Publication date" source="publish_date" locales="uk-UA" showTime />
            <TextField source="type" />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
