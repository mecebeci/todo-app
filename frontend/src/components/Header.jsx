export function Header(props){
    const {todos} = props
    const todosLength = todos.length

    const isTaskPlural = todosLength != 1
    const taskOrTask = (isTaskPlural) ? 'tasks' : 'task'
    return(
        <header>
            <h1 className="text-gradient">You have {todosLength} open {taskOrTask}.</h1>
        </header>
    )
}