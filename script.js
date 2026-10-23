// Store tasks in an array
// Load saved tasks from Local Storage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Get HTML elements

const taskForm = document.getElementById("taskForm");

const taskName = document.getElementById("taskName");

const subject = document.getElementById("subject");

const deadline = document.getElementById("deadline");

const taskTable = document.getElementById("taskTable");

const search = document.getElementById("search");

const statusFilter = document.getElementById("statusFilter");


// Save tasks in Local Storage

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Display tasks

function displayTasks(list = tasks) {

    taskTable.innerHTML = "";


    if (list.length === 0) {

        document.getElementById("noTasks").style.display = "block";

    }

    else {

        document.getElementById("noTasks").style.display = "none";

    }


    list.forEach(function(task) {

        const row = document.createElement("tr");


        if (task.completed) {

            row.classList.add("completed");

        }


        row.innerHTML = `

            <td>${task.name}</td>

            <td>${task.subject}</td>

            <td>${task.deadline}</td>

            <td>
                ${task.completed ? "Completed" : "Pending"}
            </td>

            <td>

                <button
                    class="complete-btn"
                    onclick="completeTask(${task.id})"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>


                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </td>

        `;


        taskTable.appendChild(row);

    });


    updateDashboard();

}


// Add task

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name = taskName.value.trim();

    const subjectName = subject.value.trim();

    const date = deadline.value;


    // Clear previous errors

    document.getElementById("taskError").textContent = "";

    document.getElementById("subjectError").textContent = "";

    document.getElementById("dateError").textContent = "";


    let valid = true;


    // Form validation

    if (name === "") {

        document.getElementById("taskError").textContent =
            "Please enter a task name.";

        valid = false;

    }


    if (subjectName === "") {

        document.getElementById("subjectError").textContent =
            "Please enter a subject.";

        valid = false;

    }


    if (date === "") {

        document.getElementById("dateError").textContent =
            "Please select a deadline.";

        valid = false;

    }


    if (!valid) {

        return;

    }


    // Create task object

    const task = {

        id: Date.now(),

        name: name,

        subject: subjectName,

        deadline: date,

        completed: false

    };


    // Add object to array

    tasks.push(task);


    // Save data

    saveTasks();


    // Display updated list

    displayTasks();


    // Clear form

    taskForm.reset();

});


// Complete task

function completeTask(id) {

    const index = tasks.findIndex(function(task) {

        return task.id === id;

    });


    if (index !== -1) {

        tasks[index].completed =
            !tasks[index].completed;

    }


    saveTasks();

    displayTasks();

}


// Delete task

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// Edit task

function editTask(id) {

    const index = tasks.findIndex(function(task) {

        return task.id === id;

    });


    if (index === -1) {

        return;

    }


    const newName = prompt(
        "Enter new task name:",
        tasks[index].name
    );


    if (newName !== null && newName.trim() !== "") {

        tasks[index].name = newName.trim();

    }


    saveTasks();

    displayTasks();

}


// Search and filter

function searchTasks() {

    const searchText =
        search.value.toLowerCase();


    const filterValue =
        statusFilter.value;


    const result = tasks.filter(function(task) {

        const matchesSearch =
            task.name.toLowerCase().includes(searchText) ||
            task.subject.toLowerCase().includes(searchText);


        let matchesStatus = true;


        if (filterValue === "pending") {

            matchesStatus =
                task.completed === false;

        }


        if (filterValue === "completed") {

            matchesStatus =
                task.completed === true;

        }


        return matchesSearch && matchesStatus;

    });


    displayTasks(result);

}


// Search event

search.addEventListener(
    "input",
    searchTasks
);


// Filter event

statusFilter.addEventListener(
    "change",
    searchTasks
);


// Dashboard

function updateDashboard() {

    const total = tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed === true;

        }).length;


    const pending =
        tasks.filter(function(task) {

            return task.completed === false;

        }).length;


    document.getElementById("totalTasks").textContent =
        total;


    document.getElementById("pendingTasks").textContent =
        pending;


    document.getElementById("completedTasks").textContent =
        completed;

}


// API / Fetch

document.getElementById("loadUsers")
    .addEventListener("click", function() {

        fetch(
            "https://jsonplaceholder.typicode.com/users"
        )

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Network response was not successful."
                );

            }


            return response.json();

        })

        .then(function(users) {

            const usersDiv =
                document.getElementById("users");


            usersDiv.innerHTML = "";


            users.forEach(function(user) {

                const div =
                    document.createElement("div");


                div.classList.add("user");


                div.textContent =
                    user.name + " - " + user.email;


                usersDiv.appendChild(div);

            });

        })

        .catch(function(error) {

            document.getElementById("users").textContent =
                "Error loading data.";

            console.log(error);

        });

    });


// Display tasks when page loads

displayTasks();