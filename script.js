const main = document.querySelector("main");
const form = document.querySelector("form");
const inputVal = document.querySelector("#title");
const descVal = document.querySelector("#description");
const submitBtn = document.querySelector("#submit_btn");
const tasksContainer = document.createElement("div");
tasksContainer.classList.add("tasks");
main.appendChild(tasksContainer);
let editingId = null;

const tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

const createElements = (type, classList = "", content = "", id = '') => {
    const createdElem = document.createElement(type);
    if (Array.isArray(classList)) {
        createdElem.classList.add(...classList);
    } else if (classList) {
        createdElem.classList.add(classList);
    } else if (id) {
        createdElem.setAttribute("id", `${id}`);
    }

    if (content) createdElem.textContent = content;
    return createdElem;
}

const createTasks = () => {
    tasksContainer.innerHTML = "";

    if (tasks.length === 0) {
        const noTaskMsg = createElements("p", "no_msg", "!No Task added Yet. Add Your first Task");
        tasksContainer.appendChild(noTaskMsg);
    } else {
        tasks.forEach((item, index) => {
            const task = createElements("div", ["task", "task-item"]);
            if (item.completed) {
                task.classList.add("completed");
            }
            const title = createElements("h3", ["title_elem", "text-large"], item.title);
            const desc = createElements("p", "desc_elem", item.description);
            const ctrl = createElements("div", "ctrl");

            const deleteBtn = createElements("button", "delete", "❌");
            deleteBtn.addEventListener("click", () => deleteTasks(index));

            const checkBtn = createElements("button", "check", `${item.completed ? "✅" : "☑️"}`);
            checkBtn.addEventListener("click", () => toggleTasks(index));

            const editBtn = createElements("button", "edit", "📝");
            editBtn.addEventListener("click", () => updateTasks(item));

            ctrl.appendChild(editBtn);
            ctrl.appendChild(deleteBtn);
            ctrl.appendChild(checkBtn);
            task.appendChild(ctrl);
            task.appendChild(title);
            task.appendChild(desc);
            tasksContainer.appendChild(task);
        });
    }
}

const deleteTasks = (index) => {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTasks();
}
const updateTasks = (task) => {
    inputVal.value = task.title;
    descVal.value = task.description;
    editingId = task.id;
    submitBtn.value = "Update Task";
}
const toggleTasks = (index) => {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTasks();
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputVal.value === "" && descVal.value === "") return;

    if (editingId !== null) {
        const taskIndex = tasks.findIndex(task => task.id === editingId);
        if (taskIndex !== -1) {
            tasks[taskIndex].title = inputVal.value;
            tasks[taskIndex].description = descVal.value;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            createTasks();
        }
        editingId = null;
        submitBtn.value = "Add Task";
    } else {
        tasks.push({
            id: Date.now(),
            title: inputVal.value,
            description: descVal.value,
            completed: false,
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        createTasks();
    }

    inputVal.value = "";
    descVal.value = "";
});
createTasks();