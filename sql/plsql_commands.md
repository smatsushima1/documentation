# Basic PL/SQL Commands
Outline of code below:
```
### [COMMAND]

[CODE]
-- [EXPECTED_OUTPUT]
-- [GENERAL_COMMENTS]
```

### Contents
- [**Create table with primary key**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#create-table-with-primary-key)
- [**Create copy of table**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#create-copy-of-table)
- [**Delete table**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#delete-table)
- [**Insert data into table**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#insert-data-into-table)
- [**Insert data into table, alternative**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#insert-data-into-table-alternative)
- [**Modify table to have primary key**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#modify-table-to-have-primary-key)
- [**Add more columns to existing table**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#add-more-columns-to-existing-table)
- [**Delete duplicate rows**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#delete-duplicate-rows)
- [**Create index**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#create-index)
- [**Create view**](https://github.com/smatsushima1/home/blob/master/sql/plsql_commands.md#create-view)

### Create table with primary key
```
create table [TABLE]
([COLUMN_1] [DATA_TYPE],
[COLUMN_2] [DATA_TYPE]
constraint [CONSTRAINT_NAME] primary key ([DESIRED_COLUMN]));
-- varchar2(20), number,...
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Create copy of table
```
create table [TABLE] as
select *
from [EXISTING_TABLE];
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Delete table
```
drop table [TABLE]
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Insert data into table
```
insert into [TABLE](COLUMN_1, COLUMN_2)
values ([DATA_FOR_COLUMN_1], [DATA_FOR_COLUMN_2]);
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Insert data into table, alternative
```
insert all
into stores ([COLUMN_1], [COLUMN_2]) values ([COLUMN_1_VALUES], [COLUMN_2_VALUES])
into stores ([COLUMN_1], [COLUMN_2]) values ([COLUMN_1_VALUES], [COLUMN_2_VALUES])
into stores ([COLUMN_1], [COLUMN_2]) values ([COLUMN_1_VALUES], [COLUMN_2_VALUES])
select * from dual;
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Modify table to have primary key
```
alter table [TABLE]
add constraint [CONSTRAINT_NAME]
primary key ([DESIRED_COLUMN]);
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Add more columns to existing table
```
alter table [TABLE]
add
([COLUMN_1] [DATA_TYPE],
[COLUMN_2] [DATA_TYPE]);
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Delete duplicate rows
```
delete from [TABLE]
where rowid not in
(select min(rowid)
from [TABLE]
group by [COLUMN_1], [COLUMN_2]);
-- deletes duplicate rows from [COLUMN_1] and [COLUMN_2]
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Create index
```
create unique index [INDEX_NAME]
on [TABLE] (COLUMN)
compute statistics;
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)

### Create view
```
create view [VIEW_NAME]
as select *
from [TABLE]
where [COLUMN] = [RESULT]
-- creates view from [TABLE]
```
[Top](https://github.com/smatsushima1/home/blob/master/sql/basic_plsql_commands.md#basic-plsql-commands)
