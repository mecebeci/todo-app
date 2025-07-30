import { useState, useEffect } from "react"
import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"

function App() {

  const [todos, setTodos] = useState([])

  const [selectedTab, setSelectedTab] = useState('Open')

  useEffect(() => {
    fetch('http://localhost:8000/api/todos/')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setTodos(data)
      })
      .catch(err => console.error(err))
  }, [])

  function handleAddTodo(newTodo) {
    fetch('http://localhost:8000/api/todos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: newTodo, complete: false })
    })
      .then(res => res.json())
      .then(todo => setTodos(prev => [...prev, todo]))
      .catch(err => console.error(err))
  }

  function handleCompletedTodo(id) {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    fetch(`http://localhost:8000/api/todos/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complete: true })
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t))
      })
      .catch(err => console.error(err))
  }

  function handleDeleteTodo(id) {
    fetch(`http://localhost:8000/api/todos/${id}/`, {
      method: 'DELETE'
    })
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

