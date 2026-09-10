import { template, container, addTaskBtn } from './dom_elements.js'
import { getStoredTasks, findTaskByName, createTask, updateTask, deleteTask } from './api.js'


export function initTasks() {
    addTaskBtn.addEventListener('click', () => taskTemplate())
    loadTasks()
}


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
        textArea.classList.toggle('completed', event.target.checked)
        updateTask(currentTodo.todo_id, event.target.checked)
    })

    textArea.addEventListener('keydown', async (event) => {
        if (event.key !== 'Enter') return
        event.preventDefault()

        const todo_name = textArea.value.trim()
        if (todo_name === '') return

        const taskCheck = await findTaskByName(todo_name)
        if (taskCheck.task_exists) {
            alert('Task already exists!')
            return
        }

        if (currentTodo === undefined) {
            currentTodo = await createTask(todo_name)
        } else {
            updateTask(currentTodo.todo_id, todo_name)
        }
        checkBox.disabled = false
    })

    removeTaskBtn.addEventListener('click', (event) => {
        event.target.parentElement.remove()
        if (currentTodo) deleteTask(currentTodo.todo_id)
    })

    container.appendChild(clone)
    textArea.focus()
}

async function loadTasks() {
    const todos = await getStoredTasks()
    todos.forEach(todo => taskTemplate(todo))
}