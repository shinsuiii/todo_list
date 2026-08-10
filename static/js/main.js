const template = document.getElementById('todo-template')
const container = document.getElementById('todo-main')
const addTaskBtn = document.getElementById('add-task')

async function getStoredTasks() {
    const response = await fetch('http://127.0.0.1:8000/todos')
    const todo = await response.json()
    console.log(todo)
}

document.addEventListener('DOMContentLoaded', () => {
    getStoredTasks()
})

addTaskBtn.addEventListener('click', (event) => {
    const clone = document.importNode(template.content, true)

    const checkBox = clone.querySelector('input[type="checkbox"]')
    const textArea = clone.querySelector('.task-field')
    const removeTaskBtn = clone.querySelector('.delete-task-btn')

    checkBox.disabled = true
    
    checkBox.addEventListener('change', (event) => {
        if (event.target.checked) {
            textArea.classList.add('completed')
        } else {
            textArea.classList.remove('completed')
        }
    })

    textArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (textArea.value !== '') checkBox.disabled = false
            // createTask()
        }
    })

    removeTaskBtn.addEventListener('dblclick', (event) => {
        event.target.parentElement.remove()
    })

    container.appendChild(clone)
    textArea.focus()
})
