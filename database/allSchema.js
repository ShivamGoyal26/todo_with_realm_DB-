import Realm from 'realm';
export const TODOLIST_SCHEMA = 'TodoList';
export const TODO_SCHEMA = 'Todo';

export const TodoSchema = {
  name: TODO_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: {type: 'string', indexed: true},
    done: {type: 'bool', default: false},
  },
};

export const TodoListSchema = {
  name: TODOLIST_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    creationDate: 'date',
    todos: {type: 'list', objectType: TODO_SCHEMA},
  },
};

const databaseOptions = {
  path: 'toDoListApp.realm',
  schema: [TodoListSchema, TodoSchema],
  schemaVersion: 0,
};

export const addNewRecord = data =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.create(TODOLIST_SCHEMA, data);
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });

export const updateRecord = data =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let updatingTodoList = realm.objectForPrimaryKey(
          TODOLIST_SCHEMA,
          data.id,
        );
        updatingTodoList.name = data.name;
        resolve();
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });

export const deleteRecord = data =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let deletingTodoList = realm.objectForPrimaryKey(
          TODOLIST_SCHEMA,
          data.id,
        );
        realm.delete(deletingTodoList);
        resolve();
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });

export const deleteAllRecord = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allList = realm.objects(TODOLIST_SCHEMA);
        realm.delete(allList);
        resolve();
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });

export const queryAllRecord = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allList = realm.objects(TODOLIST_SCHEMA);
        resolve(allList);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });

  export default new Realm(databaseOptions)