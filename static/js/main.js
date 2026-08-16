const template = document.getElementById('todo-template')
const container = document.getElementById('todo-main')
const addTaskBtn = document.getElementById('add-task')

function taskTemplate(todo) {
    let currentTodo = todo
    const clone = document.importNode(template.content, true)
    const checkBox = clone.querySelector('input[type="checkbox"]')
    const textArea = clone.querySelector('.task-field')
    const removeTaskBtn = clone.querySelector('.delete-task-btn')

    if (currentTodo) {
        textArea.value = currentTodo.todo_name
        checkBox.disabled = false
        if (currentTodo.completed === true) {
            checkBox.checked = true
            textArea.classList.add('completed')
        }
    } else {
        checkBox.disabled = true
    }

    checkBox.addEventListener('change', (event) => {
        if (event.target.checked) {
            textArea.classList.add('completed')
            updateTask(currentTodo.todo_id, true)
        } else {
            textArea.classList.remove('completed')
            updateTask(currentTodo.todo_id, false)
        }
    })

    textArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            
            const todo_name = textArea.value.trim()
            if (todo_name === '') return

            if (currentTodo === undefined) {
                createTask(todo_name).then((createdTodo) => {
                    currentTodo = createdTodo
                })
            } else {
                updateTask(currentTodo.todo_id, todo_name)
            }
            checkBox.disabled = false
        }
    })

    removeTaskBtn.addEventListener('dblclick', (event) => {
        event.target.parentElement.remove()
        if (currentTodo) deleteTask(currentTodo.todo_id)
    })

    container.appendChild(clone)
    textArea.focus()
}

async function getTasks() {
    const response = await fetch('http://127.0.0.1:8000/todos', {
        method: 'GET'
    })
    const todos = await response.json()
    
    todos.forEach((todo) => {
        taskTemplate(todo)
    });
}

async function createTask(todo_name) {
    const response = await fetch('http://127.0.0.1:8000/todos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'name': todo_name})
    })

    return await response.json()
}

async function updateTask(id, update) {
    const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'update': update})
    })

    return await response.json()
}

async function deleteTask(id) {
    const response = await fetch(`http://127.0.0.1:8000/todos/${id}`,{
        method: 'DELETE'
    })
    
    return await response.json()
}

addTaskBtn.addEventListener('click', (event) => {
    taskTemplate()
})


getTasks()