import 'react-native-get-random-values';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import Realm, {BSON} from 'realm';

const appId = '';
const appConfig = {id: appId, timeout: 10000};

const App = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('shivam');
  const [todoName, setTodoName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);



  const TaskSchema = {
    name: "Task",
    properties: {
      _id: "int",
      name: "string",
      status: "string?",
    },
    primaryKey: "_id",
  };
  
  async function quickStart() {
    const realm = await Realm.open({
      path: "myrealm",
      schema: [TaskSchema],
    });
  
    // Add a couple of Tasks in a single, atomic transaction
    let task1, task2;
    realm.write(() => {
      task1 = realm.create("Task", {
        _id: 1,
        name: "go grocery shopping",
        status: "Open",
      });
  
      task2 = realm.create("Task", {
        _id: 2,
        name: "go exercise",
        status: "Open",
      });
      console.log(`created two tasks: ${task1.name} & ${task2.name}`);
    });
    // use task1 and task2
  
    // query realm for all instances of the "Task" type.
    const tasks = realm.objects("Task");
    console.log(`The lists of tasks are: ${tasks.map((task) => task.name)}`);
  
    // filter for all tasks with a status of "Open"
    const openTasks = tasks.filtered("status = 'Open'");
    console.log(
      `The lists of open tasks are: ${openTasks.map(
        (openTask) => openTask.name
      )}`
    );
  
    // Sort tasks by name in ascending order
    const tasksByName = tasks.sorted("name");
    console.log(
      `The lists of tasks in alphabetical order are: ${tasksByName.map(
        (taskByName) => taskByName.name
      )}`
    );
  
  
    // Define the collection notification listener
    function listener(tasks, changes) {
      // Update UI in response to deleted objects
      changes.deletions.forEach((index) => {
        // Deleted objects cannot be accessed directly,
        // but we can update a UI list, etc. knowing the index.
        console.log(`A task was deleted at the ${index} index`);
      });
      // Update UI in response to inserted objects
      changes.insertions.forEach((index) => {
        let insertedTasks = tasks[index];
        console.log(
          `insertedTasks: ${JSON.stringify(insertedTasks, null, 2)}`
        );
        // ...
      });
      // Update UI in response to modified objects
      // `newModifications` contains object indexes from after they were modified
      changes.newModifications.forEach((index) => {
        let modifiedTask = tasks[index];
        console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`);
        // ...
      });
    }
    // Observe collection notifications.
    tasks.addListener(listener);
  
    realm.write(() => {
      task1.status = "InProgress";
    });
  
  
    realm.write(() => {
      // Delete the task from the realm.
      realm.delete(task1);
      // Discard the reference.
      task1 = null;
    });
  
  
    // Remember to close the realm
    realm.close();
  }
  quickStart().catch((error) => {
    console.log(`An error occurred: ${error}`);
  });
  

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <FlatList
          data={data}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => {
            return (
              <View style={styles.listItem}>
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
        <View style={styles.fotter}>
          <TextInput
            placeholder="Enter your name"
            value={todoName}
            onChangeText={setTodoName}
          />
          <TouchableOpacity onPress={() => setLoggedIn(!loggedIn)}>
            <Text>change</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  fotter: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginScreen: {
    backgroundColor: 'green',
    flex: 1,
  },
  textinput: {
    backgroundColor: 'white',
    padding: 10,
    width: '90%',
    borderRadius: 5,
  },
  actionText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
