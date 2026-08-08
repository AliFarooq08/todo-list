import "./styles.css";
import { addDays, format, intervalToDuration, isBefore, isAfter, isSameDay } from 'date-fns';

let addList = document.getElementById("add-list");
let listForm = document.getElementById("list-form");
let listContainer = document.getElementById("home");
let currentTodoList = listContainer.value;
let listName = document.getElementById("list-name");
let newOption = document.createElement("option");

let listDelete = document.getElementById("delete-list");

let addTodo = document.getElementById("add-todo");
let todoForm = document.getElementById("todo-form");
let todoList = document.getElementsByClassName("todo-list");
let todosContainer = document.getElementById("todos-container");
let createTodo = document.getElementById("create-todo");

let titleInput = document.getElementById("todo-title-input");
let descInput = document.getElementById("todo-desc-input");
let dueDateInput = document.getElementById("todo-date-input");
let dueTimeInput = document.getElementById("todo-time-input");
let priorityInput = document.querySelector("input[name='Priority']:checked");
let notesInput = document.getElementById("todo-notes-input");
let change = false;

let pastDue = document.getElementById("past-due")
let upcoming = document.getElementById("upcoming")
let important = document.getElementById("important")

let allTodos = [];
let allLists = [];

const todayDate = format(new Date(), 'yyyy-MM-dd');
const todayTime = format(new Date(), 'HH:mm:ss');
dueDateInput.min = todayDate;
setInterval(() => {
    if (dueDateInput.value == todayDate) {
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

pastDue.addEventListener("click", () => {
    updateDisplay(allTodos, "past due")
})
upcoming.addEventListener("click", () => {
    updateDisplay(allTodos, "upcoming")
})
important.addEventListener("click", () => {
    updateDisplay(allTodos, "important")
})













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
        updateDisplay(allTodos, "list");
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
    todoTitle.className = "todo-big-text-adapt"

    let todoDescription = document.createElement("p");
    todoDescription.innerHTML = `<strong>Description:</strong> ${object.description}`;
    todoDescription.className = "todo-text-adapt"

    let todoColMid = document.createElement("div");
    todoColMid.id = "todo-col2";

    let todoPriority = document.createElement("p");
    todoPriority.innerHTML = `<strong>Priority:</strong> ${object.priority}`;
    todoPriority.className = "todo-text-adapt"
    
    let todoDate = document.createElement("p");
    todoDate.innerHTML = `<strong>Time Due:</strong> ${object.dueDate} ${object.dueTime}`;
    todoDate.className = "todo-text-adapt"

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
        updateDisplay(allTodos, "list");
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
                updateDisplay(allTodos, "list");
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
    todoReminder.className = "todo-text-adapt"
    
    
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

function updateDisplay(array, type) {
    todosContainer.replaceChildren();
    if (type === "list") {
        array.forEach(object => {
            if (object.list == currentTodoList) {
                console.log("success!")
                addTodoDOM(object)
            }
        })        
    }
    if (type === "upcoming") {
        currentTodoList = ""
        array.forEach(object => {
            if (isAfter(object.dueDate, todayDate) || isSameDay(object.dueDate, todayDate) && object.dueTime > todayTime) {
                console.log("success!")
                addTodoDOM(object)
            }
        })
    }
    if (type === "past due") {
        currentTodoList = ""
        array.forEach(object => {
            if (isBefore(object.dueDate, todayDate) || isSameDay(object.dueDate, todayDate) && object.dueTime < todayTime) {
                console.log("success!")
                addTodoDOM(object)
            }
        })
    }
    if (type === "important") {
        currentTodoList = ""
        array.forEach(object => {
            if (object.priority === "High") {
                console.log("success!")
                addTodoDOM(object)
            }
        })            
    }

}

listContainer.addEventListener("change", () => {
    currentTodoList = listContainer.value;
    updateDisplay(allTodos, "list");
})
listContainer.addEventListener("click", () => {
    currentTodoList = listContainer.value;
    updateDisplay(allTodos, "list");
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
        updateDisplay(allTodos, "list");
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
        let ttest = new todoInfo("MyFirstTodo", "Its just a test with a soon to be due date!", todayDate, "23:59:59", "Medium", "Will Soon Delete", tttest, crypto.randomUUID());
        allTodos.push(ttest)
        localStorage.setItem("userSavedTodos", JSON.stringify(allTodos));
        updateDisplay(allTodos, "list");
    }
    else {
        currentTodoList = listContainer.value;
        updateDisplay(allTodos, "list");
    }
});