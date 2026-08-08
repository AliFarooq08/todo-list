import "./styles.css";
import { addDays, format, intervalToDuration, isBefore } from 'date-fns';

let addList = document.getElementById("add-list");
let listForm = document.querySelector("#list-form");
let listContainer = document.querySelector("#home");
let currentTodoList = listContainer.value;
let listName = document.querySelector("#list-name");
let newOption = document.createElement("option");

let listDelete = document.querySelector("#delete-list");

let addTodo = document.getElementById("add-todo");
let todoForm = document.querySelector("#todo-form");
let todoList = document.querySelector(".todo-list");
let todosContainer = document.querySelector("#todos-container");
let createTodo = document.querySelector("#create-todo");

let titleInput = document.querySelector("#todo-title-input");
let descInput = document.querySelector("#todo-desc-input");
let dueDateInput = document.querySelector("#todo-date-input");
let dueTimeInput = document.querySelector("#todo-time-input");
let priorityInput = document.querySelector("input[name='Priority']:checked");
let notesInput = document.querySelector("#todo-notes-input");
let change = false;

let allTodos = [];
let allLists = [];

const today = format(new Date(), 'yyyy-MM-dd');
dueDateInput.min = today;
setInterval(() => {
    if (dueDateInput.value == today) {
        dueTimeInput.min = format(new Date(), 'HH:mm:ss');
    }
    else {
        if (dueTimeInput.hasAttribute("min")) {
            dueTimeInput.removeAttribute("min");
        }
    }
}, 1000);


class todoInfo {
    constructor(title, description, dueDate, dueTime, priority, notes, list, id) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.priority = priority;
        this.notes = notes;
        this.list = list;
        this.id = id
    }
}

listDelete.addEventListener("click", () => {
    if (allLists.length !== 1) {
        currentTodoList = listContainer.value;
        let tempCurrentList = currentTodoList
        for (let i = listContainer.options.length - 1; i>= 0; i--) {
            if (listContainer.options[i].value === tempCurrentList) {
                allLists.splice(allLists.indexOf(tempCurrentList), 1)

                listContainer.remove(i);
                currentTodoList = listContainer.value;
                localStorage.setItem("userSavedLists", JSON.stringify(allLists))     
                break;
            }
        }
    }
    else if (allLists.length === 1) {
        alert("Make a new list before deleting the last one!")
    }
})

listForm.addEventListener("submit", () => {
    let newOption = document.createElement("option");
    newOption.textContent = listName.value;
    newOption.value = listName.value;
    listContainer.appendChild(newOption);
    allLists.push(newOption.textContent)
    localStorage.setItem("userSavedLists", JSON.stringify(allLists))
    listName.value = ""
    addList.close()
});

createTodo.addEventListener("click", () => {
    change = false;
    titleInput.value = "";
    descInput.value = "";
    dueDateInput.value = "";
    dueTimeInput.value = "";
    notesInput.value = "";
});

todoForm.addEventListener("submit", () => {
    if (change === false) {
        titleInput = document.querySelector("#todo-title-input");
        descInput = document.querySelector("#todo-desc-input");
        dueDateInput = document.querySelector("#todo-date-input");
        dueTimeInput = document.querySelector("#todo-time-input");
        priorityInput = document.querySelector("input[name='Priority']:checked");
        notesInput = document.querySelector("#todo-notes-input");
        const newTodo = new todoInfo(titleInput.value, descInput.value, dueDateInput.value, dueTimeInput.value, priorityInput.value, notesInput.value, currentTodoList, crypto.randomUUID());
        titleInput.value = "";
        descInput.value = "";
        dueDateInput.value = "";
        dueTimeInput.value = "";
        priorityInput.value = "";
        notesInput.value = "";
        allTodos.push(newTodo);
        localStorage.setItem("userSavedTodos", JSON.stringify(allTodos));
        updateDisplay(allTodos);
        addTodo.close();        
    }
});

function addTodoDOM(object) {
    let todo = document.createElement("div");
    todo.id = "todo";

    let todoColLeft = document.createElement("div");
    todoColLeft.id = "todo-col1";

    let todoTitle = document.createElement("h1");
    todoTitle.innerHTML = `<strong>Title:</strong> ${object.title}`;
    todoTitle.className = "todo-text-adapt"

    let todoDescription = document.createElement("p");
    todoDescription.innerHTML = `<strong>Description:</strong> ${object.description}`;
    todoDescription.className = "todo-text-adapt"

    let todoColMid = document.createElement("div");
    todoColMid.id = "todo-col2";

    let todoPriority = document.createElement("p");
    todoPriority.innerHTML = `<strong>Priority:</strong> ${object.priority}`;
    
    let todoDate = document.createElement("p");
    todoDate.innerHTML = `<strong>Time Due:</strong> ${object.dueDate} ${object.dueTime}`;

    let todoColRight = document.createElement("div");
    todoColRight.id = "todo-col3";

    let todoNotes = document.createElement("p");
    todoNotes.innerHTML = `<strong>-Note:</strong> ${object.notes}`;
    todoNotes.className = "todo-text-adapt"

    let todoDelete = document.createElement("button");
    todoDelete.textContent = "Delete"
    todoDelete.id = "todo-delete";

    let todoChange = document.createElement("button");
    todoChange.textContent = "Change"
    todoChange.id = "todo-change";

    todoDelete.addEventListener("click", () => {
        let tempList = allTodos.filter(item => item.id !== object.id);
        allTodos = tempList;
        localStorage.setItem("userSavedTodos", JSON.stringify(allTodos));
        updateDisplay(allTodos);
    });

    todoChange.addEventListener("click", () => {
        change = true
        titleInput = document.querySelector("#todo-title-input");
        titleInput.value = object.title
        descInput = document.querySelector("#todo-desc-input");
        descInput.value = object.description
        dueDateInput = document.querySelector("#todo-date-input");
        dueDateInput.value = object.dueDate
        dueTimeInput = document.querySelector("#todo-time-input");
        dueTimeInput.value = object.dueTime
        notesInput = document.querySelector("#todo-notes-input");
        notesInput.value = object.notes
        addTodo.showModal();
        todoTitle.innerHTML = `<strong>Title:</strong> ${object.title}`;
        todoDescription.innerHTML = `<strong>Description:</strong> ${object.description}`;
        todoPriority.innerHTML = `<strong>Priority:</strong> ${object.priority}`;
        todoDate.innerHTML = `<strong>Time Due:</strong> ${object.dueDate} ${object.dueTime}`;
        todoNotes.innerHTML = `<strong>-Note:</strong> ${object.notes}`;
        todoForm.addEventListener("submit", () => {
            if (change === true) {
                object.title = titleInput.value
                object.description = descInput.value
                object.dueDate = dueDateInput.value
                object.dueTime = dueTimeInput.value
                priorityInput = document.querySelector("input[name='Priority']:checked");
                object.priority = priorityInput.value;
                object.notes = notesInput.value
                localStorage.setItem("userSavedTodos", JSON.stringify(allTodos));
                updateDisplay(allTodos);
                addTodo.close();        
            }
        });
    });

    todosContainer.appendChild(todo)
    todo.appendChild(todoColLeft)
    todo.appendChild(todoColMid)
    todo.appendChild(todoColRight)
    todoColLeft.appendChild(todoTitle)
    todoColLeft.appendChild(todoDescription)
    todoColMid.appendChild(todoPriority)
    todoColMid.appendChild(todoDate)
    todoColRight.appendChild(todoNotes)
    todoColRight.appendChild(todoDelete)
    todoColRight.appendChild(todoChange)
    const whenDue = new Date(`${object.dueDate}T${object.dueTime}`);
    let todoReminder = document.createElement("p")
    
    
    todoColMid.appendChild(todoReminder)
    setInterval(() => {
        let duration = intervalToDuration({start: new Date(), end: whenDue})
        
        if (isBefore(whenDue, new Date())) {
            todo.style.backgroundColor = "indianred"
            todoReminder.innerHTML = `Is currently due!`
        }
        else {
            todo.style.backgroundColor = "lightgreen"
            todoReminder.innerHTML = `<strong>Time Until Due:</strong> ${duration.years} years, ${duration.days} days, ${duration.hours} hours, ${duration.minutes} minutes, and ${duration.seconds} seconds.`.replace(/undefined/g, "0")

        }
    }, 1000);
}

function updateDisplay(array) {
    todosContainer.replaceChildren();
    array.forEach(object => {
        if (object.list == currentTodoList) {
            console.log("success!")
            addTodoDOM(object)
        }
    })
}

listContainer.addEventListener("change", (event) => {
    currentTodoList = listContainer.value;
    updateDisplay(allTodos);
})

window.addEventListener("load", () => {
    let tempAllLists = localStorage.getItem("userSavedLists")
    let tempAllTodos = localStorage.getItem("userSavedTodos")

    if (tempAllLists) {
        allLists = JSON.parse(tempAllLists)
        allLists.forEach((option) => {
            let refreshOption = document.createElement("option")
            refreshOption.textContent = option
            refreshOption.value = option
            listContainer.appendChild(refreshOption)
        })
    }
    if (tempAllTodos) {
        allTodos = JSON.parse(tempAllTodos)
        updateDisplay(allTodos);
    }
    if (localStorage.getItem("userSavedLists") === null && localStorage.getItem("userSavedTodos") === null) {
        console.log("First Initialization!")
        let initialOption = document.createElement("option")
        initialOption.value = "Example List!";
        initialOption.textContent = "Example List!";
        listContainer.appendChild(initialOption);
        currentTodoList = "Example List!";
        allLists.push(initialOption.textContent)
        localStorage.setItem("userSavedLists", JSON.stringify(allLists))
        let tttest = currentTodoList
        let ttest = new todoInfo("MyFirstTodo", "Its just a test with a soon to be due date!", today, "23:59:59", "Medium", "Will Soon Delete", tttest, crypto.randomUUID());
        allTodos.push(ttest)
        localStorage.setItem("userSavedTodos", JSON.stringify(allTodos));
        updateDisplay(allTodos);
    }
    else {
        currentTodoList = listContainer.value;
        updateDisplay(allTodos);
    }
});