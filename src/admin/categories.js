import React from 'react';
import {
  Show,
  SimpleShowLayout,
  List,
  Edit,
  Create,
  Datagrid,
  ReferenceField,
  TextField,
  EditButton,
  SimpleForm,
  TextInput,
  required,
  NumberField,
  TabbedShowLayout,
  Tab,
  ReferenceManyField,
  useRecordContext,
  ChipField,
  Pagination,
  ReferenceArrayField,
  SingleFieldList,
} from 'react-admin';

const categoryFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

export const CategoryList = props => (
  <List {...props} filters={categoryFilters}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ChipField size="small" source="title" />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);

const CategoryTitle = () => {
  const record = useRecordContext();
  return <span>Categoty: {record ? `${record.title}` : ''}</span>;
};

export const CategoryEdit = () => (
  <Edit title={<CategoryTitle />}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" validate={required()} />
      <TextInput multiline source="description" fullWidth validate={required()} />
    </SimpleForm>
  </Edit>
);

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <TextInput multiline source="description" fullWidth validate={required()} />
    </SimpleForm>
  </Create>
);

export const CategoryShow = props => (
  <Show title={<CategoryTitle />} {...props}>
    <TabbedShowLayout spacing={2}>
      <Tab label="Summary">
        <SimpleShowLayout>
          <TextField source="id" />
          <TextField size="small" source="title" />
          <TextField source="description" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Posts" path="posts">
        <ReferenceManyField reference="posts" target="post_categories" pagination={<Pagination />} label={false}>
          <Datagrid hover={false}>
            <TextField source="id" />
            <ReferenceField label="Author" source="author_id" reference="users">
              <TextField source="login" />
            </ReferenceField>
            <TextField source="title" />
            <NumberField source="rating" />
            <ReferenceArrayField label="Categories" source="post_categories" reference="categories">
              <SingleFieldList linkType="">
                <ChipField source="title" />
              </SingleFieldList>
            </ReferenceArrayField>
            <TextField source="status" />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
