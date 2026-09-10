const template = document.getElementById('todo-template')
const container = document.getElementById('todo-main')
const addTaskBtn = document.getElementById('add-task')
const overlay = document.getElementById('modalOverlay')
const modal = document.getElementById('modalContainer')
const closeFormBtn = document.getElementById('closeModal')

const signupBtn = document.getElementById('signupBtn')
const loginBtn = document.getElementById('loginBtn')

const signupForm = document.getElementById('panelSignUp')
const loginForm = document.getElementById('panelLogIn')

const switchToSignup = document.getElementById('switchToSignup')
const switchToLogin = document.getElementById('switchToLogin')

const createAccountBtn = document.getElementById('createAccountBtn')
const loginAccountBtn = document.getElementById('loginAccountBtn')

const signupUsernameField = document.getElementById('signupUsername')
const signupEmailField = document.getElementById('signupEmail')
const signupPasswordField = document.getElementById('signupPassword')
const loginIdentifierField = document.getElementById('loginIdentifier')
const loginPasswordField = document.getElementById('loginPassword')

const regexUsername = /^[a-zA-Z0-9_ ]{3,30}$/
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

const usernameTooltip = document.getElementById('usernameTooltip')
const usernameTooltipError = document.getElementById('usernameTooltipError')
const emailTooltip = document.getElementById('emailTooltip')
const emailTooltipError = document.getElementById('emailTooltipError')

const eyeIcons = document.querySelectorAll('.fieldImg')
const remPerError = 3

const modalUserAccNav = document.getElementById('modalUserAccNav')
const userAccountNav = document.getElementById('userAccount')
const userAccNavClose = document.getElementById('userAccNavCloseBtn')
const userAccNavLogin = document.getElementById('userAccNavLogin')
const userAccNavLogout = document.getElementById('userAccNavLogout')



// User Registration
userAccountNav.addEventListener('click', () => {
    modalUserAccNav.classList.toggle('hidden', !modalUserAccNav.classList.contains('hidden'))
})
userAccNavClose.addEventListener('click', () => {
    modalUserAccNav.classList.add('hidden')
})

signupBtn.addEventListener('click', () => {
    showModal(signupForm)
    signupUsernameField.focus()
})

switchToSignup.addEventListener('click', () => {
    showModal(signupForm)
    signupUsernameField.focus()
})

loginBtn.addEventListener('click', () => {
    showModal(loginForm)
    loginEmailField.focus()
})

switchToLogin.addEventListener('click', () => {
    showModal(loginForm)
    loginEmailField.focus()
})

closeFormBtn.addEventListener('click', () => {
    hideModal()
})

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideModal()
    }
})

usernameTooltip.addEventListener('mouseenter', () => {
    usernameTooltipError.classList.remove('hidden')
})
usernameTooltip.addEventListener('mouseleave', () => {
    usernameTooltipError.classList.add('hidden')
})

emailTooltip.addEventListener('mouseenter', () => {
    emailTooltipError.classList.remove('hidden')
})
emailTooltip.addEventListener('mouseleave', () => {
    emailTooltipError.classList.add('hidden')
})

eyeIcons.forEach(eye => {
    eye.addEventListener('click', (event) => {
        const passwordInputField = event.target.previousElementSibling
        if (passwordInputField.type === 'password') {
            passwordInputField.type = 'text'
            eye.src = '/static/assets/img/eye-open.svg'
        } else {
            passwordInputField.type = 'password'
            eye.src = '/static/assets/img/eye-closed.svg'
        }
    })
})

createAccountBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    createAccountBtn.disabled = true
    if (document.activeElement.tagName === 'INPUT') document.activeElement.blur()
    
    const [usernameExists, emailExists] = await Promise.all([
        checkUserExistence('text', signupUsernameField.value),
        checkUserExistence('email', signupEmailField.value)
    ])
    const visibleErrors = signupForm.querySelectorAll('.errorMessage:not(.hidden)').length

    if (!usernameExists && !emailExists && visibleErrors === 0) {
        const modalCreatedAccount = document.querySelector('.modalAccCreated')

        const user_info = {
            username: signupUsernameField.value,
            email: signupEmailField.value,
            password: signupPasswordField.value,
        }
        await createAccount(user_info)

        hideModal()
        overlay.classList.remove('hidden')
        modalCreatedAccount.classList.remove('hidden')
        setTimeout(() => {
            overlay.classList.add('hidden')
            modalCreatedAccount.classList.add('hidden')
        }, 3000)

        signupForm.querySelectorAll('input').forEach(inputField => inputField.value = '')
    }
    createAccountBtn.disabled = false
})

loginAccountBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    loginAccountBtn.disabled = true
    if (loginIdentifierField.value === '' || loginPasswordField.value === '') return false

    const login_info = {
        identifier: loginIdentifierField.value,
        password: loginPasswordField.value
    }
    const login_success = await loginToAccount(login_info)
    // const errorLogin = document.getElementById('errorLogin') // IDK WHY I WROTE THIS;
    const modalLoginSuccessfully = document.querySelector('.modalAccLogin')

    if (login_success) {
        hideModal()
        overlay.classList.remove('hidden')
        modalLoginSuccessfully.classList.remove('hidden')
        setTimeout(() => {
            overlay.classList.add('hidden')
            modalLoginSuccessfully.classList.add('hidden')
        }, 3000);
        loginForm.querySelectorAll('input').forEach(inputField => inputField.value = '')
    }

    errorLogin.classList.toggle('hidden', login_success)
    adjustModalHeight()
    loginAccountBtn.disabled = false
})

function showModal(form) {
    overlay.classList.remove('hidden')
    modal.classList.remove('hidden')

    signupForm.classList.add('hidden')
    loginForm.classList.add('hidden')
    form.classList.remove('hidden')

    adjustModalHeight()
}

function hideModal() {
    overlay.classList.add('hidden')
    modal.classList.add('hidden')
    signupForm.classList.add('hidden')
    loginForm.classList.add('hidden')
}

function adjustModalHeight() {
    const activeForm = signupForm.classList.contains('hidden') ? loginForm : signupForm
    if (activeForm.classList.contains('hidden')) return

    const baseHeight = activeForm === signupForm ? 26.75 : 22
    const visibleErrors = activeForm.querySelectorAll('.errorMessage:not(.hidden)').length
    modal.style.height = `${baseHeight + (visibleErrors * remPerError)}rem`
}

function checkField (field, error, regex) {
    error.classList.toggle('hidden', regex.test(field.value.trim()))
    adjustModalHeight()
}

async function checkUserExistence(text_type, identifier) {
    if (text_type === 'password') return false
    try {
        const exists = await getUser(text_type, identifier)
        const tooltip = text_type === 'email' ? emailTooltip : usernameTooltip
        tooltip.classList.toggle('hidden', !exists)
        return exists    
    } catch (error) {
        error.log('Error fetching data: ', error)
        return false
    }
}

function blurValidation (field, error, regex) {
    let blurred = false
    field.addEventListener('input', () => {
        if (blurred) {
            checkField(field, error, regex)
        }
    })
    field.addEventListener('blur', async () => {
        blurred = true
        checkField(field, error, regex)
        await checkUserExistence(field.type, field.value)
    })
}

async function getUser(text_type, identifier) {
    const params = new URLSearchParams({
        text_type: text_type,
        identifier: identifier
    })
    const response = await fetch(`http://127.0.0.1:8000/signup/users?${params.toString()}`)
    return await response.json()
}

async function createAccount(user_info) {
    const response = await fetch('http://127.0.0.1:8000/signup/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: user_info.username,
            email: user_info.email,
            password: user_info.password,
        })
    })
    return await response.json()
}

async function loginToAccount(login_info) {
    const response = await fetch('http://127.0.0.1:8000/login/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            identifier: login_info.identifier,
            password: login_info.password,
        })
    })
    return await response.json()
}



// Task Operations
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



blurValidation(signupUsernameField, document.getElementById('errorUsername'), regexUsername)
blurValidation(signupEmailField, document.getElementById('errorEmail'), regexEmail)
blurValidation(signupPasswordField, document.getElementById('errorPassword'), regexPassword)
getTasks()