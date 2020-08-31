import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,
   SafeAreaView, StatusBar, FlatList, Modal, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App(){
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem('@task');
      if (taskStorage) {
        setTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTasks() {
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }
    saveTasks();
  }, [task]);

  function createTask(){
    if(input === '') return;

    const data = {
      key: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    setInput('');
  }

  return(
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F28133" barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}> Lista de Tarefas </Text>
      </View>
     
     <FlatList showsHorizontalScrollIndicator={false}
     data={task}
     keyExtractor={ (item) => String(item.key) }
     renderItem={ ({ item }) => <TaskList data = {item} /> }
     />

     <Modal animationType="slide" transparent={false} visible={open}>
       <SafeAreaView style={styles.modal}>
         <View style={styles.modalHeader}>
           <TouchableOpacity onPress={ () => setOpen(false)}>
             <Ionicons style={{marginLeft: 5, marginRight: 5}} name="md-arrow-back" size={20} color="#FFF" />
           </TouchableOpacity>
           <Text style={styles.modalTitle}>Nova Tarefa</Text>
         </View>

         <Animatable.View animation="fadeInUp" useNativeDriver
         style={styles.modalBody}>
           <TextInput
           multiline={true}
           autoCorrect={false}
           value={input}
           onChangeText={ (texto) => setInput(texto) }
           placeholder="Digite a tarefa"
           style={styles.input} 
           />

           <TouchableOpacity style={styles.button} onPress={createTask}>
             <Text style={styles.buttonText}> Gravar </Text>
           </TouchableOpacity>
         </Animatable.View>
       </SafeAreaView>
     </Modal>

      <AnimatedBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={ () => setOpen(true)}>
        <Ionicons name="ios-add" size={30} color="#FFF" />
      </AnimatedBtn>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F28133'
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  input: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    textAlignVertical: 'top',
    padding: 9,
    height: 50,
    fontSize: 15
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0979FA',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    height: 35
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  modal: {
    flex: 1,
    backgroundColor: '#F28133'
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 20,
    color: '#FFF'
  },
  modalBody: {
    marginTop: 15
  }
});