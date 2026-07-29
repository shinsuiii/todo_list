const taskContainer = document.querySelector(".todo-main")

function setupTask(task) {
    const taskField = task.querySelector(".task-field")
    const deleteButton = task.querySelector(".delete-task-btn")
    const checkBox = task.querySelector("input[type='checkbox']")
    
    let taskEntered = taskField.value.trim() !== ""
    checkBox.disabled = taskField.value.trim() === ""

    taskField.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return
        event.preventDefault()

        const taskName = taskField.value.trim()
        if (taskName === "") return
        taskField.placeholder = ""
        
        const lastTask = taskContainer.lastElementChild
        const lastTaskField = lastTask.querySelector(".task-field")

        if (lastTaskField.value.trim() === "") {
            lastTaskField.focus()
            return
        }

        taskEntered = true
        checkBox.disabled = false

        const newTask = task.cloneNode(true)
        newTask.removeAttribute("id")

        const newTaskField = newTask.querySelector(".task-field")
        newTaskField.value = ""
        newTaskField.placeholder = "Add a new task..."
        
        taskContainer.appendChild(newTask)
        setupTask(newTask)
        newTaskField.focus()
    })
    
    deleteButton.addEventListener("click", () => {
        if (!taskEntered) return
        task.remove()
    })

    checkBox.addEventListener("change", (event) => {
        if (event.target.checked) {
            taskField.classList.add("completed")
        } else {
            taskField.classList.remove("completed")
        }
    })
}

const originalTask = document.querySelector("#original-task")
setupTask(originalTask)