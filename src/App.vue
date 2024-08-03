<script setup>
/* Imports*/
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
//import { collection, onSnapshot } from 'firebase/firestore'
import {
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  collection,
  onSnapshot,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore'

//  firebase/firestore/lite  <-- jak nie dziala

// Firebase refs
const todosCollectionRef = collection(db, 'todos')
const todosCollectionQuery = query(todosCollectionRef, orderBy('date', 'desc'))

/* todos*/
const todos = ref([])

/* Get todos*/
onMounted(async () => {
  //No In real time
  /*const querySnapshot = await getDocs(todosCollectionRef)
  let fbTodos = []
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data())
    const todo = {
      id: doc.id,
      content: doc.data().content,
      done: doc.data().done
    }
    fbTodos.push(todo)
  })
  todos.value = fbTodos*/

  //In real time showing db no need async to work
  const unsubscribe = onSnapshot(todosCollectionQuery, (querySnapshot) => {
    let fbTodos = []
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        content: doc.data().content,
        done: doc.data().done
      }
      fbTodos.push(todo)
    })
    todos.value = fbTodos
  })
})

/* Add todo*/
const newTodoContent = ref('')
const addTodo = async () => {
  /*const newTodo = {
    id: uuidv4(),
    content: newTodoContent.value,
    done: false
  }
  todos.value.unshift(newTodo)
  newTodoContent.value = ''*/

  await addDoc(todosCollectionRef, {
    content: newTodoContent.value,
    done: false,
    date: Date.now()
  })
  newTodoContent.value = ''
}

/* Delete todo*/
const deleteTodo = (id) => {
  //todos.value = todos.value.filter((todo) => todo.id !== id)
  deleteDoc(doc(todosCollectionRef, id))
}

/* Toggle done*/
const toggleDone = async (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id)
  //todos.value[index].done = !todos.value[index].done

  updateDoc(doc(todosCollectionRef, id), {
    done: !todos.value[index].done
  })
}

/* Modal control and rewrite */
const showModal = ref(false)
const reWrite = ref('')
const currentTodoId = ref(null)

const openModal = (id) => {
  currentTodoId.value = id
  const currentTodo = todos.value.find((todo) => todo.id === id)
  reWrite.value = currentTodo.content
  showModal.value = true
}

const updateTodo = async () => {
  const index = todos.value.findIndex((todo) => todo.id === currentTodoId.value)
  //todos.value[index].content = reWrite.value

  updateDoc(doc(todosCollectionRef, currentTodoId.value), {
    content: (todos.value[index].content = reWrite.value),
    date: Date.now()
  })
  showModal.value = false
}
</script>

<template>
  <div class="badassTodo">
    <div class="title has-text-centered">Todo App with Firebase</div>
    <form @submit.prevent="addTodo">
      <div class="field is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model="newTodoContent"
            class="input"
            type="text"
            placeholder="Find a repository"
          />
        </p>
        <p class="control">
          <button class="button is-info" :disabled="!newTodoContent">Add</button>
        </p>
      </div>
    </form>

    <div
      v-for="todo in todos"
      class="card mb-5"
      :key="todo.id"
      :class="{ 'has-background-success-light': todo.done }"
    >
      <div class="card-content" @click="openModal(todo.id)">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div class="column" :class="{ 'has-text-success line-through': todo.done }">
              {{ todo.content }}
            </div>
            <div class="column is-5 has-text-right">
              <button
                @click.stop="toggleDone(todo.id)"
                class="button"
                :class="todo.done ? 'is-success' : 'is-light'"
              >
                &check;
              </button>
              <button @click.stop="deleteTodo(todo.id)" class="button is-danger ml-2">
                &cross;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="showModal" class="overlay">
      <div class="modal">
        <textarea v-model.trim="reWrite" name="note" id="note" cols="33" rows="13"></textarea>
        <button @click="updateTodo">Rewrite</button>
        <button class="close" @click="showModal = false">Close</button>
      </div>
    </div>
  </div>
</template>
<style>
@import 'bulma/css/bulma.min.css';

.badassTodo {
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
}

.line-through {
  text-decoration: line-through;
}

/* Modal */
.overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: center;
}
.modal {
  width: 380px;
  height: 380px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 10px;
  animation: slideFromDown 0.5s ease-in-out;
}
.modal button {
  padding: 10px 20px;
  font-size: 20px;
  width: 100%;
  background-color: blueviolet;
  border: none;
  color: white;
  cursor: pointer;
  margin-top: 20px;
}
.modal .close {
  background-color: red;
  margin-top: 7px;
}
.modal p {
  color: red;
}
</style>
