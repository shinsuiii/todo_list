const BASE_URL = 'http://127.0.0.1:8000'


// User Signup and Login
export async function getUser(text_type, identifier) {
    const params = new URLSearchParams({ text_type, identifier })
    const response = await fetch(`${BASE_URL}/signup/users?${params.toString()}`)
    return await response.json()
}

export async function createAccountRequest(user_info) {
    const response = await fetch(`${BASE_URL}/signup/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user_info)
    })
    return await response.json()
}

export async function loginAccountRequest(login_info) {
    const response = await fetch(`${BASE_URL}/login/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login_info)
    })
    return await response.json()
}


// Task Operations
export async function getStoredTasks() {
    const response = await fetch(`${BASE_URL}/todos`)
    return await response.json()
}

export async function findTaskByName(todo_name) {
    const response = await fetch(`${BASE_URL}/todos?name=${encodeURIComponent(todo_name)}`)
    return await response.json()
}

export async function createTask(todo_name) {
    const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: todo_name })
    })
    return await response.json()
}

export async function updateTask(id, update) {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ update })
    })
    return await response.json()
}

export async function deleteTask(id) {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE'
    })
    return await response.json()
}
