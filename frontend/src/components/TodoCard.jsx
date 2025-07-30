export function TodoCard(props) {
  const {todo, handleDeleteTodo, handleCompletedTodo} = props
  return (
    <div className="card todo-item">
      <p>{todo.input}</p>
      <div className="todo-buttons">
        <button onClick={() => handleCompletedTodo(todo.id)} disabled={todo.complete}>
          <h6>Done</h6>
        </button>
        <button onClick={() => handleDeleteTodo(todo.id)}>
          <h6>Delete</h6>
        </button>
      </div>
    </div>
  )
}