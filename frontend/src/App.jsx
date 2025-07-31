import { useState, useEffect } from "react"
import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import axios from "axios"

function App() {

  const [todos, setTodos] = useState([])

  const [selectedTab, setSelectedTab] = useState('Open')

  useEffect(() => {
    axios.get('http://localhost:8000/api/todos/')
      .then(res => {
        console.log(res.data)
        setTodos(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  function handleAddTodo(newTodo) {
    axios.post('http://localhost:8000/api/todos/', {
      input : newTodo,
      complete : false
    })
      .then(res => setTodos(prev => [...prev, res.data]))
      .catch(err => console.error(err))
  }

  function handleCompletedTodo(id) {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    axios.patch(`http://localhost:8000/api/todos/${id}/`, {
      complete : true
    })
      .then(res => {
        const updatedTodo = res.data
        setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t))
      })
      .catch(err => console.err(err))
  }

  function handleDeleteTodo(id) {
    console.log(id)
    axios.delete(`http://localhost:8000/api/todos/${id}/`)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id))
      })
      .catch(err => console.error(err))
  }

  return (
    <>
      <Header todos={todos}/>
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} todos={todos}/>
      <TodoList selectedTab={selectedTab} handleDeleteTodo={handleDeleteTodo}
       handleCompletedTodo={handleCompletedTodo} todos={todos}/>
      <TodoInput handleAddTodo={handleAddTodo}/>
    </>
  )

}

export default App

