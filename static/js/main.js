const template = document.getElementById('todo-template')
const container = document.getElementById('todo-main')
const addTaskBtn = document.getElementById('add-task')

// function taskTemplate(todos) {
//     console.log(todos)
//     todos.forEach((todo), () => {
//         const clone = document.importNode(template.content, true)
        
//         const checkBox = clone.querySelector('input[type="checkbox"]')
//         checkBox.addEventListener('change', (event) => {
//             if (event.target.checked) {
//                 textArea.classList.add('completed')
//             } else {
//                 textArea.classList.remove('completed')
//             }
//         })
    
//         const textArea = clone.querySelector('.task-field')
//         textArea.value = todo.todo_name
//         textArea.addEventListener('keydown', (event) => {
//             if (event.key === 'Enter') {
//                 event.preventDefault()
//                 if (textArea.value !== '') checkBox.disabled = false
//                 // createTask()
//             }
//         })
    
//         const removeTaskBtn = clone.querySelector('.delete-task-btn')
//         removeTaskBtn.addEventListener('dblclick', (event) => {
//             event.target.parentElement.remove()
//         })
    
//         container.appendChild(clone)
//         textArea.focus()
//     })
// }

function taskTemplate(todo) {
    const clone = document.importNode(template.content, true)
    
    const checkBox = clone.querySelector('input[type="checkbox"]')
    checkBox.disabled = true
    checkBox.addEventListener('change', (event) => {
        if (event.target.checked) {
            textArea.classList.add('completed')
        } else {
            textArea.classList.remove('completed')
        }
    })

    const textArea = clone.querySelector('.task-field')
    textArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (textArea.value !== '') checkBox.disabled = false
            // createTask()
        }
    })

    const removeTaskBtn = clone.querySelector('.delete-task-btn')
    removeTaskBtn.addEventListener('dblclick', (event) => {
        event.target.parentElement.remove()
    })

    if (todo) {
        textArea.value = todo.todo_name
        checkBox.disabled = false
    }

    container.appendChild(clone)
    textArea.focus()
}


async function getStoredTasks() {
    const response = await fetch('http://127.0.0.1:8000/todos', {method: 'GET'})
    const todos = await response.json()

    todos.forEach((todo) => {
        taskTemplate(todo)
    });
}


addTaskBtn.addEventListener('click', (event) => {
    taskTemplate()
})


getStoredTasks()