const template = document.getElementById('todo-template')
const container = document.getElementById('todo-main')
const addTaskBtn = document.getElementById('add-task')

const overlay = document.getElementById('modalOverlay')
const modal = document.getElementById('modalContainer')
const signupBtn = document.getElementById('signupBtn')
const signupForm = document.getElementById('panelSignUp')
const switchToSignup = document.getElementById('switchToSignup')
const loginBtn = document.getElementById('loginBtn')
const loginForm = document.getElementById('panelLogIn')
const switchToLogin = document.getElementById('switchToLogin')
const closeFormBtn = document.getElementById('closeModal')


// modal.style.height = '20.75rem'

const eyeIcons = document.querySelectorAll('.fieldImg')

signupBtn.addEventListener('click', () => {
    showModal(signupForm)
})

switchToSignup.addEventListener('click', () => {
    showModal(signupForm)
})

loginBtn.addEventListener('click', () => {
    showModal(loginForm)
})

switchToLogin.addEventListener('click', () => {
    showModal(loginForm)
})

closeFormBtn.addEventListener('click', () => {
    hideModal()
})

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideModal()
    }
})

eyeIcons.forEach(eye => {
    eye.addEventListener('click', (event) => {
        const passwordInputField = event.target.previousElementSibling
        if (passwordInputField.type === 'password') {
            passwordInputField.type = 'text'
            eye.src = '../assets/img/eye-open.svg'
        } else {
            passwordInputField.type = 'password'
            eye.src = '../assets/img/eye-closed.svg'
        }
    })
})

function showModal(form) {
    overlay.classList.remove('hidden')
    modal.classList.remove('hidden')

    signupForm.classList.add('hidden')
    loginForm.classList.add('hidden')

    if (form.id === 'panelSignUp') {
        modal.style.height = '26.75rem'
    } else if (form.id === 'panelLogIn') {
        modal.style.height = '22rem'
    }

    form.classList.remove('hidden')
}

function hideModal() {
    overlay.classList.add('hidden')
    modal.classList.add('hidden')
    signupForm.classList.add('hidden')
    loginForm.classList.add('hidden')
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
        if (event.target.checked) {
            textArea.classList.add('completed')
            updateTask(currentTodo.todo_id, true)
        } else {
            textArea.classList.remove('completed')
            updateTask(currentTodo.todo_id, false)
        }
    })

    textArea.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            
            const todo_name = textArea.value.trim()
            if (todo_name === '') return

            const taskCheck = await getTasks(todo_name)
            
            if (taskCheck.task_exists) {
                alert("Task already exists!")
                return
            }
            if (currentTodo === undefined) {
                currentTodo = await createTask(todo_name)
            } else {
                updateTask(currentTodo.todo_id, todo_name)
            }
            checkBox.disabled = false
        }
    })

    removeTaskBtn.addEventListener('click', (event) => {
        event.target.parentElement.remove()
        if (currentTodo) deleteTask(currentTodo.todo_id)
    })

    container.appendChild(clone)
    textArea.focus()
}

async function getTasks(todo_name) {
    if (!todo_name) {
        const response = await fetch('http://127.0.0.1:8000/todos')
        const todos = await response.json()   
        todos.forEach((todo) => {
            taskTemplate(todo)
        });

    } else {
        const response = await fetch(`http://127.0.0.1:8000/todos?name=${encodeURIComponent(todo_name)}`)
        return await response.json()
    }
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