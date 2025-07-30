import { TodoCard } from './TodoCard'

export function TodoList(props) {
  const {todos, selectedTab, handleDeleteTodo, handleCompletedTodo} = props

  const filterTodosList = selectedTab === "All" ? 
    todos : 
    selectedTab === 'Completed' ? 
      todos.filter(val => val.complete) :
      todos.filter(val => !val.complete)

  return (
    <>
      {filterTodosList.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleCompletedTodo={handleCompletedTodo}
        />
      ))}
    </>
  )
}